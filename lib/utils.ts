import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Note } from "@/types/note";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export interface MonthlyNoteCount {
  month: string;
  count: number;
}

export function groupNotesByMonth(notes: Note[]): MonthlyNoteCount[] {
  const monthMap = new Map<string, number>();

  notes.forEach((note) => {
    const date = new Date(note.updatedAt);
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    monthMap.set(monthStr, (monthMap.get(monthStr) || 0) + 1);
  });

  const sortedMonths = Array.from(monthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0])) // 按時間排序
    .map(([month, count]) => ({ month, count }));

  return sortedMonths;
}
