import { useDeleteFolder } from "@/server/api/folder/useDeleteFolder";

interface DeleteFolderDialogProps {
  folderId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteFolderDialog = ({
  folderId,
  onClose,
  onSuccess,
}: DeleteFolderDialogProps) => {
  const { onDelete, isLoading } = useDeleteFolder();
  const handleDeleteFolder = () => {
    if (folderId) {
      onDelete(folderId);
      onClose();
      onSuccess();
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4 animate-scale-in">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Delete Folder
              </h2>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="space-y-4">
            <p className="text-sm text-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold">"Documents"</span>?
            </p>

            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">
                    Warning
                  </p>
                  <p className="text-xs text-muted-foreground">
                    All files and subfolders inside this folder will also be
                    permanently deleted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-muted/30 rounded-b-xl flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="
              px-4 py-2
              text-sm font-medium text-foreground
              hover:bg-muted
              rounded-lg
              transition-colors duration-200
            "
          >
            Cancel
          </button>
          <button
            className="
            px-4 py-2
            text-sm font-medium text-white
            bg-destructive hover:bg-destructive/90
            rounded-lg
            transition-colors duration-200
            flex items-center gap-2
          "
            onClick={handleDeleteFolder}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFolderDialog;
