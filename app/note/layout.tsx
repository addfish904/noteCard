"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Tag } from "@/types/tag";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Sidebar from "@/app/components/Sidebar";
import { TagContext } from "@/app/context/TagContext";

export default function NotesLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [userUid, setUserUid] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
      } else {
        setUserUid(user.uid);
        setUserEmail(user.email);
        setUserName(user.displayName);
        setUserAvatar(user.photoURL);

        const q = query(
          collection(db, "tags"),
          where("userId", "==", user.uid)
        );
        const unsubscribeTags = onSnapshot(q, (snapshot) => {
          const fetchedTags: Tag[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Tag[];
          setTags(fetchedTags);
        });

        return () => unsubscribeTags();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <TagContext.Provider value={{ tags }}>
      <div className="flex flex-col">
        <header className="h-[40px] border-b border-[var(--line)] shrink-0"></header>
        <div className="flex flex-1">
          <Sidebar
            userName={userName}
            userEmail={userEmail}
            userAvatar={userAvatar}
            userId={userUid}
            tags={tags}
          />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </TagContext.Provider>
  );
}
