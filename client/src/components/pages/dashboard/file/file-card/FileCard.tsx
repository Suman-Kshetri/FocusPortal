// components/file/FileCard.tsx
import {
  File,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  FileCode,
} from "lucide-react";

interface FileCardProps {
  id: string;
  name: string;
  type: "pdf" | "docx" | "xlsx" | "md" | "image" | "txt";
  size?: number;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export const FileCard = ({
  name,
  type,
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

  const getFileIcon = () => {
    switch (type) {
      case "pdf":
        return {
          icon: File,
          color: "text-red-500",
          bg: "bg-red-500/10",
          hoverBg: "group-hover:bg-red-500/20",
        };
      case "docx":
        return {
          icon: FileText,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          hoverBg: "group-hover:bg-blue-500/20",
        };
      case "xlsx":
        return {
          icon: FileSpreadsheet,
          color: "text-green-500",
          bg: "bg-green-500/10",
          hoverBg: "group-hover:bg-green-500/20",
        };
      case "md":
      case "txt":
        return {
          icon: FileCode,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
          hoverBg: "group-hover:bg-purple-500/20",
        };
      case "image":
        return {
          icon: ImageIcon,
          color: "text-pink-500",
          bg: "bg-pink-500/10",
          hoverBg: "group-hover:bg-pink-500/20",
        };
      default:
        return {
          icon: File,
          color: "text-gray-500",
          bg: "bg-gray-500/10",
          hoverBg: "group-hover:bg-gray-500/20",
        };
    }
  };

  const fileIcon = getFileIcon();
  const Icon = fileIcon.icon;

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className="
        group relative aspect-square
        p-4 rounded-xl border border-border
        bg-card hover:bg-accent
        cursor-pointer
        transition-all duration-200
        hover:shadow-lg hover-lift
        animate-fade-in
      "
    >
      <div className="flex flex-col items-center justify-center h-full gap-3">
        {/* File Icon */}
        <div
          className={`
            p-4 rounded-xl
            ${fileIcon.bg} ${fileIcon.color}
            ${fileIcon.hoverBg}
            transition-all duration-200
            group-hover:scale-110
          `}
        >
          <Icon className="w-8 h-8" strokeWidth={2} />
        </div>

        {/* File Info */}
        <div className="text-center w-full">
          <p className="font-medium text-foreground truncate px-2" title={name}>
            {name}
          </p>
          {size && (
            <p className="text-xs text-muted-foreground mt-1">
              {formatFileSize(size)}
            </p>
          )}
          <p className="text-xs text-muted-foreground uppercase mt-0.5">
            {type}
          </p>
        </div>
      </div>
    </div>
  );
};
