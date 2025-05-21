"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { addNote, deleteNote, getAllNotes, updateNote as updateNoteInFirestore } from "@/lib/firestore";
import Sidebar from "@/app/components/Sidebar";
import NotesList from "@/app/components/NotesList";
import Editor from "@/app/components/Editor";
import { Note } from "@/types/note";


export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/");
      } else {
        setUserUid(user.uid);
        setUserEmail(user.email);
        setUserName(user.displayName);
        setUserAvatar(user.photoURL);

        // 載入該使用者的 notes
        const allNotes = await getAllNotes();
        const userNotes = allNotes.filter((note: any) => note.userId === user.uid);
        const formattedNotes: Note[] = userNotes.map((note: any) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          tag: note.tags?.[0] || "",
          updatedAt: note.updatedAt.toDate().toISOString().slice(0, 10),
          order: note.order ?? 0,
        }));
        setNotes(formattedNotes);
        if (formattedNotes.length > 0) {
          setSelectedNoteId(formattedNotes[0].id);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Notelist 選中的筆記
  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  const handleReorderNotes = async (newNotes: Note[]) => {
    setNotes(newNotes);
  
    // 將每一筆 note 的 order 同步回 Firestore
    for (const note of newNotes) {
      await updateNoteInFirestore(note.id, { order: note.order });
    }
  };

  
  // 刪除筆記
  const handleDeleteNote = async ( id: string ) => {
    try {
      await deleteNote(id);
      const updateNote = notes.filter((note)=>note.id !==id);
      setNotes(updateNote)
    } catch(error) {
      console.error("刪除筆記時發生錯誤", error);
    }
  }

  // 新增筆記
  const handleAddNote = async () => {
    if (!userUid) return;

    const docRef = await addNote({
      title: "Untitled Note",
      content: "",
      tags: [],
      userId: userUid,
      order: 0,
    });

    const newNote: Note = {
      id: docRef.id, // Firestore 自動產生的 ID
      title: "Untitled Note",
      content: "輸入你的內容...",
      tag: "",
      updatedAt: new Date().toISOString().slice(0, 10),
      order: 0
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
  };

  // 更新筆記
  const updateNote = async (
    id: string,
    updatedFields: Partial<Pick<Note, "title" | "content">>
  ) => {
    const updatedNotes = notes.map((note) =>
      note.id === id
        ? {
            ...note,
            ...updatedFields,
            updatedAt: new Date().toISOString().slice(0, 10),
          }
        : note
    );
    setNotes(updatedNotes);

    const noteToUpdate = updatedNotes.find((n) => n.id === id);
    if (noteToUpdate) {
      await updateNoteInFirestore(noteToUpdate.id.toString(), {
        title: noteToUpdate.title,
        content: noteToUpdate.content,
      });
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-[40px] border-b border-[var(--line)] shrink-0"></header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
        />
        <NotesList
          notes={notes}
          selectedId={selectedNoteId}
          onSelect={(id: string) => setSelectedNoteId(id)}
          onAddNote={handleAddNote}
          onDelete={(id: string) => handleDeleteNote(id)}
          onReorder={handleReorderNotes}
        />
        {selectedNote && (
          <Editor
            note={selectedNote}
            onUpdate={(updatedFields) =>
              updateNote(selectedNote.id, updatedFields)
            }
          />
        )}
      </div>
    </div>
  );
}


