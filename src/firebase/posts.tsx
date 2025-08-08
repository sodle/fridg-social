import {
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  DocumentSnapshot,
  addDoc,
  where,
  getCountFromServer,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { useState, useEffect } from "react";

import { firestore } from "./client";
import type { Post } from "../types/Post";
import { useInterval } from "usehooks-ts";
import { useAuth } from "./auth";

function docToPost(doc: DocumentSnapshot): Post {
  const data = doc.data();
  return {
    id: doc.id,
    authorId: data?.authorId,
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

export function usePost(id: string): {
  post: Post;
  likeCount: number;
  liked: boolean;
  like: () => void;
  unlike: () => void;
} {
  const [post, setPost] = useState<Post>({
    id,
    authorId: "nobody",
    timestamp: new Date(0),
    words: [],
  });
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const user = useAuth();

  async function like() {
    if (liked || !user) {
      return;
    }

    await addDoc(collection(firestore, "likes"), {
      userId: user.uid,
      postId: id,
    });

    setLikeCount(likeCount + 1);
  }

  async function unlike() {
    if (!liked || !user) {
      return;
    }

    const snap = await getDocs(
      query(
        collection(firestore, "likes"),
        where("userId", "==", user.uid),
        where("postId", "==", id)
      )
    );
    await Promise.all(snap.docs.map((doc) => deleteDoc(doc.ref)));

    setLikeCount(likeCount - snap.docs.length);
  }

  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, "posts", id), (doc) => {
      setPost(docToPost(doc));
    });
    return unsub;
  }, []);

  useInterval(() => {
    (async () => {
      const q = query(
        collection(firestore, "likes"),
        where("postId", "==", id)
      );
      const snap = await getCountFromServer(q);
      setLikeCount(snap.data().count);
    })();
  }, 1000);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(firestore, "likes"),
        where("postId", "==", id),
        where("userId", "==", user.uid)
      );
      const unsub = onSnapshot(q, (snap) => {
        setLiked(!snap.empty);
      });
      return unsub;
    } else {
      setLiked(false);
    }
  }, [user]);

  return { post, likeCount, liked, like, unlike };
}

export async function createPost(post: Post) {
  return addDoc(collection(firestore, "posts"), post);
}
