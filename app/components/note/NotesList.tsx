"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { useEffect, useState } from "react";
import { Note } from "@/types/note";
import NoteCard from "./NoteCard";
import { SortableNoteItem } from "./SortableNoteItem";
import { Tag } from "@/types/tag";
import { Plus } from "lucide-react";
import Image from "next/image";
import type { DragEndEvent } from "@dnd-kit/core";
import { useNoteContext } from "@/app/context/NoteContext";

interface NotesListProps {
  selectedId: string | null;
  onAddNote: () => void;
  selectedTagId: string | null;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function NotesList({
  selectedId,
  onAddNote,
  selectedTagId,
  isCollapsed,
  setIsCollapsed,
}: NotesListProps) {
  const { notes, reorderNotes } = useNoteContext();
  const [items, setItems] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setItems(notes.map((note) => note.id));
  }, [notes]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = items.indexOf(active.id);
    const newIndex = items.indexOf(over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    const newNotes = newItems.map((id, index) => {
      const note = notes.find((n) => n.id === id)!;
      return {
        ...note,
        order: index,
      };
    });

    reorderNotes(newNotes);
  };

  const filteredItems = items.filter((id) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return false;

    const hasSearch = search.trim() !== "";
    const hasTag = selectedTagId !== null;
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase());
    const matchesTag = note.tagId === selectedTagId;

    if (!hasSearch && !hasTag) return true;
    if (hasSearch && hasTag) return matchesSearch && matchesTag;
    if (hasSearch) return matchesSearch;
    return matchesTag;
  });

  return (
    <>
      <div
        className="h-full bg-[#f3f5f7] w-[30px] flex items-center justify-center border-r border-[var(--line)] md:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? ">" : "<"}
      </div>

      <div
        className={`
          flex flex-col h-screen bg-[#f3f5f7] overflow-y-auto scrollbar-hide p-6 
          dark:bg-[#2D2A2B]
          ${isCollapsed ? "hidden" : "block flex-1"}
        `}
      >
        <div className="relative mb-8 flex gap-[14px]">
          <Image
            src="/icons/Search.svg"
            alt="search icon"
            width={18}
            height={18}
            className="absolute invert-[0.4] -translate-x-2/4 -translate-y-2/4 top-2/4 left-6 dark:invert"
          />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white rounded-lg h-[40px] pl-12 pr-4 py-2 flex-1 dark:bg-black"
          />
          <button
            onClick={onAddNote}
            className="flex justify-center items-center bg-[var(--color-primary)] w-[40px] h-[40px] rounded-md cursor-pointer text-white text-2xl hover:bg-[#323153]"
          >
            <Plus />
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(event) => setActiveId(String(event.active.id))}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement, restrictToVerticalAxis]}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-[20px]">
              {filteredItems.map((id) => (
                <SortableNoteItem key={id} noteId={id} />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId ? <NoteCard noteId={activeId} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
}