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
import NoteCard from "./ui/notes/NoteCard";
import { SortableNoteItem } from "./SortableNoteItem";
import { Tag } from "@/types/tag";
import { Plus } from "lucide-react";

interface NotesListProps {
  notes: Note[];
  selectedId: string | null;
  onAddNote: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (newNotes: Note[]) => void;
  onUpdateTag: (noteId: string, tagId: string) => void;
  tags: Tag[];
}

export default function NotesList({
  notes,
  selectedId,
  onAddNote,
  onSelect,
  onDelete,
  onReorder,
  onUpdateTag,
  tags
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

  const filteredItems = items.filter((id) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return false;
    return note.title.toLowerCase().includes(search.toLowerCase());
  });
  

  return (
    <div className="flex flex-col w-[30%] bg-[#F7F7F7] overflow-y-auto p-5 dark:bg-[#2D2A2B] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="relative mb-6 flex gap-[14px]">
          <img src="/icons/Search.svg" className="absolute text-[#333] -translate-x-2/4 -translate-y-2/4 top-2/4 left-6" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e)=>{setSearch(e.target.value)}}
            className="bg-white rounded-lg h-[40px] pl-12 pr-4 py-2 flex-1 dark:bg-black"
          />
          <button
            onClick={onAddNote}
            className="flex justify-center items-center bg-[var(--color-primary)] w-[40px] h-[40px] rounded-md text-white text-2xl"
          >
            <Plus/>
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
            {filteredItems.map((id) => {
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
                  tags={tags}
                  onUpdateTag={onUpdateTag}
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
              tags={tags}
              onUpdateTag={onUpdateTag}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
