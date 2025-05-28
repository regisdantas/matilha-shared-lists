import {useContext, createContext, useEffect, useState} from 'react';
import {GoogleAuthProvider,
        FacebookAuthProvider,
        signInWithPopup,
        signOut,
        onAuthStateChanged,
        User} from 'firebase/auth';
import {auth} from '../services/firebase';

interface IAuthContext {
  user: User;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  logOut: () => Promise<void>;

}

const AuthContext = createContext({} as IAuthContext);

interface IAuthProps {
  children: JSX.Element;
}

export const AuthContextProvider: React.FC<IAuthProps> = ({ children }: IAuthProps): JSX.Element => {
  const [user, setUser] = useState<User>({} as User);

  const signInWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithFacebook = async (): Promise<void> => {
    const provider = new FacebookAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
    } catch (err) {
      console.log(err);
    }
  };

  const logOut = async (): Promise<void> => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser as User);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signInWithFacebook, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
