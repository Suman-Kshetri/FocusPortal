import { File } from "lucide-react";

interface FileCardProps {
  name: string;
  size?: number;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export const FileCard = ({
  name,
  size,
  onClick,
  onContextMenu,
}: FileCardProps) => {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className="
        group relative
        p-4 rounded-lg border border-border
        bg-card hover:bg-accent
        cursor-pointer
        transition-all duration-200
        hover:shadow-md
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
          p-2 rounded-lg
          bg-blue-500/10 text-blue-500
          group-hover:bg-blue-500/20
          transition-colors
        "
        >
          <File className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{name}</p>
          {size && (
            <p className="text-sm text-muted-foreground">
              {formatFileSize(size)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
