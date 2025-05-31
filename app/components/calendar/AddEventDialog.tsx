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
import { useState, useEffect } from "react";
import { addEvent, updateEvent, deleteEvent } from "@/lib/firestore";
import { CalendarEvent } from "@/types/event";

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

  const isEditing = Boolean(editingEvent);

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setStartTime(toLocalDatetimeString(editingEvent.start));
      setEndTime(toLocalDatetimeString(editingEvent.end));
      setColor(editingEvent.color || "#3b82f6");
    } else {
      setTitle("");
      setStartTime(toLocalDatetimeString(start));
      setEndTime(toLocalDatetimeString(end));
      setColor("#3b82f6");
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "編輯事件" : "新增事件"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>標題</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>開始時間</Label>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <Label>結束時間</Label>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <div>
            <Label>事件顏色</Label>
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-10 p-0 border-none"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          {isEditing && (
            <Button variant="destructive" onClick={handleDelete}>
              刪除
            </Button>
          )}
          <Button onClick={handleSubmit}>{isEditing ? "更新" : "新增"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
