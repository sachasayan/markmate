import { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FloatingToolbarProps {
  editorRef: RefObject<HTMLDivElement>;
}

export default function FloatingToolbar({ editorRef }: FloatingToolbarProps) {
  const formatText = (format: string) => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const content = editorRef.current.textContent || "";
    const selectedText = selection.toString();

    // For bold and italic, apply inline formatting
    if (format === "bold" || format === "italic") {
      const prefix = format === "bold" ? "**" : "_";
      const suffix = prefix;
      const formattedText = `${prefix}${selectedText}${suffix}`;

      range.deleteContents();
      range.insertNode(document.createTextNode(formattedText));
    }
    // For lists, apply at start of line like headings
    else if (format === "list" || format === "numbered-list") {
      // Find the start and end of the current line
      let lineStart = content.lastIndexOf("\n", range.startOffset) + 1;
      if (lineStart === -1) lineStart = 0;

      let lineEnd = content.indexOf("\n", range.startOffset);
      if (lineEnd === -1) lineEnd = content.length;

      // Get the current line's content
      const currentLine = content.substring(lineStart, lineEnd);

      // Extract indentation and clean line
      const indentMatch = currentLine.match(/^(\s*)/);
      const indentation = indentMatch ? indentMatch[1] : "";

      // Find all previous lines to determine list number
      const previousLines = content.substring(0, lineStart).split("\n");
      let listNumber = 1;

      if (format === "numbered-list") {
        // Count numbered items at the same indentation level
        for (let i = previousLines.length - 1; i >= 0; i--) {
          const line = previousLines[i];
          const lineIndent = line.match(/^(\s*)/)?.[1] || "";

          if (lineIndent.length === indentation.length) {
            const numberMatch = line.match(/^\s*?(\d+)\. /);
            if (numberMatch) {
              listNumber = parseInt(numberMatch[1]) + 1;
              break;
            }
          } else if (lineIndent.length < indentation.length) {
            break;
          }
        }
      }

      const cleanLine = currentLine.replace(/^\s*(?:- |\d+\. )?/, "");

      // Add list marker with preserved indentation
      const newLine =
        format === "list"
          ? `${indentation}- ${cleanLine}`
          : `${indentation}${listNumber}. ${cleanLine}`;

      // Reconstruct the full content
      const newContent =
        content.substring(0, lineStart) + newLine + content.substring(lineEnd);
      editorRef.current.textContent = newContent;

      // Restore selection
      const newRange = document.createRange();
      const newSelection = window.getSelection();
      newRange.setStart(
        editorRef.current.firstChild || editorRef.current,
        lineStart,
      );
      newRange.setEnd(
        editorRef.current.firstChild || editorRef.current,
        lineStart + newLine.length,
      );
      newSelection?.removeAllRanges();
      newSelection?.addRange(newRange);
    }

    // Trigger change event
    const event = new InputEvent("input", { bubbles: true, composed: true });
    editorRef.current.dispatchEvent(event);
    editorRef.current.focus();
  };

  const handleHeadingSelect = (value: string) => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const content = editorRef.current.textContent || "";

    // Find the start and end of the current line
    let lineStart = content.lastIndexOf("\n", range.startOffset) + 1;
    if (lineStart === -1) lineStart = 0;

    let lineEnd = content.indexOf("\n", range.startOffset);
    if (lineEnd === -1) lineEnd = content.length;

    // Get the current line's content
    const currentLine = content.substring(lineStart, lineEnd);

    // Remove existing heading markers if any
    const cleanLine = currentLine.replace(/^#{1,6}\s+/, "");

    // Create the new line with heading if not normal
    const newLine =
      value === "normal"
        ? cleanLine
        : `${"#".repeat(Number(value))} ${cleanLine}`;

    // Reconstruct the full content with the modified line
    const newContent =
      content.substring(0, lineStart) + newLine + content.substring(lineEnd);

    // Update the editor content
    editorRef.current.textContent = newContent;

    // Trigger change event
    const event = new InputEvent("input", { bubbles: true, composed: true });
    editorRef.current.dispatchEvent(event);
    editorRef.current.focus();

    // Restore selection
    const newRange = document.createRange();
    const newSelection = window.getSelection();
    newRange.setStart(
      editorRef.current.firstChild || editorRef.current,
      lineStart,
    );
    newRange.setEnd(
      editorRef.current.firstChild || editorRef.current,
      lineStart + newLine.length,
    );
    newSelection?.removeAllRanges();
    newSelection?.addRange(newRange);
  };

  return (
    <div className="mb-2 flex gap-2">
      <Select onValueChange={handleHeadingSelect} defaultValue="normal">
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="Heading" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="1">Heading 1</SelectItem>
          <SelectItem value="2">Heading 2</SelectItem>
          <SelectItem value="3">Heading 3</SelectItem>
          <SelectItem value="4">Heading 4</SelectItem>
          <SelectItem value="5">Heading 5</SelectItem>
          <SelectItem value="6">Heading 6</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" onClick={() => formatText("bold")}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => formatText("italic")}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => formatText("list")}>
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => formatText("numbered-list")}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  );
}
