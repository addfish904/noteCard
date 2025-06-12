"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../note/dropdown-menu";
import { useState, useEffect } from "react";
import { addEvent, updateEvent, deleteEvent } from "@/lib/firestore";
import { CalendarEvent } from "@/types/event";
import { useNoteContext } from "@/app/context/NoteContext";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  start: Date;
  end: Date;
  userId: string;
  editingEvent?: CalendarEvent | null;
  onAdd: (event: CalendarEvent) => void;
  onUpdate?: (event: CalendarEvent) => void;
  onDelete?: (id: string) => void;
};

function toLocalDatetimeString(date: Date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
}

export default function AddEventDialog({
  open,
  setOpen,
  start,
  end,
  userId,
  editingEvent,
  onAdd,
  onUpdate,
  onDelete,
}: Props) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(start.toISOString().slice(0, 16));
  const [endTime, setEndTime] = useState(end.toISOString().slice(0, 16));
  const [color, setColor] = useState("#3b82f6");
  const { notes, reorderNotes, setSelectedNote } = useNoteContext();
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const router = useRouter();

  const isEditing = Boolean(editingEvent);

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setStartTime(toLocalDatetimeString(editingEvent.start));
      setEndTime(toLocalDatetimeString(editingEvent.end));
      setColor(editingEvent.color || "#3b82f6");
      setSelectedNoteIds(editingEvent.noteId || []);
    } else {
      setTitle("");
      setStartTime(toLocalDatetimeString(start));
      setEndTime(toLocalDatetimeString(end));
      setColor("#3b82f6");
      setSelectedNoteIds([]);
    }
  }, [editingEvent, start, end]);

  const handleSubmit = async () => {
    const event: CalendarEvent = {
      id: editingEvent?.id || crypto.randomUUID(),
      title,
      start: new Date(startTime),
      end: new Date(endTime),
      color,
      userId,
      noteId: selectedNoteIds,
    };

    if (isEditing && onUpdate) {
      await updateEvent(event);
      onUpdate(event);
    } else {
      await addEvent(event);
      onAdd(event);
    }

    setOpen(false);
  };

  const handleDelete = async () => {
    if (editingEvent && onDelete) {
      await deleteEvent(editingEvent.id);
      onDelete(editingEvent.id);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!max-w-[26rem] !border-none">
        <DialogHeader>
          <DialogTitle className="mb-4">
            {isEditing ? "編輯事件" : "新增事件"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mb-4">
          <div>
            <Label className="mb-2">標題</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label className="mb-2">開始時間</Label>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2">結束時間</Label>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>事件顏色</Label>
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-10 p-0 border-none"
            />
          </div>
          <div>
            <Label className="mb-2">關聯筆記</Label>
            <select
              className="border p-2 rounded w-full"
              onChange={(e) => {
                const selected = e.target.value;
                if (selected && !selectedNoteIds.includes(selected)) {
                  setSelectedNoteIds([...selectedNoteIds, selected]);
                }
              }}
              value=""
            >
              <option value="">Related Note</option>
              {notes
                .filter((note) => !selectedNoteIds.includes(note.id))
                .map((note) => (
                  <option key={note.id} value={note.id}>
                    {note.title}
                  </option>
                ))}
            </select>
            {selectedNoteIds.length > 0 && (
              <div className="mt-3 space-y-2">
                {/* {selectedNoteIds.map((noteId) => {
                  const note = notes.find((n) => n.id === noteId);
                  if (!note) return null;

                  return (
                    <div
                      key={note.id}
                      className="flex justify-between items-center px-4 py-1 bg-[#f3f5f7] rounded cursor-pointer"
                    >
                      <p className="truncate">📝 {note.title || "無標題"}</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            ...
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              setSelectedNoteIds(
                                selectedNoteIds.filter((id) => id !== note.id)
                              )
                            }
                          >
                            移除關聯
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })} */}
                {selectedNoteIds.map((noteId) => {
  const note = notes.find((n) => n.id === noteId);
  if (!note) return null;

  return (
    <div
      key={note.id}
      className="flex justify-between items-center px-4 py-1 bg-[#f3f5f7] rounded cursor-pointer border border-transparent hover:bg-[#e5e7eb] hover:border-[#2196F3]"
      onClick={async () => {
        // 1. 將此筆記設為第一，其餘往後排
        const updatedNotes = notes.map((n) =>
          n.id === note.id
            ? { ...n, order: 0 }
            : { ...n, order: (n.order ?? 0) + 1 }
        );

        // 2. 更新排序
        await reorderNotes(updatedNotes);

        // 3. 設為目前選中的筆記
        setSelectedNote(note);

        // 4. 跳轉到筆記頁
        router.push("/home/note");
      }}
    >
      <p className="truncate">📝 {note.title || "無標題"}</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" onClick={(e) => e.stopPropagation()}>
            ...
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNoteIds(selectedNoteIds.filter((id) => id !== note.id));
            }}
          >
            移除關聯
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
})}

              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          {isEditing && (
            <Button variant="destructive" onClick={handleDelete}>
              刪除
            </Button>
          )}
          <Button onClick={handleSubmit}>
            {isEditing ? "更新" : "新增"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
