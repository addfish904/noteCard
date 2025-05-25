import React from "react";
import { Note } from "@/types/note";
import Card from "../ui/card";
import { Tag } from "@/types/tag";
import { formatNoteDate } from "@/lib/firestore";

interface RecentlyNotesProps {
  latestNotes: Note[];
  tags: Tag[];
}

export default function RecentlyNotes({
  latestNotes,
  tags,
}: RecentlyNotesProps) {
  return (
    <Card className="p-6">
      <h2 className="text-base mb-1">✏️ 最近筆記</h2>
      {latestNotes.length === 0 ? (
        <p>No notes.</p>
      ) : (
        <ul>
          {latestNotes.map((note, index) => {
            const tag = tags.find((t) => t.id === note.tagId);
            const isLast = index === latestNotes.length - 1;

            return (
              <li 
                key={note.id} 
                className={`flex flex-col gap-2 py-4 ${
                  !isLast ? "border-b border-gray-300 mb-2" : ""
              }`}>
                <h3 className="font-semibold mb-2">{note.title}</h3>
                <p className="text-xs text-gray-500">
                  {note.content.slice(0, 50)}...
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs">
                <div className="flex items-center gap-1 bg-[var(--color-secondary)] px-2 py-1 rounded">
                    <img src="/icons/Edit.svg" className="w-[12px] h-[12px]" />
                  <span>
                    {formatNoteDate(note.updatedAt)}
                  </span>
                  </div>
                  {tag ? (
                    <span
                      className="inline-block px-2 py-1 rounded"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">無標籤</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
