import {
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  DocumentSnapshot,
} from "firebase/firestore";
import { useState, useEffect } from "react";

import { firestore } from "./client";
import type { Post } from "../types/Post";

function docToPost(doc: DocumentSnapshot): Post {
  const data = doc.data();
  return {
    id: doc.id,
    author: data?.author,
    timestamp: data?.timestamp?.toDate() ?? new Date(0),
    words: data?.words,
  };
}

export function usePosts(): Post[] {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(firestore, "posts"), orderBy("timestamp", "desc")),
      (docs) => {
        setPosts(docs.docs.map(docToPost));
      }
    );
    return unsub;
  }, []);
  return posts;
}

export function usePost(id: string): Post {
  const [post, setPost] = useState<Post>({
    id: "fake",
    author: "nobody",
    timestamp: new Date(0),
    words: [],
  });
  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, "posts", id), (doc) => {
      setPost(docToPost(doc));
    });
    return unsub;
  }, []);
  return post;
}
