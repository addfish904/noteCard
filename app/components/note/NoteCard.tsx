"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./select";
import Button from "./Button";
import { Trash2, Tag as TagIcon, Ellipsis } from "lucide-react";
import Image from "next/image";
import removeMarkdown from "remove-markdown";
import { useNoteContext } from "@/app/context/NoteContext";
import { useTags } from "@/app/context/TagContext";
import { formatNoteDate } from "@/lib/firestore";
import type { DraggableAttributes } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";

interface NoteCardProps {
  noteId: string;
  setNodeRef?: (element: HTMLElement | null) => void;
  style?: React.CSSProperties;
  listeners?: ReturnType<typeof useDraggable>["listeners"];
  attributes?: DraggableAttributes;
  isDragging?: boolean;
}

export default function NoteCard({
  noteId,
  setNodeRef,
  style,
  listeners,
  attributes,
  isDragging = false,
}: NoteCardProps) {
  const { notes, selectedNote, setSelectedNote, deleteNote, updateNote } =
    useNoteContext();
  const { tags } = useTags();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");

  const note = notes.find((n) => n.id === noteId);
  const isSelected = selectedNote?.id === noteId;
  const tag = tags.find((t) => t.id === note?.tagId);

  if (!note) return null;

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
      onClick={() => setSelectedNote(note)}
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
          className={`text-lg dark:text-white ${
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
              <Ellipsis className="text-[#C8C8C8] w-[18px]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuItem onClick={() => deleteNote(note.id)}>
              <div className="flex items-center gap-2">
                <Trash2 />
                <span>刪除</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedTag(note.tagId || "");
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
          <DialogContent
            onClick={(e) => e.stopPropagation()}
            className="!max-w-[20rem]"
          >
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
              onClick={() => {
                if (selectedTag) {
                  updateNote(note.id, { tagId: selectedTag });
                  setDialogOpen(false);
                }
              }}
              className="bg-[var(--color-primary)] w-full !text-white flex justify-center mt-4 hover:bg-[#201F45]"
            >
              儲存標籤
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-xs text-gray-500 overflow-hidden">
        {removeMarkdown(note.content).slice(0, 60)}
      </p>

      <div className="flex gap-[10px]">
        <div className="flex items-end gap-3 bg-[var(--color-secondary)] px-[10px] py-[5px] rounded">
          <Image
            src="/icons/Edit.svg"
            alt="edit icon"
            width={18}
            height={18}
            className="dark:invert"
          />
          <p className="text-xs">{formatNoteDate(note.createdAt)}</p>
        </div>
        {tag?.name && (
          <p
            className="flex items-center text-xs rounded px-2 py-0.5 dark:text-black"
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
          </p>
        )}
      </div>
    </div>
  );
}
