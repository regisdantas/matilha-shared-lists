import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import { 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithCredential, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { auth } from '../services/firebase';

WebBrowser.maybeCompleteAuthSession();

interface IAuthContext {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

interface IAuthProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider = ({ children }: IAuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // Google Auth Request
  const [googleRequest, googleResponse, promptGoogleAsync] = Google.useIdTokenAuthRequest({
    clientId: '<SEU_CLIENT_ID_GOOGLE>', // Ex: web client ID do Google Cloud Console
  });

  // Facebook Auth Request
  const [fbRequest, fbResponse, promptFbAsync] = Facebook.useAuthRequest({
    clientId: '<SEU_APP_ID_FACEBOOK>',
    // Optionais:
    // scopes: ['email', 'public_profile'],
  });

  // Monitorar resposta do Google
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { id_token } = googleResponse.params;
      if (id_token) {
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential).catch(console.error);
      }
    }
  }, [googleResponse]);

  // Monitorar resposta do Facebook
  useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { access_token } = fbResponse.params;
      if (access_token) {
        const credential = FacebookAuthProvider.credential(access_token);
        signInWithCredential(auth, credential).catch(console.error);
      }
    }
  }, [fbResponse]);

  // Observa estado do usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Funções públicas do contexto
  const signInWithGoogle = async () => {
    await promptGoogleAsync();
  };

  const signInWithFacebook = async () => {
    await promptFbAsync();
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signInWithFacebook, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
