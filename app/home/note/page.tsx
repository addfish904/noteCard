"use client";

import { useEffect, useState } from "react";
import {
  getAllNotes,
  deleteNote,
  addNote,
  updateNote as updateNoteInFirestore,
} from "@/lib/firestore";
import NotesList from "@/app/components/note/NotesList";
import Editor from "@/app/components/note/Editor";
import { Note } from "@/types/note";
import { useTags } from "@/app/context/TagContext";
import { useSelectedTag } from "@/app/context/SelectedTagContext";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { selectedTagId } = useSelectedTag();
  const { tags } = useTags();
  const { user, loading } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // 手機版 NotesList 收合
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsCollapsed(false);
      } else {
        setIsCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 取得筆記
  useEffect(() => {
    if (user?.uid && !loading) {
      (async () => {
        const allNotes = await getAllNotes(user.uid);
        const formattedNotes: Note[] = (allNotes as Note[]).map((note) => ({
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
      })();
    }
  }, [user, loading]);

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
    if (!user?.uid) return;
    const maxOrder =
      notes.length > 0 ? Math.max(...notes.map((n) => n.order)) : 0;
    const docRef = await addNote({
      title: "Untitled Note",
      content: "輸入你的內容...",
      tags: [],
      userId: user?.uid,
      order: maxOrder + 1,
    });
    const newNote: Note = {
      id: docRef.id,
      title: "Untitled Note",
      content: "輸入你的內容...",
      tagId: "",
      updatedAt: new Date(),
      order: maxOrder + 1,
      userId: user?.uid,
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
      note.id === id ? { ...note, ...updatedFields, updatedAt } : note
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
    <div className="flex h-screen w-full overflow-hidden">
      <div
        className={cn(
          isMobile ? (isCollapsed ? "w-[30px]" : "w-full flex") : "w-[30%]"
        )}
      >
        <NotesList
          notes={notes}
          selectedId={selectedNoteId}
          onSelect={setSelectedNoteId}
          onAddNote={handleAddNote}
          onDelete={handleDeleteNote}
          onReorder={handleReorderNotes}
          onUpdateTag={handleUpdateTag}
          tags={tags}
          selectedTagId={selectedTagId}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>
      {/* 手機版展開 NotesList 時隱藏 Editor */}
      {(!isMobile || isCollapsed) && selectedNote && (
        <div className="flex-1">
          <Editor
            note={selectedNote}
            onUpdate={(updatedFields) =>
              updateNote(selectedNote.id, updatedFields)
            }
            tags={tags}
          />
        </div>
      )}
    </div>
  );
}
