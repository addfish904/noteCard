import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Note } from "@/types/note";
import NoteCard from "./NoteCard";
import { Tag } from "@/types/tag";


export function SortableNoteItem({
  note,
  isSelected,
  onSelect,
  onDelete,
  tags,
  onUpdateTag
}: {
  note: Note;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  tags: Tag[];
  onUpdateTag: (noteId: string, tagId: string) => void;
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
      tags={tags}
      onUpdateTag={onUpdateTag}
    />
  );
}