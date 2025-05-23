import { useState } from "react";
import { Note } from "@/types/note";
import { HTMLAttributes } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./select";
import Button from "./Button";
import { Trash2, Tag as TagIcon, Ellipsis } from "lucide-react";
import { Tag } from "@/types/tag";
import { formatNoteDate } from "@/lib/firestore";

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  tags: Tag[];
  setNodeRef?: (element: HTMLElement | null) => void;
  onUpdateTag: (noteId: string, tagId: string) => void;
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
  tags,
  setNodeRef,
  onUpdateTag,
  style,
  listeners,
  attributes,
  isDragging = false,
}: NoteItemProps) {
  const [selectedTag, setSelectedTag] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const tag = tags.find((t) => t.id === note.tagId);

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        zIndex: isDragging ? 999 : "auto",
        boxShadow: isDragging ? "0 8px 20px rgba(0, 0, 0, 0.2)" : undefined,
      }}
      {...listeners}
      {...attributes}
      onClick={() => onSelect(note.id)}
      className={`flex flex-col justify-between bg-white h-[160px] cursor-pointer rounded-lg border-[1.5px] py-[18px] px-[20px] transition-shadow duration-200
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
        <p
          className={`text-lg dark:text-white${
            isSelected
              ? "text-[#242584] font-semibold"
              : "text-black font-semibold"
          }`}
        >
          {note.title}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center bg-[var(--color-secondary)] w-[30px] h-[30px] rounded hover:bg-gray-100"
            >
              <Ellipsis className="text-[#C8C8C8] w-[18px]"/>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuItem onClick={() => onDelete(note.id)}>
              <div className="flex items-center gap-2">
                <Trash2 />
                <span>刪除</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDialogOpen(true);
              }}
            >
              <div className="flex items-center gap-2">
                <TagIcon />
                <span>加入標籤</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle>選擇標籤</DialogTitle>
            </DialogHeader>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger>
                <SelectValue placeholder="選擇標籤" />
              </SelectTrigger>
              <SelectContent>
                {tags?.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="mt-4"
              onClick={() => {
                onUpdateTag(note.id, selectedTag);
                setDialogOpen(false);
              }}
            >
              儲存標籤
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-xs text-gray-500 overflow-hidden">{note.content}</p>
      <div className="flex gap-[10px]">
        <div className="flex items-end gap-3 bg-[var(--color-secondary)] px-[10px] py-[5px] rounded">
          <img src="/icons/Edit.svg" className="w-[18px] h-[18px]" />
          <p className="text-xs">{formatNoteDate(note.updatedAt)}</p>
        </div>
        {tag?.name && (
          <p
            className="flex items-center text-xs rounded px-2 py-0.5"
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
          </p>
        )}
      </div>
    </div>
  );
}
