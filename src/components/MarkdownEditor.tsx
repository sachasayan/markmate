import { useState, useEffect } from "react";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import EditorPane from "./EditorPane";
import PreviewPane from "./PreviewPane";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, Code, Columns, Moon, Sun } from "lucide-react";

type ViewMode = "markdown" | "preview" | "split";

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(
    "# Hello World\n\nStart typing your markdown here...",
  );
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="h-full w-full bg-background">
      <div className="mb-4 flex justify-end gap-2">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value: ViewMode) => value && setViewMode(value)}
        >
          <ToggleGroupItem value="markdown" aria-label="Raw markdown">
            <Code className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="preview" aria-label="Preview">
            <Eye className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="split" aria-label="Split view">
            <Columns className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-accent"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      {viewMode === "split" ? (
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[200px] w-full rounded-lg border"
        >
          <ResizablePanel defaultSize={50}>
            <EditorPane markdown={markdown} onChange={setMarkdown} />
          </ResizablePanel>
          <ResizablePanel defaultSize={50}>
            <PreviewPane markdown={markdown} />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="min-h-[200px] w-full rounded-lg border">
          {viewMode === "markdown" ? (
            <EditorPane markdown={markdown} onChange={setMarkdown} />
          ) : (
            <PreviewPane markdown={markdown} />
          )}
        </div>
      )}
    </div>
  );
}
