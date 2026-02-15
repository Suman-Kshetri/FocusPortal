import { useState } from "react";
import { Plus, FileText, Clock, Search, X } from "lucide-react";
import { MarkdownEditor } from "./MarkdownEditor";
import { useGetFiles } from "@/server/api/files/useGetFolderFiles";
import { useEditFile } from "@/server/api/files/useEditFile";
import { useReadFileContent } from "@/server/api/files/useReadFileContent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateFile } from "@/server/api/files/useCreateFiles";

interface FileItem {
  _id: string;
  fileName: string;
  type: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export const NotesPage = () => {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // API hooks
  const { data: filesData, refetch: refetchFiles } = useGetFiles(null);
  const { mutateAsync: createFile } = useCreateFile();
  const { mutateAsync: editFile } = useEditFile();
  const { mutateAsync: readContent } = useReadFileContent();

  // Filter only markdown files
  const markdownFiles: FileItem[] = (filesData?.data?.files || []).filter(
    (file: FileItem) => file.type === "md",
  );

  // Search filter
  const filteredFiles = markdownFiles.filter((file) =>
    file.fileName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateNote = async () => {
    if (!newFileName.trim()) {
      alert("Please enter a file name");
      return;
    }

    try {
      await createFile({
        fileName: newFileName,
        type: "md",
        content: "# " + newFileName + "\n\nStart writing your notes here...",
        folder: null,
      });

      setNewFileName("");
      setCreateDialogOpen(false);
      refetchFiles();
    } catch (error) {
      console.error("Error creating note:", error);
      alert("Failed to create note");
    }
  };

  const handleOpenNote = async (fileId: string) => {
    try {
      const response = await readContent(fileId);
      setFileContent(response.data.content || "");
      setSelectedFileId(fileId);
    } catch (error) {
      console.error("Error reading note:", error);
      alert("Failed to open note");
    }
  };

  const handleSaveNote = async (content: string) => {
    if (!selectedFileId) return;

    try {
      await editFile({ id: selectedFileId, content });
      setFileContent(content);
      refetchFiles();
    } catch (error) {
      console.error("Error saving note:", error);
      throw error;
    }
  };

  const handleCloseEditor = () => {
    setSelectedFileId(null);
    setFileContent("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const selectedFile = markdownFiles.find((f) => f._id === selectedFileId);

  // If a file is selected, show the editor
  if (selectedFileId && selectedFile) {
    return (
      <MarkdownEditor
        fileId={selectedFileId}
        fileName={selectedFile.fileName}
        initialContent={fileContent}
        onSave={handleSaveNote}
        onClose={handleCloseEditor}
      />
    );
  }

  // Otherwise show the notes list
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            Study Notes
          </h1>
          <p className="text-muted-foreground">
            Create and manage your markdown notes
          </p>
        </div>

        {/* Search and Create Bar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-10 pr-10 py-3
                bg-card border border-border rounded-lg
                text-foreground placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all
              "
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="
              px-6 py-3 rounded-lg
              bg-blue-600 text-white
              hover:bg-blue-700
              transition-all duration-200
              flex items-center gap-2
              font-medium
              shadow-lg hover:shadow-xl
              hover-lift
            "
          >
            <Plus className="w-5 h-5" />
            New Note
          </button>
        </div>

        {/* Notes Grid */}
        {filteredFiles.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchQuery ? "No notes found" : "No notes yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first note to get started"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setCreateDialogOpen(true)}
                className="
                  px-6 py-3 rounded-lg
                  bg-blue-600 text-white
                  hover:bg-blue-700
                  transition-all
                  inline-flex items-center gap-2
                "
              >
                <Plus className="w-5 h-5" />
                Create Note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <button
                key={file._id}
                onClick={() => handleOpenNote(file._id)}
                className="
                  p-6 rounded-xl
                  bg-card border border-border
                  hover:border-blue-500 hover:shadow-lg
                  transition-all duration-200
                  text-left
                  group
                  hover-lift
                "
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {file.fileName.replace(/\.md$/, "")}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(file.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create Note Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <DialogDescription>
              Give your note a name. You can change it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Note Name
              </label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateNote();
                  }
                }}
                placeholder="My Study Notes"
                className="
                  w-full px-4 py-3
                  bg-background border border-border rounded-lg
                  text-foreground placeholder:text-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setCreateDialogOpen(false);
                  setNewFileName("");
                }}
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNote}
                disabled={!newFileName.trim()}
                className="
                  px-6 py-2 text-sm font-medium
                  bg-blue-600 text-white
                  hover:bg-blue-700
                  rounded-lg transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                Create
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
