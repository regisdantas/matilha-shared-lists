import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMI0CkC3VncsbCnVM-oNUG3cxLT0VZGoA",
  authDomain: "matilha-1d340.firebaseapp.com",
  projectId: "matilha-1d340",
  storageBucket: "matilha-1d340.firebasestorage.app",
  messagingSenderId: "699253697841",
  appId: "1:699253697841:web:9840daffe2217870789410",
  measurementId: "G-JX42KH0MTQ"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);
export const auth = getAuth(firebaseApp);
export const database = getFirestore(firebaseApp);
