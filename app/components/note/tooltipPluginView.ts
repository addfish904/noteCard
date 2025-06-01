import { TooltipProvider } from "@milkdown/kit/plugin/tooltip";
import { callCommand } from "@milkdown/kit/utils";
import {
  toggleStrongCommand,
  toggleLinkCommand,
  createCodeBlockCommand,
  toggleEmphasisCommand,
  wrapInHeadingCommand
} from "@milkdown/kit/preset/commonmark";
import { toggleStrikethroughCommand } from "@milkdown/preset-gfm";
import type { EditorView } from "prosemirror-view";
import type { Editor } from "@milkdown/core";
import type { EditorState } from "prosemirror-state";

export function tooltipPluginView(editor: Editor, view: EditorView) {
  const content = document.createElement("div");
  content.className = "tooltip-menu";
  content.style.display = "flex";
  content.style.gap = "12px";
  content.style.padding = "8px 12px";
  content.style.border = "1px solid #ccc";
  content.style.borderRadius = "6px";
  content.style.background = "white";
  content.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
  content.style.zIndex = "999";
  content.style.position = "absolute";

  // ---- Bold button ----
  const boldImg = document.createElement("img");
  boldImg.src = "/toolbar/bold.svg";
  boldImg.alt = "Bold";
  boldImg.style.width = "18px";
  boldImg.style.height = "18px";

  const boldbtn = document.createElement("button");
  boldbtn.appendChild(boldImg);
  boldbtn.style.border = "none";
  boldbtn.style.background = "transparent";
  boldbtn.style.cursor = "pointer";
  boldbtn.style.fontWeight = "bold";

  boldbtn.onclick = (e) => {
    e.preventDefault();
    editor.action(callCommand(toggleStrongCommand.key));
    view.focus();
  };

  content.appendChild(boldbtn);

  // ---- emphasis button 斜體 ----
  const emphasisImg = document.createElement("img");
  emphasisImg.src = "/toolbar/emphasis.svg";
  emphasisImg.alt = "Code";
  emphasisImg.style.width = "18px";
  emphasisImg.style.height = "18px";

  const emphasisbtn = document.createElement("button");
  emphasisbtn.appendChild(emphasisImg);
  emphasisbtn.style.border = "none";
  emphasisbtn.style.background = "transparent";
  emphasisbtn.style.cursor = "pointer";
  emphasisbtn.style.fontWeight = "bold";

  emphasisbtn.onclick = (e) => {
    e.preventDefault();
    editor.action(callCommand(toggleEmphasisCommand.key));
    view.focus();
  };

  content.appendChild(emphasisbtn);

  // ---- strike button 刪除線 ----
  const strikeImg = document.createElement("img");
  strikeImg.src = "/toolbar/strike.svg";
  strikeImg.alt = "Code";
  strikeImg.style.width = "18px";
  strikeImg.style.height = "18px";

  const strikebtn = document.createElement("button");
  strikebtn.appendChild(strikeImg);
  strikebtn.style.border = "none";
  strikebtn.style.background = "transparent";
  strikebtn.style.cursor = "pointer";
  strikebtn.style.fontWeight = "bold";

  strikebtn.onclick = (e) => {
    e.preventDefault();
    editor.action(callCommand(toggleStrikethroughCommand.key));
    view.focus();
  };

  content.appendChild(strikebtn);


  // ---- h1 button 標題 ----
  const h1Img = document.createElement("img");
  h1Img.src = "/toolbar/h1.svg";
  h1Img.alt = "Heading 1";
  h1Img.style.width = "18px";
  h1Img.style.height = "18px";

  const h1btn = document.createElement("button");
  h1btn.appendChild(h1Img);
  h1btn.style.border = "none";
  h1btn.style.background = "transparent";
  h1btn.style.cursor = "pointer";
  h1btn.style.fontWeight = "bold";

  h1btn.onclick = (e) => {
    e.preventDefault();
    editor.action(callCommand(wrapInHeadingCommand.key, 1));
    view.focus();
  };
  content.appendChild(h1btn);

  // ---- h2 button 標題 ----
  const h2Img = document.createElement("img");
  h2Img.src = "/toolbar/h2.svg";
  h2Img.alt = "Heading 2";
  h2Img.style.width = "18px";
  h2Img.style.height = "18px";

  const h2btn = document.createElement("button");
  h2btn.appendChild(h2Img);
  h2btn.style.border = "none";
  h2btn.style.background = "transparent";
  h2btn.style.cursor = "pointer";
  h2btn.style.fontWeight = "bold";

  h2btn.onclick = (e) => {
    e.preventDefault();
    editor.action(callCommand(wrapInHeadingCommand.key, 2));
    view.focus();
  };
  content.appendChild(h2btn);

  // ---- h3 button 標題 ----
  const h3Img = document.createElement("img");
  h3Img.src = "/toolbar/h3.svg";
  h3Img.alt = "Heading 2";
  h3Img.style.width = "18px";
  h3Img.style.height = "18px";

  const h3btn = document.createElement("button");
  h3btn.appendChild(h3Img);
  h3btn.style.border = "none";
  h3btn.style.background = "transparent";
  h3btn.style.cursor = "pointer";
  h3btn.style.fontWeight = "bold";

  h3btn.onclick = (e) => {
    e.preventDefault();
    editor.action(callCommand(wrapInHeadingCommand.key, 3));
    view.focus();
  };
  content.appendChild(h3btn);

  // ---- Link button ----
  const linkImg = document.createElement("img");
  linkImg.src = "/toolbar/link.svg";
  linkImg.alt = "Link";
  linkImg.style.width = "18px";
  linkImg.style.height = "18px";

  const linkBtn = document.createElement("button");
  linkBtn.appendChild(linkImg);
  linkBtn.title = "Add Link";
  linkBtn.style.border = "none";
  linkBtn.style.background = "transparent";
  linkBtn.style.cursor = "pointer";
  linkBtn.style.fontSize = "16px";

  linkBtn.onclick = (e) => {
    e.preventDefault();
    const url = prompt("Enter URL:");
    if (!url) return;
    editor.action(
      callCommand(toggleLinkCommand.key, {
        href: url,
        title: url,
      })
    );
    view.focus();
  };
  content.appendChild(linkBtn);

  // ---- Code button ----
  const codeImg = document.createElement("img");
  codeImg.src = "/toolbar/code.svg";
  codeImg.alt = "Code";
  codeImg.style.width = "18px";
  codeImg.style.height = "18px";

  const codebtn = document.createElement("button");
  codebtn.appendChild(codeImg);
  codebtn.style.border = "none";
  codebtn.style.background = "transparent";
  codebtn.style.cursor = "pointer";
  codebtn.style.fontWeight = "bold";

  codebtn.onclick = (e) => {
    e.preventDefault();
    editor.action(callCommand(createCodeBlockCommand.key));
    view.focus();
  };

  content.appendChild(codebtn);




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
    if (!selection) return;
    if (selection.isCollapsed) {
      provider.hide();
    }
  };

  document.addEventListener("selectionchange", handleSelectionChange);

  return {
    update(updatedView: EditorView, prevState: EditorState) {
      const { from, to } = updatedView.state.selection;
      const shouldShow = from !== to;

      if (shouldShow) {
        provider.show();
        provider.update(updatedView, prevState);
      } else {
        provider.hide();
      }
    },
    destroy() {
      provider.destroy();
      content.remove();
      document.removeEventListener("selectionchange", handleSelectionChange);
    },
  };
}
