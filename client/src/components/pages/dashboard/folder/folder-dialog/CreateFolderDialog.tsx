import { useFolderCreation } from "@/server/api/folder/useFolderCreation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FolderCreationProps {
  parentFolderId: string | null;
  onClose: () => void;
}

const CreateFolderDialog = ({
  parentFolderId,
  onClose,
}: FolderCreationProps) => {
  const [name, setName] = useState("");
  const { onSubmit, isLoading, error, isSuccess } = useFolderCreation();

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess, onClose]);

  const handleFolderCreation = () => {
    if (!name.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }
    // console.log($&)
    onSubmit({ folderName: name, parentFolder: parentFolderId });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4 animate-scale-in">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Create New Folder
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enter a name for your new folder
          </p>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Folder Name
            </label>
            <input
              type="text"
              value={name}
              placeholder="e.g., My Documents"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleFolderCreation();
              }}
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
        {error && (
          <div className="px-6 py-2 text-sm text-destructive">
            Failed to create folder: {error}
          </div>
        )}
        <div className="px-6 py-4 bg-muted/30 rounded-b-xl flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="
              px-4 py-2
              text-sm font-medium text-foreground
              hover:bg-muted
              rounded-lg
              transition-colors duration-200
              disabled:opacity-50
            "
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
              disabled:opacity-50
            "
            onClick={handleFolderCreation}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Folder"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderDialog;
