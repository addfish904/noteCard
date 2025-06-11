import React, { createContext, useContext, useEffect, useState } from "react";
import { Note } from "@/types/note";
import { useAuth } from "@/hooks/useAuth";
import {
  addNote as addNoteToFirestore,
  updateNote as updateNoteInFirestore,
  deleteNote as deleteNoteFromFirestore,
  getAllNotes,
} from "@/lib/firestore";

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
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // 初始取得 notes
  useEffect(() => {
    const fetchNotes = async () => {
      if (user?.uid) {
        const userNotes = await getAllNotes(user.uid);
        setNotes(userNotes);
        if (userNotes.length > 0) {
          setSelectedNote(userNotes[0]);
        }
      }
    };
    fetchNotes();
  }, [user]);

  const addNote = async () => {
    if (!user) {
      alert("請先登入");
      return;
    }
    const maxOrder = notes.length > 0 ? Math.max(...notes.map((n) => n.order || 0)) : 0;

    const newNote = {
      title: "Untitled Note",
      content: "輸入你的內容...",
      userId: user.uid,
      tags: [],
      order: maxOrder + 1,
    };

    const docRef = await addNoteToFirestore(newNote);
    const newNoteWithId: Note = {
      id: docRef.id,
      ...newNote,
      tagId: "",
      updatedAt: new Date(),
    };

    setNotes((prev) => [newNoteWithId, ...prev]);
    setSelectedNote(newNoteWithId);
  };

  const updateNote = async (id: string, data: Partial<Note>) => {
    await updateNoteInFirestore(id, data);
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...data, updatedAt: new Date() } : note))
    );
    setSelectedNote((prev) => {
      if (prev && prev.id === id) {
        return { ...prev, ...data, updatedAt: new Date() };
      }
      return prev;
    });
  };
  

  const deleteNote = async (id: string) => {
    await deleteNoteFromFirestore(id);
    setNotes((prev) => prev.filter((note) => note.id !== id));
    setSelectedNote(null);
  };

  const reorderNotes = async (newNotes: Note[]) => {
    const updatePromises = newNotes.map((note, index) =>
      updateNoteInFirestore(note.id, { order: index })
    );
    await Promise.all(updatePromises);
    setNotes(newNotes);
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
