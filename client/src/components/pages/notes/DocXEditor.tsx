import { useState, useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Save, X, FileText, Loader2 } from "lucide-react";

interface DocxEditorProps {
  fileId: string;
  fileName: string;
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export const DocxEditor = ({
  fileName,
  initialContent,
  onSave,
  onClose,
  isLoading = false,
}: DocxEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    if (editorLoaded) {
      setHasChanges(content !== initialContent);
    }
  }, [content, initialContent, editorLoaded]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(content);
      setHasChanges(false);
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save document. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {fileName}
            </h2>
            {hasChanges && (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                • Unsaved changes
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
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
                <Loader2 className="w-4 h-4 animate-spin" />
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
            disabled={isSaving}
            className="
              p-2 rounded-lg
              hover:bg-accent
              transition-colors
              disabled:opacity-50
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
        <Editor
          apiKey="vsw6mi74f6zjl53iahqipq2w0i3dkjl5jkdcv15mzbslbmcg"
          onInit={(editor) => {
            editorRef.current = editor;
            setEditorLoaded(true);
          }}
          value={content}
          onEditorChange={handleEditorChange}
          init={{
            height: "100%",
            menubar: true,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
              "pagebreak",
              "nonbreaking",
              "save",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor backcolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "table link image | removeformat | help",
            content_style: `
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
                font-size: 14px;
                line-height: 1.6;
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
              }
              @media (prefers-color-scheme: dark) {
                body { 
                  background-color: #1a1a1a; 
                  color: #e0e0e0; 
                }
              }
            `,
            skin: window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "oxide-dark"
              : "oxide",
            content_css: window.matchMedia("(prefers-color-scheme: dark)")
              .matches
              ? "dark"
              : "default",
            branding: false,
            promotion: false,
            resize: false,
            statusbar: true,
            elementpath: true,
            paste_data_images: true,
            paste_as_text: false,
            paste_word_valid_elements:
              "b,strong,i,em,h1,h2,h3,h4,h5,h6,p,ol,ul,li,a,table,tr,td,th,div,span,img",
            autosave_ask_before_unload: true,
            autosave_interval: "30s",
          }}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-xl shadow-2xl flex items-center gap-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-foreground font-medium">
              Loading document...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
