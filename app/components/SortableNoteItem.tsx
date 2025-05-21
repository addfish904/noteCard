import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Note } from "@/types/note";
import NoteCard from "./NoteCard";


export function SortableNoteItem({
  note,
  isSelected,
  onSelect,
  onDelete,
  activeId,
}: {
  note: Note;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  activeId: string | null;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <NoteCard
      note={note}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      setNodeRef={setNodeRef}
      style={style}
      listeners={listeners}
      attributes={attributes}
    />
  );
}