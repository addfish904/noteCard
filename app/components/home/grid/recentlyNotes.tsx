import React from "react";
import { Note } from "@/types/note";
import Card from "../ui/card";
import { Tag } from "@/types/tag";
import { formatNoteDate } from "@/lib/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";


interface RecentlyNotesProps {
  latestNotes: Note[];
  tags: Tag[];
}

export default function RecentlyNotes({
  latestNotes,
  tags,
}: RecentlyNotesProps) {
  const router = useRouter();

  return (
    <Card className="py-6 px-5">
      <h2 className="text-base mb-1">最近筆記 ✏️</h2>
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
                onClick={() => router.push(`/note?id=${note.id}`)}
                className={`cancel-drag cursor-pointer flex flex-col gap-2 py-4 mb-2 p-2 rounded transition ${
                  !isLast ? "border-b border-gray-300" : ""
              }`}>
                <h3 className="font-semibold mb-2">{note.title}</h3>
                <p className="text-xs text-gray-500">
                  {note.content.slice(0, 50)}...
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs">
                <div className="flex items-center gap-1 bg-[var(--color-secondary)] px-2 py-1 rounded">
                    <Image 
                      src="/icons/Edit.svg" 
                      alt="edit icon"
                      width={12}
                      height={12}/>
                  <span>
                    {formatNoteDate(note.updatedAt)}
                  </span>
                  </div>
                  {tag ? (
                    <span
                      className="inline-block px-2 py-1 rounded text-black"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ) : (
                    <span></span>
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
