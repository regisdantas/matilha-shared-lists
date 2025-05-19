import { auth } from "./firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return signOut(auth);
}
