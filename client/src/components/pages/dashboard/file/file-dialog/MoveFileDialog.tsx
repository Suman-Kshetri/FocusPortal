import { useState } from "react";
import { Home, Folder, ChevronRight, FileText, X } from "lucide-react";
import { useMoveFile } from "@/server/api/files/useMoveFile";
import { useGetAllFolders } from "@/server/api/folder/useGetAllFolderWithPath";
import LoadingAnimation from "@/components/other/LoadingAnimation";

interface MoveFileDialogProps {
  fileId: string;
  fileName: string;
  currentFolderId: string | null;
  onClose: () => void;
}

interface FolderWithPath {
  id: string;
  name: string;
  parentFolder: string | null;
  path: string;
  pathArray: { id: string; name: string }[];
}

export const MoveFileDialog = ({
  fileId,
  fileName,
  currentFolderId,
  onClose,
}: MoveFileDialogProps) => {
  const { onSubmit, isLoading } = useMoveFile();
  const { data, isLoading: isFoldersLoading } = useGetAllFolders();
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    currentFolderId,
  );

  const folders: FolderWithPath[] = data?.data || [];

  const handleMove = async () => {
    try {
      await onSubmit({ fileId, folderId: selectedDestination });
      onClose();
    } catch (error) {
      console.error("Move error:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Move File
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground truncate">
                  {fileName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 hover:bg-accent rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          {isFoldersLoading ? (
            <LoadingAnimation />
          ) : (
            <div className="space-y-2">
              {/* Root option */}
              <div
                onClick={() => setSelectedDestination(null)}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${
                    selectedDestination === null
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-accent"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">Root</div>
                    <div className="text-sm text-muted-foreground">
                      Move to root directory
                    </div>
                  </div>
                  {selectedDestination === null && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-primary-foreground"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Available folders */}
              {folders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No folders available. Create a folder first to organize your
                  files.
                </div>
              ) : (
                folders.map((folder) => (
                  <div
                    key={folder.id}
                    onClick={() => setSelectedDestination(folder.id)}
                    className={`
                      p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${
                        selectedDestination === folder.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-accent"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="w-5 h-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate">
                          {folder.name}
                        </div>
                        {/* Path breadcrumb */}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1 flex-wrap">
                          <Home className="w-3 h-3 flex-shrink-0" />
                          {folder.pathArray.map((p, idx) => (
                            <span
                              key={p.id}
                              className="flex items-center gap-1"
                            >
                              {idx > 0 && (
                                <ChevronRight className="w-3 h-3 flex-shrink-0" />
                              )}
                              <span className="truncate">{p.name}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                      {selectedDestination === folder.id && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-3 h-3 text-primary-foreground"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-muted/30 rounded-b-xl flex items-center justify-end gap-3 border-t border-border">
          <button
            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors duration-200"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleMove}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Moving...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Move File
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
