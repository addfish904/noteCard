import { Note } from "@/types/note";
import { HTMLAttributes } from "react";

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  setNodeRef?: (element: HTMLElement | null) => void;
  style?: React.CSSProperties;
  listeners?: HTMLAttributes<any>;
  attributes?: HTMLAttributes<any>;
  isDragging?: boolean;
}

export default function NoteCard({
  note,
  isSelected,
  onSelect,
  onDelete,
  setNodeRef,
  style,
  listeners,
  attributes,
  isDragging = false, 
}: NoteItemProps) {
  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        zIndex: isDragging ? 999 : "auto", //拖曳時置頂
        boxShadow: isDragging ? "0 8px 20px rgba(0, 0, 0, 0.2)" : undefined, 
      }}
      {...listeners}
      {...attributes}
      onClick={() => onSelect(note.id)}
      className={`flex flex-col justify-between bg-white h-[180px] cursor-pointer rounded-lg border-[2px] py-[18px] px-[20px] transition-shadow duration-200
        shadow-[0_2px_5px_0px_rgba(0,0,0,0.1)] dark:bg-[var(--background)]
        ${
          isSelected
            ? "border-[var(--card-outline)]"
            : "border-transparent hover:border-[var(--card-outline)]"
        }
        ${isDragging ? "scale-[1.02]" : ""}
      `}
    >
      <div className="flex items-center justify-between gap-[10px]">
        <p className="text-lg font-semibold">{note.title}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="bg-[var(--color-secondary)] w-[30px] h-[30px] rounded hover:bg-gray-100"
        >
          ...
        </button>
      </div>
      <p className="text-xs text-gray-500 overflow-hidden">{note.content}</p>
      <div className="flex gap-[10px]">
        <p className="text-xs bg-[var(--color-secondary)] px-[10px] py-[5px] rounded">{note.updatedAt}</p>
        <p className="text-xs text-gray-500">{note.tag}</p>
      </div>
    </div>
  );
}
