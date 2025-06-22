import { TooltipProvider } from "@milkdown/kit/plugin/tooltip";
import { callCommand } from "@milkdown/kit/utils";
import {
  toggleStrongCommand,
  toggleLinkCommand,
  createCodeBlockCommand,
  toggleEmphasisCommand,
  wrapInHeadingCommand,
} from "@milkdown/kit/preset/commonmark";
import { toggleStrikethroughCommand } from "@milkdown/preset-gfm";
import type { EditorView } from "prosemirror-view";
import type { Editor } from "@milkdown/core";
import type { EditorState } from "prosemirror-state";

export function tooltipPluginView(editor: Editor, view: EditorView) {
  const content = document.createElement("div");
  content.className = "tooltip-menu";
  content.style.cssText = `
    display: flex;
    gap: 6px;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 999;
    position: absolute;
  `;

  const createButton = (src: string, alt: string, onClick: () => void) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.style.width = "18px";
    img.style.height = "18px";
  
    const btn = document.createElement("button");
    btn.appendChild(img);
    btn.style.border = "none";
    btn.style.background = "transparent";
    btn.style.cursor = "pointer";
    btn.style.padding = "4px";
    btn.style.borderRadius = "4px";
  
    btn.onmouseenter = () => {
      btn.style.background = "#FAF9FD";
    };
    btn.onmouseleave = () => {
      btn.style.background = "transparent";
    };
  
    btn.onclick = (e) => {
      e.preventDefault();
      onClick();
      view.focus();
    };
  
    content.appendChild(btn);
  };
  

  createButton("/toolbar/bold.svg", "Bold", () =>
    editor.action(callCommand(toggleStrongCommand.key))
  );
  createButton("/toolbar/emphasis.svg", "Italic", () =>
    editor.action(callCommand(toggleEmphasisCommand.key))
  );
  createButton("/toolbar/strike.svg", "Strike", () =>
    editor.action(callCommand(toggleStrikethroughCommand.key))
  );
  createButton("/toolbar/h1.svg", "Heading 1", () =>
    editor.action(callCommand(wrapInHeadingCommand.key, 1))
  );
  createButton("/toolbar/h2.svg", "Heading 2", () =>
    editor.action(callCommand(wrapInHeadingCommand.key, 2))
  );
  createButton("/toolbar/h3.svg", "Heading 3", () =>
    editor.action(callCommand(wrapInHeadingCommand.key, 3))
  );
  createButton("/toolbar/link.svg", "Link", () => {
    const url = prompt("Enter URL:");
    if (!url) return;
    editor.action(
      callCommand(toggleLinkCommand.key, {
        href: url,
        title: url,
      })
    );
  });
  createButton("/toolbar/code.svg", "Code", () =>
    editor.action(callCommand(createCodeBlockCommand.key))
  );

  const provider = new TooltipProvider({
    content,
    shouldShow: (view) => {
      const { from, to } = view.state.selection;
      return from !== to;
    },
    offset: { mainAxis: 8, crossAxis: 0 },
  });

  const handleSelectionChange = () => {
    const selection = document.getSelection();
    if (!selection || selection.isCollapsed) {
      provider.hide();
      return;
    }
    const anchorNode = selection.anchorNode;
    if (anchorNode && !view.dom.contains(anchorNode)) {
      provider.hide();
    }
  };

  document.addEventListener("selectionchange", handleSelectionChange);

  return {
    update(updatedView: EditorView, prevState: EditorState) {
      const { from, to } = updatedView.state.selection;
      const selectionEmpty = from === to;
      if (!updatedView.hasFocus() || selectionEmpty) {
        provider.hide();
        return;
      }
      provider.show();
      provider.update(updatedView, prevState);
    },
    destroy() {
      provider.destroy();
      content.remove();
      document.removeEventListener("selectionchange", handleSelectionChange);
    },
  };
}
