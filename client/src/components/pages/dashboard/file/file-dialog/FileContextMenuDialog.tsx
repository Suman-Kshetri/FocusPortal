import {
  MoreVertical,
  Eye,
  Edit,
  Download,
  Trash2,
  FolderInput,
} from "lucide-react";
import { useEffect, useRef } from "react";

interface FileDialogBoxProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onView: () => void;
  onEdit?: () => void;
  onDownload: () => void;
  onMove: () => void;
  onRename: () => void;
  onDelete: () => void;
  editable?: boolean;
}

export const FileDialogBox = ({
  isOpen,
  position,
  onClose,
  onView,
  onEdit,
  onDownload,
  onMove,
  onRename,
  onDelete,
  editable = false,
}: FileDialogBoxProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { label: "View", icon: Eye, onClick: onView, show: true },
    { label: "Edit", icon: Edit, onClick: onEdit, show: editable },
    { label: "Download", icon: Download, onClick: onDownload, show: true },
    { label: "Move", icon: FolderInput, onClick: onMove, show: true },
    { label: "Rename", icon: Edit, onClick: onRename, show: true },
    {
      label: "Delete",
      icon: Trash2,
      onClick: onDelete,
      show: true,
      danger: true,
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-card border border-border rounded-lg shadow-xl py-1 min-w-[160px] animate-scale-in"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      {menuItems.map(
        (item, index) =>
          item.show && (
            <button
              key={index}
              onClick={() => {
                item.onClick?.();
                onClose();
              }}
              className={`
                w-full px-4 py-2 text-left text-sm
                flex items-center gap-3
                hover:bg-accent
                transition-colors
                ${item.danger ? "text-red-600 hover:text-red-700" : "text-foreground"}
              `}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ),
      )}
    </div>
  );
};
