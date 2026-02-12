interface RenameFolderDialogProps {
  folderId: string;
  onClose: () => void;
}
export const RenameFolderDialog = ({ folderId, onClose }: RenameFolderDialogProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4 animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Rename Folder
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Change the folder name
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              New Folder Name
            </label>
            <input
              type="text"
              defaultValue="Documents"
              className="
                w-full px-4 py-2.5
                bg-background border border-input
                rounded-lg
                text-foreground placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                transition-all duration-200
              "
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-muted/30 rounded-b-xl flex items-center justify-end gap-3">
          <button
            className="
            px-4 py-2
            text-sm font-medium text-foreground
            hover:bg-muted
            rounded-lg
            transition-colors duration-200
          "
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="
            px-4 py-2
            text-sm font-medium text-primary-foreground
            bg-primary hover:bg-primary/90
            rounded-lg
            transition-colors duration-200
          "
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
