"use client";

import { ChangeEvent, useRef } from "react";
import { Note } from "@/types/note";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import {
  Editor as MdEditor,
  rootCtx,
  defaultValueCtx,
} from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { nord } from "@milkdown/theme-nord";
import { getMarkdown } from "@milkdown/utils";
import { tooltip, TooltipView } from "./Tooltip";
import { Tag } from "@/types/tag";
import { formatNoteDate } from "@/lib/firestore";

interface EditorProps {
  note: Note;
  onUpdate: (updatedFields: Partial<Pick<Note, "title" | "content">>) => void;
  tags: Tag[];
}

export default function Editor({ note, onUpdate, tags }: EditorProps) {
  const editorRef = useRef<MdEditor | null>(null);
  const tag = tags.find(t => t.id === note.tagId);


  const handleChange =
    (field: "title") => (e: ChangeEvent<HTMLInputElement>) => {
      onUpdate({ [field]: e.target.value });
    };

  const handleSave = () => {
    if (!editorRef.current) return;

    const markdown = getMarkdown()(editorRef.current.ctx);
    onUpdate({ content: markdown });
  };

  const MilkdownEditor: React.FC = () => {
    useEditor((root) => {
      const editor = MdEditor.make()
        .config(nord)
        .config((ctx) => {
          ctx.set(rootCtx, root);
          ctx.set(defaultValueCtx, note.content || "");
        })
        .use(commonmark)
        .use(tooltip);

      editorRef.current = editor;

      return editor;
    });

    return <Milkdown />;
  };
  
  return (
    <div className="w-[57%] flex flex-col">
      <div className="flex justify-between border-b border-[var(--line)] px-20 py-3 text-xs">
        <span>{tag?.name} / {note.title}</span>
        <span className="text-[#808080] dark:text-white">{formatNoteDate(note.updatedAt)}</span>
      </div>
      <div className="flex-1 pt-4 pb-3 px-20">
        <input
          value={note.title}
          onChange={handleChange("title")}
          className="w-full text-[34px] font-bold border-b border-[var(--line)] pb-3 mb-[30px] dark:text-white"
          placeholder="請輸入標題"
        />
        <MilkdownProvider>
          <MilkdownEditor />
        </MilkdownProvider>
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition dark:bg-white"
        >
          儲存
        </button>
      </div>
    </div>
  );
}
