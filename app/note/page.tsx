"use client";

import { useEffect, useState } from "react";
import { getAllNotes, deleteNote, addNote, updateNote as updateNoteInFirestore } from "@/lib/firestore";
import NotesList from "@/app/components/note/NotesList";
import Editor from "@/app/components/note/Editor";
import { Note } from "@/types/note";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useTags } from "@/app/context/TagContext";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);
  
  // 取得全域tags
  const { tags } = useTags();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);

        const allNotes = await getAllNotes(user.uid);
        const formattedNotes: Note[] = allNotes.map((note: any) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          tagId: note.tagId || "",
          updatedAt: note.updatedAt,
          order: note.order ?? 0,
          userId: user.uid,
        }));
        setNotes(formattedNotes);
        if (formattedNotes.length > 0) {
          setSelectedNoteId(formattedNotes[0].id);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

const handleReorderNotes = async (newNotes: Note[]) => {
  const reorderedNotes = newNotes.map((note, index) => ({
    ...note,
    order: index,
  }));

  setNotes(reorderedNotes);

  for (const note of reorderedNotes) {
    await updateNoteInFirestore(note.id, { order: note.order });
  }
};


  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleAddNote = async () => {
    if (!userUid) return;
    const maxOrder = notes.length > 0 ? Math.max(...notes.map(n => n.order)) : 0;
    const docRef = await addNote({
      title: "Untitled Note",
      content: "",
      tags: [],
      userId: userUid,
      order: maxOrder + 1,
    });
    const newNote: Note = {
      id: docRef.id,
      title: "Untitled Note",
      content: "輸入你的內容...",
      tagId: "",
      updatedAt: new Date(),
      order: 0,
      userId: userUid,
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
  };

  const updateNote = async (
    id: string,
    updatedFields: Partial<Pick<Note, "title" | "content" | "tagId">>
  ) => {
    const updatedAt = new Date();
    const updatedNotes = notes.map((note) =>
      note.id === id
        ? { ...note, ...updatedFields, updatedAt }
        : note
    );
    setNotes(updatedNotes);

    const noteToUpdate = updatedNotes.find((n) => n.id === id);
    if (noteToUpdate) {
      await updateNoteInFirestore(noteToUpdate.id, {
        title: noteToUpdate.title,
        content: noteToUpdate.content,
        tagId: noteToUpdate.tagId,
        updatedAt,
      });
    }
  };

  const handleUpdateTag = async (noteId: string, tagId: string) => {
    await updateNote(noteId, { tagId });
  };

  return (
    <div className="flex h-screen">
      <NotesList
        notes={notes}
        selectedId={selectedNoteId}
        onSelect={setSelectedNoteId}
        onAddNote={handleAddNote}
        onDelete={handleDeleteNote}
        onReorder={handleReorderNotes}
        onUpdateTag={handleUpdateTag}
        tags={tags}
      />
      {selectedNote && (
        <Editor
          note={selectedNote}
          onUpdate={(updatedFields) =>
            updateNote(selectedNote.id, updatedFields)
          }
          tags={tags}
        />
      )}
    </div>
  );
}
