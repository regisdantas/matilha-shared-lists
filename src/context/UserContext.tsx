import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { produce } from 'immer';
import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import { database } from '../services/firebase';
import { useAuth } from './AuthContext';
import { UserData, Action, Family, List, Item  } from '../types/userTypes';
import { nanoid } from 'nanoid';

function generateHandle() {
  return `user_${nanoid(6)}`; // e.g., "user_d4K9xT"
}

type State = {
  userData: UserData;
  pastStates: UserData[];
};

const initialUserData: UserData = {
  name: '',
  handle: '',
  phone: '',
  email: '',
  families: [],
  selectedFamily: "laradantas"
};

const initialState: State = {
  userData: initialUserData,
  pastStates: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_USER_DATA':
      return {
        userData: action.payload,
        pastStates: [],
      };

    case 'UNDO':
      if (state.pastStates.length === 0) return state;
      const previous = state.pastStates[state.pastStates.length - 1];
      return {
        userData: previous,
        pastStates: state.pastStates.slice(0, -1),
      };

    // Ações que alteram userData -> geram novo estado + empurram para pastStates
    default: {
      // Aplicar mutações com immer e salvar estado anterior
      const newUserData = produce(state.userData, draft => {
        switch (action.type) {
          case 'ADD_FAMILY':
            draft.families.push(action.payload);
            break;
          case 'REMOVE_FAMILY':
            draft.families = draft.families.filter(f => f.handle !== action.payload.familyHandle);
            break;
          case 'EDIT_FAMILY':
            {
              const handlex = draft.families.findIndex(f => f.handle === action.payload.handle);
              if (handlex >= 0) draft.families[handlex] = action.payload;
            }
            break;
          case 'ADD_LIST':
            {
              const family = draft.families.find(f => f.handle === action.payload.familyHandle);
              action.payload.list.handle = `list_${nanoid(6)}`;
              if (family) family.lists.push(action.payload.list);
            }
            break;
          case 'REMOVE_LIST':
            {
              const family = draft.families.find(f => f.handle === action.payload.familyHandle);
              if (family) family.lists = family.lists.filter(l => l.handle !== action.payload.listHandle);
            }
            break;
          case 'EDIT_LIST':
            {
              const family = draft.families.find(f => f.handle === action.payload.familyHandle);
              if (family) {
                const handlex = family.lists.findIndex(l => l.handle === action.payload.list.handle);
                if (handlex >= 0) family.lists[handlex] = action.payload.list;
              }
            }
            break;
          case 'ADD_ITEM':
            {
              const family = draft.families.find(f => f.handle === action.payload.familyHandle);
              if (family) {
                const list = family.lists.find(l => l.handle === action.payload.listHandle);
                action.payload.item.handle = `item_${nanoid(6)}`;
                if (list) list.items.push(action.payload.item);
              }
            }
            break;
          case 'REMOVE_ITEM':
            {
              const family = draft.families.find(f => f.handle === action.payload.familyHandle);
              if (family) {
                const list = family.lists.find(l => l.handle === action.payload.listHandle);
                if (list) list.items = list.items.filter(i => i.handle !== action.payload.itemHandle);
              }
            }
            break;
          case 'TOGGLE_ITEM':
            {
              const family = draft.families.find(f => f.handle === action.payload.familyHandle);
              if (family) {
                const list = family.lists.find(l => l.handle === action.payload.listHandle);
                if (list) {
                  const item = list.items.find(i => i.handle === action.payload.itemHandle);
                  if (item) item.checked = !item.checked;
                }
              }
            }
            break;
            case 'EDIT_ITEM':
            {
              const family = draft.families.find(f => f.handle === action.payload.familyHandle);
              if (family) {
                const list = family.lists.find(l => l.handle === action.payload.listHandle);
                if (list) {
                  const item = list.items.find(i => i.handle === action.payload.item.handle);
                  if (item) item.text = action.payload.item.text;
                }
              }
            }
            break;
            case 'SELECT_FAMILY':
              draft.selectedFamily = action.payload.familyHandle;
            break;
          default:
            break;
        }
      });

      return {
        userData: newUserData,
        pastStates: [...state.pastStates, state.userData],
      };
    }
  }
}

