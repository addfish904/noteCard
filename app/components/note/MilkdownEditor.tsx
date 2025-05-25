import { Note } from "@/types/note";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { nord } from "@milkdown/theme-nord";
import {
    Editor as MdEditor,
    rootCtx,
    defaultValueCtx,
  } from "@milkdown/kit/core";
import { usePluginViewFactory } from '@prosemirror-adapter/react';
import { tooltip, TooltipView } from "./Tooltip";


interface MilkdownEditorProps {
    note: Note;
    editorRef: React.RefObject<MdEditor | null>;
  }
  
export const MilkdownEditor: React.FC<MilkdownEditorProps> = ({ note, editorRef }) => {
    const pluginViewFactory = usePluginViewFactory();
  
    useEditor((root) => {
      const editor = MdEditor.make()
        .config(nord)
        .config((ctx) => {
          ctx.set(rootCtx, root);
          ctx.set(defaultValueCtx, note.content || "");
          ctx.set(tooltip.key, {
            view: pluginViewFactory({
              component: TooltipView,
            }),
          });
        })
        .use(commonmark)
        .use(tooltip);
  
      editorRef.current = editor;
  
      return editor;
    }, []);
  
    return <Milkdown />;
  };

