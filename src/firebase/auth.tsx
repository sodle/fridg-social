import { useState, useEffect } from "react";
import { auth } from "./client";
import {
  type User,
  GoogleAuthProvider,
  signOut,
  signInWithPopup,
} from "firebase/auth";

export function useAuth(): User | null {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((next) => setUser(next));
    return unsub;
  }, []);
  return user;
}

export async function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export async function signOutUser() {
  return signOut(auth);
}