type UserContextType = {
  userData: UserData;
  dispatchAction: React.Dispatch<Action>;
  undo: () => void;
  canUndo: boolean;
  saveToFirebase: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar do Firebase na montagem
  useEffect(() => {
    async function fetchItems(familyId: string, listId: string): Promise<Item[]> {
        const itemsRef = collection(database, `families/${familyId}/lists/${listId}/items`);
        const snapshot = await getDocs(itemsRef);

        const items: Item[] = [];

        for (const docSnap of snapshot.docs) {
            const data = docSnap.data();

            items.push({
            id: docSnap.id,
            handle: data.handle ?? '',
            icon: data.icon ?? '',
            text: data.text ?? '',
            checked: data.checked ?? false,
            addedBy: data.addedBy ?? '',
            });
        }

        return items;
    }

    async function fetchLists(familyId: string, familyHandle: string): Promise<List[]> {
        const listsRef = collection(database, `families/${familyId}/lists`);
        const snapshot = await getDocs(listsRef);

        const lists: List[] = [];
        for (const docSnap of snapshot.docs) {
            const data = docSnap.data();
            const items: Item[] = await fetchItems(familyId, docSnap.id);
            lists.push({
                id: docSnap.id,
                handle: data.handle ?? '',
                icon: data.icon ?? '',
                name: data.name ?? '',
                favorite: data.favorite ?? false,
                familyHandle: familyHandle,
                items,
                ownerHandle: data.ownerHandle ?? '',
            });
        }

        return lists;
        }

    async function fetchUserFamilies(userHandle: string): Promise<Family[]> {
        const familiesRef = collection(database, 'families');
        const snapshot = await getDocs(familiesRef);

        const userFamilies: Family[] = [];

        for (const docSnap of snapshot.docs) {
            const data = docSnap.data();

            if (Array.isArray(data.membersHandle) && data.membersHandle.includes(userHandle)) {
            userFamilies.push({
                id: docSnap.id,
                handle: data.handle ?? '',
                name: data.name ?? '',
                membersHandle: data.membersHandle,
                lists: await fetchLists(docSnap.id, data.handle),
            });
            }
        }
        return userFamilies;
    }

    async function fetchUser() {
      if (!user?.uid) return;
      setLoading(true);
      try {
        const ref = doc(database, 'users', user.uid);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          const data = snapshot.data();
          const loadedUserData: UserData = {
            name: data?.name ?? '',
            handle: data?.handle ?? '',
            phone: data?.phone ?? '',
            email: data?.['e-mail'] ?? '',
            families: await fetchUserFamilies(data?.handle) ?? [],
            selectedFamily: "favoritos"
          };
          dispatch({ type: 'LOAD_USER_DATA', payload: loadedUserData });
        } else {
          await setDoc(doc(database, 'users', user.uid), {
            name: '',
            handle: '',
            phone: '',
            'e-mail': '',
            families: [],
          });
          dispatch({ type: 'LOAD_USER_DATA', payload: initialUserData });
        }
      } catch (err: any) {
        setError(err.message);
        console.error(err.message)
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [user?.uid]);

  // Função para salvar estado atual no Firebase
  const saveToFirebase = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const saveUser = async () => {
        try {
          await setDoc(doc(database, 'users', user.uid), {
          name: state.userData.name,
          handle: state.userData.handle,
          phone: state.userData.phone,
          'e-mail': state.userData.email,
          families: state.userData.families.map((family) => family.handle),
        });
          console.log('Famílias salvas com sucesso.');
        } catch (error) {
          console.error('Erro ao salvar famílias:', error);
        }
      }

      const saveFamilies = async (families: Family[]) => {
        try {
          for (const family of families) {
            const familyRef = doc(database, 'families', family.id);

            // Salva a família com os membros
            await setDoc(familyRef, {
              handle: family.handle,
              name: family.name,
              membersHandle: family.membersHandle,
            });

            for (const list of family.lists) {
              const listRef = doc(database, `families/${family.id}/lists`, list.id);

              // Salva a lista (sem os itens ainda)
              await setDoc(listRef, {
                handle: list.handle,
                name: list.name,
                icon: list.icon,
                favorite: list.favorite,
                familyHandle: family.handle,
                ownerHandle: list.ownerHandle,
              });

              for (const item of list.items) {
                const itemRef = doc(database, `families/${family.id}/lists/${list.id}/items`, item.id);

                // Salva cada item individualmente
                await setDoc(itemRef, {
                  handle: item.handle,
                  icon: item.icon,
                  text: item.text,
                  checked: item.checked,
                  addedBy: item.addedBy,
                });
              }
            }
          }
          console.log('Famílias salvas com sucesso.');
        } catch (error) {
          console.error('Erro ao salvar famílias:', error);
        }
      };

      await saveFamilies(state.userData.families);
      await saveUser();
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const undo = () => {
    dispatch({ type: 'UNDO' });
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      undo();
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return (
    <UserContext.Provider
      value={{
        userData: state.userData,
        dispatchAction: dispatch,
        undo,
        canUndo: state.pastStates.length > 0,
        saveToFirebase,
        loading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser deve ser usado dentro do UserProvider');
  return context;
};
