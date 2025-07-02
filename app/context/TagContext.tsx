"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Tag } from "@/types/tag";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useAuthContext } from "./AuthContext";

type TagContextType = {
  tags: Tag[];
  selectedTagId: string | null;
  setSelectedTagId: (id: string | null) => void;
};

const TagContext = createContext<TagContextType | undefined>(undefined);

export const useTags = () => {
  const context = useContext(TagContext);
  if (!context) throw new Error("useTags must be used within a TagProvider");
  return context;
};

export const TagProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(collection(db, "tags"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTags = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Tag[];
      setTags(fetchedTags);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <TagContext.Provider value={{ tags, selectedTagId, setSelectedTagId }}>
      {children}
    </TagContext.Provider>
  );
};
