import { useState } from "react";
import { FolderInput, X } from "lucide-react";
import { useMoveFile } from "@/server/api/files/useMoveFile";
import { useGetAllFolders } from "@/server/api/folder/useGetAllFolderWithPath";


interface MoveFileDialogProps {
  fileId: string;
  currentFolderId: string | null;
  onClose: () => void;
}

export const MoveFileDialog = ({
  fileId,
  currentFolderId,
  onClose,
}: MoveFileDialogProps) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    currentFolderId,
  );
  const { onSubmit, isLoading } = useMoveFile();
  const { data: foldersData, isLoading: foldersLoading } = useGetAllFolders();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onSubmit({ fileId, folderId: selectedFolderId });
      onClose();
    } catch (error) {
      console.error("Move error:", error);
    }
  };

  const folders = foldersData?.data?.folders || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md animate-scale-in">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FolderInput className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Move File</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="p-2 hover:bg-accent rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Destination Folder
            </label>

            {foldersLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading folders...
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {/* Root folder option */}
                <label className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="folder"
                    value="root"
                    checked={selectedFolderId === null}
                    onChange={() => setSelectedFolderId(null)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-foreground">Root Folder</span>
                </label>

                {/* Other folders */}
                {folders.map((folder: any) => (
                  <label
                    key={folder._id}
                    className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="folder"
                      value={folder._id}
                      checked={selectedFolderId === folder._id}
                      onChange={() => setSelectedFolderId(folder._id)}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-foreground">{folder.folderName}</span>
                  </label>
                ))}

                {folders.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No folders available
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-accent/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Moving...
                </>
              ) : (
                <>
                  <FolderInput className="w-4 h-4" />
                  Move File
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
