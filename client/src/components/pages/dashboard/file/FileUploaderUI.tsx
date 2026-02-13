import { Upload } from "lucide-react";

interface FileUploadUIProps {
  onClick: () => void;
}

export const FileUploadUI = ({ onClick }: FileUploadUIProps) => {
  return (
    <button
      onClick={onClick}
      className="
        group relative aspect-square
        bg-gradient-to-br from-blue-50 to-indigo-50
        dark:from-blue-950/20 dark:to-indigo-950/20
        border-2 border-dashed border-blue-300 dark:border-blue-700
        rounded-xl p-6
        hover:from-blue-100 hover:to-indigo-100
        dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30
        hover:border-blue-400 dark:hover:border-blue-600
        transition-all duration-300
        hover-lift
        animate-fade-in
      "
      aria-label="Upload file"
    >
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <div
          className="
          w-14 h-14 rounded-full
          flex items-center justify-center
          group-hover:scale-110 transition-transform duration-300
        "
        >
          <Upload className="w-7 h-7 text-primary" strokeWidth={2.5} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
            Upload Files
          </p>
          <p className="text-xs text-muted-foreground">Click to upload</p>
        </div>
      </div>
    </button>
  );
};
