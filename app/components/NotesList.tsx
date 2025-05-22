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

interface NotesListProps {
  notes: Note[];
  selectedId: string | null;
  onAddNote: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (newNotes: Note[]) => void;
}


export default function NotesList({
  notes,
  selectedId,
  onAddNote,
  onSelect,
  onDelete,
  onReorder,
}: NotesListProps) {
  const [items, setItems] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null); // 拖曳中的卡片 ID
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setItems(notes.map((note) => note.id));
  }, [notes]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
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
        order: index + 1,
      };
    });

    onReorder(newNotes);
  };

  return (
    <div className="flex flex-col w-[27%] bg-[#F7F7F7] overflow-y-auto p-5 dark:bg-[#2D2A2B]">
        <div className="mb-6 flex gap-[14px]">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e)=>{setSearch(e.target.value)}}
            className="bg-white rounded-lg h-[40px] px-4 py-2 flex-1"
          />
          <button
            onClick={onAddNote}
            className="bg-[var(--color-primary)] w-[40px] h-[40px] rounded-lg text-white text-2xl"
          >
            +
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
            {items.map((id) => {
              const note = notes.find((n) => n.id === id);
              if (!note) return null;
              return (
                <SortableNoteItem
                  key={note.id}
                  note={note}
                  isSelected={selectedId === note.id}
                  onSelect={onSelect}
                  onDelete={onDelete}
                  activeId={activeId}
                />
              );
            })}
          </div>
        </SortableContext>

        {/* 拖曳中的卡片陰影與 z-index */}
        <DragOverlay>
          {activeId ? (
            <NoteCard
              note={notes.find((n) => n.id === activeId)!}
              isSelected={true}
              onSelect={() => {}}
              onDelete={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
