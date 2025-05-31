import { TooltipProvider } from "@milkdown/kit/plugin/tooltip";
import { callCommand } from "@milkdown/kit/utils";
import { toggleStrongCommand } from "@milkdown/kit/preset/commonmark";
import type { EditorView } from "prosemirror-view";
import type { Editor } from "@milkdown/core";

export function tooltipPluginView(editor: Editor, view: EditorView) {
  const content = document.createElement("div");
  content.className = "tooltip-menu";
  content.style.display = "flex";
  content.style.gap = "8px";
  content.style.padding = "6px 10px";
  content.style.border = "1px solid #ccc";
  content.style.borderRadius = "6px";
  content.style.background = "white";
  content.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
  content.style.zIndex = "999";
  content.style.position = "absolute";

  const buttons = [
    { label: "B", command: toggleStrongCommand.key },
  ];

  const btn = document.createElement("button");
  btn.textContent = "B";
  btn.style.border = "none";
  btn.style.background = "transparent";
  btn.style.cursor = "pointer";
  btn.style.fontWeight = "bold";

  btn.onclick = (e) => {
    e.preventDefault();
    editor.action(callCommand(toggleStrongCommand.key));
    view.focus();
  };

  content.appendChild(btn);

  const provider = new TooltipProvider({
    content,
    shouldShow: (view) => {
      const { from, to } = view.state.selection;
      return from !== to;
    },
    offset: { mainAxis: 8, crossAxis: 0 },
  });

  return {
    update(updatedView:any, prevState:any) {
      const { from, to } = updatedView.state.selection;
      if (from !== to) {
        provider.show();
      } else {
        provider.hide();
      }
      provider.update(updatedView, prevState);
    },
    destroy() {
      provider.destroy();
      content.remove();
    },
  };
}
