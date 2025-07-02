"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Note } from "@/types/note";
import { useAuthContext } from "./AuthContext";
import {
  addNote as addNoteToFirestore,
  updateNote as updateNoteInFirestore,
  deleteNote as deleteNoteFromFirestore,
} from "@/lib/firestore";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface NoteContextType {
  notes: Note[];
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  addNote: () => Promise<void>;
  updateNote: (id: string, data: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  reorderNotes: (newNotes: Note[]) => Promise<void>;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // 即時監聽使用者的筆記
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "notes"),
      where("userId", "==", user.uid),
      orderBy("order", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userNotes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Note[];

      setNotes(userNotes);

      setSelectedNote((prev) => {
        if (!prev && userNotes.length > 0) return userNotes[0];
        const found = userNotes.find((n) => n.id === prev?.id);
        return found || userNotes[0] || null;
      });
    });

    return () => unsubscribe();
  }, [user]);

  const addNote = async () => {
    if (!user) {
      alert("請先登入");
      return;
    }
    const minOrder =
      notes.length > 0 ? Math.min(...notes.map((n) => n.order || 0)) : 0;

    const newNote = {
      title: "Untitled Note",
      content: "輸入你的內容...",
      userId: user.uid,
      tags: [],
      order: minOrder - 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await addNoteToFirestore(newNote);
  };

  const updateNote = async (id: string, data: Partial<Note>) => {
    await updateNoteInFirestore(id, {
      ...data,
      updatedAt: new Date(),
    });
  };

  const deleteNote = async (id: string) => {
    await deleteNoteFromFirestore(id);
  };

  const reorderNotes = async (newNotes: Note[]) => {
    const updatePromises = newNotes.map((note, index) =>
      updateNoteInFirestore(note.id, { order: index })
    );
    await Promise.all(updatePromises);
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        selectedNote,
        setSelectedNote,
        addNote,
        updateNote,
        deleteNote,
        reorderNotes,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNoteContext = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error("useNoteContext must be used within a NoteProvider");
  }
  return context;
};
