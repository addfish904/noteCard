"use client";

import { useEffect, useState } from "react";
import NotesList from "@/app/components/note/NotesList";
import Editor from "@/app/components/note/Editor";
import { useSelectedTag } from "@/app/context/SelectedTagContext";
import { useNoteContext } from "@/app/context/NoteContext";
import { cn } from "@/lib/utils";

export default function NotesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { selectedTagId } = useSelectedTag();

  const { selectedNote, addNote } = useNoteContext();

  // 手機版 NotesList 收合邏輯
  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 768;
      setIsMobile(isNowMobile);
      setIsCollapsed(isNowMobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div
        className={cn(
          isMobile ? (isCollapsed ? "w-[30px]" : "w-full flex") : "w-[30%]"
        )}
      >
        <NotesList
          onAddNote={addNote}
          selectedTagId={selectedTagId}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>
      {(!isMobile || isCollapsed) && selectedNote && (
        <div className="flex-1">
          <Editor />
        </div>
      )}
    </div>
  );
}
