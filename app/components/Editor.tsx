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

interface EditorProps {
  note: Note;
  onUpdate: (updatedFields: Partial<Pick<Note, "title" | "content">>) => void;
}

export default function Editor({ note, onUpdate }: EditorProps) {
  const editorRef = useRef<MdEditor | null>(null);

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
      <div className="border-b border-[var(--line)] px-20 py-3">
        {note.updatedAt}
      </div>
      <div className="flex-1 py-3 px-20 prose">
        <input
          value={note.title}
          onChange={handleChange("title")}
          className="w-full text-[34px] font-bold border-b border-[var(--line)] pb-3 mb-[30px]"
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
