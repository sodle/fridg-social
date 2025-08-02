import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { firestore } from "./client";
import type { UserProfile } from "../types/UserProfile";
import { useEffect, useState } from "react";

export async function lookupUsername(accountId: string): Promise<string> {
  const userDoc = await getDoc(doc(firestore, "users", accountId));
  return userDoc.data()?.username ?? `Anonymous user ${accountId}`;
}

export function useProfile(accountId: string): UserProfile | null {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, "users", accountId), (snap) => {
      const profileData = snap.data();
      if (profileData) {
        setProfile({ username: profileData.username });
      } else {
        setProfile(null);
      }
    });
    return unsub;
  }, []);
  return profile;
}

export async function setUsername(accountId: string, username: string) {
  await setDoc(doc(firestore, "users", accountId), { username });
}
