import { IconFolder } from "@tabler/icons-react";

interface FolderCardProps {
  name: string;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export const FolderCard = ({
  name,
  onClick,
  onContextMenu,
}: FolderCardProps) => {
  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className="
        aspect-square w-full 
        bg-card border border-border 
        rounded-xl p-4 
        flex flex-col items-center justify-center gap-3 
        cursor-pointer 
        hover:-translate-y-1 
        hover:shadow-lg 
        hover:border-primary/30
        transition-all duration-300 
        group
        relative
      "
    >
      <IconFolder
        size={80}
        stroke={1.5}
        className="text-muted-foreground group-hover:text-primary transition-colors duration-300"
      />
      <div className="text-sm font-medium text-foreground text-center w-full px-2">
        <p className="truncate">{name}</p>
      </div>
    </div>
  );
};
