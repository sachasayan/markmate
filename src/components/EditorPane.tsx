import { useRef, useEffect } from "react";
import FloatingToolbar from "./FloatingToolbar";

interface EditorPaneProps {
  markdown: string;
  onChange: (value: string) => void;
}

export default function EditorPane({ markdown, onChange }: EditorPaneProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.textContent = markdown;
    }
  }, []);

  const handleTab = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const selection = window.getSelection();
      if (!selection || !editorRef.current) return;

      const range = selection.getRangeAt(0);
      const content = editorRef.current.textContent || "";

      // Find the start of the current line
      let lineStart = content.lastIndexOf("\n", range.startOffset) + 1;
      if (lineStart === -1) lineStart = 0;

      // Insert two spaces for indentation
      const spaces = "  ";
      const newContent =
        content.substring(0, lineStart) + spaces + content.substring(lineStart);

      editorRef.current.textContent = newContent;

      // Update selection
      const newRange = document.createRange();
      newRange.setStart(
        editorRef.current.firstChild || editorRef.current,
        lineStart + 2,
      );
      newRange.setEnd(
        editorRef.current.firstChild || editorRef.current,
        lineStart + 2,
      );
      selection.removeAllRanges();
      selection.addRange(newRange);

      // Trigger change event
      handleInput();
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.textContent || "";
      onChange(content);
    }
  };

  // Ensure editor content stays in sync with markdown prop
  useEffect(() => {
    if (editorRef.current && editorRef.current.textContent !== markdown) {
      editorRef.current.textContent = markdown;
    }
  }, [markdown]);

  return (
    <div className="relative h-full w-full bg-background overflow-y-auto">
      <div className="sticky top-0 z-10 bg-background px-4 pt-4">
        <FloatingToolbar editorRef={editorRef} />
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleTab}
        className="h-full w-full resize-none font-mono focus:outline-none px-4"
        style={{ whiteSpace: "pre-wrap" }}
      />
    </div>
  );
}
