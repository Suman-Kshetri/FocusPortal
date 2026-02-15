import { useState, useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Table,
  CheckSquare,
  Save,
  X,
  Eye,
  Edit3,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  fileId: string;
  fileName: string;
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export const MarkdownEditor = ({
  fileName,
  initialContent,
  onSave,
  onClose,
}: MarkdownEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    setHasChanges(content !== initialContent);
  }, [content, initialContent]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(content);
      setHasChanges(false);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length,
      );
    }, 0);
  };

  const insertAtLine = (text: string) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeCursor = content.substring(0, start);
    // const afterCursor = content.substring(start);

    // Find start of current line
    const lineStart = beforeCursor.lastIndexOf("\n") + 1;
    const newText =
      content.substring(0, lineStart) + text + content.substring(lineStart);

    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        lineStart + text.length,
        lineStart + text.length,
      );
    }, 0);
  };

  const toolbarActions = [
    {
      icon: Heading1,
      label: "Heading 1",
      action: () => insertAtLine("# "),
      group: "heading",
    },
    {
      icon: Heading2,
      label: "Heading 2",
      action: () => insertAtLine("## "),
      group: "heading",
    },
    {
      icon: Heading3,
      label: "Heading 3",
      action: () => insertAtLine("### "),
      group: "heading",
    },
    {
      icon: Bold,
      label: "Bold",
      action: () => insertMarkdown("**", "**"),
      group: "format",
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertMarkdown("*", "*"),
      group: "format",
    },
    {
      icon: Code,
      label: "Code",
      action: () => insertMarkdown("`", "`"),
      group: "format",
    },
    {
      icon: List,
      label: "Bullet List",
      action: () => insertAtLine("- "),
      group: "list",
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertAtLine("1. "),
      group: "list",
    },
    {
      icon: CheckSquare,
      label: "Task List",
      action: () => insertAtLine("- [ ] "),
      group: "list",
    },
    {
      icon: Quote,
      label: "Quote",
      action: () => insertAtLine("> "),
      group: "block",
    },
    {
      icon: LinkIcon,
      label: "Link",
      action: () => insertMarkdown("[", "](url)"),
      group: "block",
    },
    {
      icon: ImageIcon,
      label: "Image",
      action: () => insertMarkdown("![alt](", ")"),
      group: "block",
    },
    {
      icon: Table,
      label: "Table",
      action: () =>
        insertAtLine(
          "\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n",
        ),
      group: "block",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-foreground">{fileName}</h2>
          {hasChanges && (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              • Unsaved changes
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              flex items-center gap-2
              ${
                isPreview
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "bg-accent text-accent-foreground hover:bg-accent/80"
              }
            `}
          >
            {isPreview ? (
              <>
                <Edit3 className="w-4 h-4" />
                Edit
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Preview
              </>
            )}
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="
              px-4 py-2 rounded-lg text-sm font-medium
              bg-blue-600 text-white
              hover:bg-blue-700
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              flex items-center gap-2
            "
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="
              p-2 rounded-lg
              hover:bg-accent
              transition-colors
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      {!isPreview && (
        <div className="px-6 py-3 border-b border-border bg-card/30 backdrop-blur-sm sticky top-[73px] z-10">
          <div className="flex items-center gap-1 flex-wrap">
            {toolbarActions.map((action, index) => {
              const showSeparator =
                index > 0 && toolbarActions[index - 1].group !== action.group;

              return (
                <div key={index} className="flex items-center">
                  {showSeparator && <div className="w-px h-6 bg-border mx-2" />}
                  <button
                    onClick={action.action}
                    title={action.label}
                    className="
                      p-2 rounded-lg
                      hover:bg-accent
                      transition-colors
                      group
                    "
                  >
                    <action.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        {isPreview ? (
          <div className="h-full overflow-y-auto px-6 py-8">
            <div className="max-w-4xl mx-auto">
              <article className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || "*No content yet. Start writing in edit mode.*"}
                </ReactMarkdown>
              </article>
            </div>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your notes... Use the toolbar above for formatting or type markdown directly."
            className="
              w-full h-full px-6 py-8
              resize-none
              bg-transparent
              border-none
              outline-none
              font-mono text-sm
              text-foreground
              placeholder:text-muted-foreground
            "
            spellCheck="false"
          />
        )}
      </div>
    </div>
  );
};
