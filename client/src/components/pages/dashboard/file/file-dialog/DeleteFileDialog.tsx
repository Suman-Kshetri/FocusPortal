import { useDeleteFile } from "@/server/api/files/useDeleteFile";
import { Trash2, AlertTriangle, X } from "lucide-react";

interface DeleteFileDialogProps {
  fileId: string;
  fileName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DeleteFileDialog = ({
  fileId,
  fileName,
  onClose,
  onSuccess,
}: DeleteFileDialogProps) => {
  const { onSubmit, isLoading } = useDeleteFile();

  const handleDelete = async () => {
    try {
      await onSubmit(fileId);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Delete File</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-accent rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-semibold mb-1">
                Warning: This action cannot be undone
              </p>
              <p>The file will be permanently deleted.</p>
            </div>
          </div>

          <p className="text-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold">"{fileName}"</span>?
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-accent/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete File
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
