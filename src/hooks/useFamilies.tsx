import { useState, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { database } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export interface Family {
  id: string;
  admins: string[];
  handle: string;
  members: string[];
  name: string;
  owner: string;
  lists?: string[];
}

export interface FamilyList {
  id: string;
  family: string;
  handle: string;
  name: string;
  owner: string;
  items?: ListItem[];
}

export interface ListItem {
  id: string;
  addedBy: string;
  checked: boolean;
  text: string;
}

export function useFamilies() {
  const { user } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [familyLists, setFamilyLists] = useState<FamilyList[]>([]);
  const [currentFamily, setCurrentFamily] = useState<Family | null>(null);
  const [currentList, setCurrentList] = useState<FamilyList | null>(null);
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const fetchFamilies = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const userRef = doc(database, 'users', user.uid);
      const userSnapshot = await getDoc(userRef);
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const familyIds = userData?.families || [];
        
        const familiesData: Family[] = [];
        for (const familyId of familyIds) {
          const familyRef = doc(database, 'families', familyId);
          const familySnapshot = await getDoc(familyRef);
          if (familySnapshot.exists()) {
            familiesData.push({
              id: familyId,
              ...familySnapshot.data()
            } as Family);
          }
        }
        
        setFamilies(familiesData);
      }
    } catch (err: any) {
      console.error('Error fetching families:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFamilyLists = async (familyId: string) => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const listsQuery = query(
        collection(database, 'families', familyId, 'lists'),
        where('family', '==', familyId)
      );
      
      const querySnapshot = await getDocs(listsQuery);
      const listsData: FamilyList[] = [];
      
      querySnapshot.forEach((doc) => {
        listsData.push({
          id: doc.id,
          ...doc.data()
        } as FamilyList);
      });
      
      setFamilyLists(listsData);
    } catch (err: any) {
      console.error('Error fetching family lists:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchListItems = async (familyId: string, listId: string) => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const itemsQuery = query(
        collection(database, 'families', familyId, 'lists', listId, 'items')
      );
      
      const querySnapshot = await getDocs(itemsQuery);
      const itemsData: ListItem[] = [];
      
      querySnapshot.forEach((doc) => {
        itemsData.push({
          id: doc.id,
          ...doc.data()
        } as ListItem);
      });
      
      setListItems(itemsData);
    } catch (err: any) {
      console.error('Error fetching list items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createFamily = async (familyData: Omit<Family, 'id' | 'members' | 'admins'>) => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const familyRef = doc(collection(database, 'families'));
      await setDoc(familyRef, {
        ...familyData,
        owner: user.uid,
        members: [user.uid],
        admins: [user.uid]
      });
      
      const userRef = doc(database, 'users', user.uid);
      await updateDoc(userRef, {
        families: arrayUnion(familyRef.id)
      });
      
      await fetchFamilies();
      return familyRef.id;
    } catch (err: any) {
      console.error('Error creating family:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createFamilyList = async (familyId: string, listData: Omit<FamilyList, 'id' | 'family' | 'owner'>) => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const listRef = doc(collection(database, 'families', familyId, 'lists'));
      await setDoc(listRef, {
        ...listData,
        family: familyId,
        owner: user.uid
      });
      
      await fetchFamilyLists(familyId);
      return listRef.id;
    } catch (err: any) {
      console.error('Error creating family list:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addListItem = async (familyId: string, listId: string, itemData: Omit<ListItem, 'id' | 'addedBy' | 'checked'>) => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const itemRef = doc(collection(database, 'families', familyId, 'lists', listId, 'items'));
      await setDoc(itemRef, {
        ...itemData,
        addedBy: user.uid,
        checked: false
      });
      
      await fetchListItems(familyId, listId);
      return itemRef.id;
    } catch (err: any) {
      console.error('Error adding list item:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const toggleListItem = async (familyId: string, listId: string, itemId: string, checked: boolean) => {
    setLoading(true);
    try {
      const itemRef = doc(database, 'families', familyId, 'lists', listId, 'items', itemId);
      await updateDoc(itemRef, {
        checked
      });
      
      await fetchListItems(familyId, listId);
    } catch (err: any) {
      console.error('Error toggling list item:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectFamily = async (family: Family) => {
    setCurrentFamily(family);
    await fetchFamilyLists(family.id);
  };

  const selectList = async (list: FamilyList) => {
    setCurrentList(list);
    if (currentFamily) {
      await fetchListItems(currentFamily.id, list.id);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchFamilies();
    }
  }, [user?.uid]);

  return {
    families,
    familyLists,
    listItems,
    currentFamily,
    currentList,
    loading,
    error,
    fetchFamilies,
    fetchFamilyLists,
    fetchListItems,
    createFamily,
    createFamilyList,
    addListItem,
    toggleListItem,
    selectFamily,
    selectList,
    setCurrentFamily,
    setCurrentList
  };
}