"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { Tag } from "@/types/tag";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Sidebar from "@/app/components/note/Sidebar";
import { TagContext } from "@/app/context/TagContext";
import { SelectedTagProvider } from "@/app/context/SelectedTagContext";

export default function NotesLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }

    if (user) {
      const q = query(collection(db, "tags"), where("userId", "==", user.uid));
      const unsubscribeTags = onSnapshot(q, (snapshot) => {
        const fetchedTags: Tag[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Tag[];
        setTags(fetchedTags);
      });

      return () => unsubscribeTags();
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  return (
    <TagContext.Provider value={{ tags }}>
      <SelectedTagProvider>
        <div className="flex flex-col">
          <header className="h-[54px] border-b border-[var(--line)] shrink-0 text-xl font-semibold flex items-center px-6 pt-1" >Notecard</header>
          <div className="flex flex-1">
            <Sidebar
              userName={user.displayName}
              userEmail={user.email}
              userAvatar={user.photoURL}
              userId={user.uid}
              tags={tags}
            />
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </SelectedTagProvider>
    </TagContext.Provider>
  );
}
