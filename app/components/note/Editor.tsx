"use client";

import { ChangeEvent, useRef, useState, useEffect } from "react";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import {
  Editor as MdEditor,
  rootCtx,
  defaultValueCtx,
} from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { nord } from "@milkdown/theme-nord";
import { getMarkdown } from "@milkdown/utils";
import { formatNoteDate } from "@/lib/firestore";
import { tooltipFactory } from "@milkdown/kit/plugin/tooltip";
import { tooltipPluginView } from "./tooltipPluginView";
import { gfm } from "@milkdown/preset-gfm";
import { useNoteContext } from "@/app/context/NoteContext";
import { useTags } from "@/app/context/TagContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Editor() {
  const editorRef = useRef<MdEditor | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { selectedNote, updateNote } = useNoteContext();
  const { tags } = useTags();
  const [localTitle, setLocalTitle] = useState(selectedNote?.title || "");

  useEffect(() => {
    setLocalTitle(selectedNote?.title || "");
  }, [selectedNote]);

  if (!selectedNote) return null;

  const tag = tags.find((t) => t.id === selectedNote.tagId);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
  };

  const handleSave = async () => {
    if (!selectedNote || !editorRef.current) return;

    setIsSaving(true);
    const markdown = getMarkdown()(editorRef.current.ctx);
    console.log("儲存的 markdown:", markdown);

    try {
      await updateNote(selectedNote.id, {
        title: localTitle,
        content: markdown,
      });
      toast.success("儲存成功");
    } finally {
      setIsSaving(false);
    }
  };

  const MilkdownEditor: React.FC = () => {
    useEditor((root) => {
      const tooltip = tooltipFactory("selection-tooltip");

      const editor = MdEditor.make()
        .config(nord)
        .config((ctx) => {
          ctx.set(rootCtx, root);
          ctx.set(defaultValueCtx, selectedNote.content || "");
          ctx.set(tooltip.key, {
            view: (view) => tooltipPluginView(editor, view),
          });
        })
        .use(commonmark)
        .use(gfm)
        .use(tooltip);

      editorRef.current = editor;
      return editor;
    }, []);

    return <Milkdown />;
  };

  return (
    <div className="flex flex-col w-full h-full overflow-scroll">
      <div className="flex justify-between border-b border-[var(--line)] sm:px-20 px-8 py-3 text-xs">
        <span>
          {tag?.name} / {selectedNote.title}
        </span>
        <span className="text-[#808080] dark:text-white">
          {formatNoteDate(selectedNote.updatedAt)}
        </span>
      </div>
      <div className="pt-4 pb-3 sm:px-20 px-8">
        <input
          value={localTitle}
          onChange={handleTitleChange}
          className="w-full text-[34px] font-bold border-b border-[var(--line)] pb-3 mb-[30px] dark:text-white"
          placeholder="請輸入標題"
        />
        <MilkdownProvider>
          <MilkdownEditor />
        </MilkdownProvider>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-4 px-5 py-3 flex items-center justify-center bg-[var(--color-primary)] text-white rounded-md cursor-pointer hover:bg-[#323153] transition dark:bg-white"
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
              儲存中...
            </>
          ) : (
            "儲存"
          )}
        </button>
      </div>
    </div>
  );
}
