interface FolderCreationUIProps {
  onClick?: () => void;
}

export const FolderCreationUI = ({ onClick }: FolderCreationUIProps) => {
  return (
    <div className="group relative" onClick={onClick}>
      <div
        className="
          aspect-square w-full
          bg-card/50
          border-2 border-dashed border-border
          rounded-xl
          flex flex-col items-center justify-center gap-3
          cursor-pointer
          transition-all duration-300
          hover:bg-card/80
          hover:border-primary/50
          hover:-translate-y-1
          hover:shadow-lg
        "
      >
        <div className="text-6xl font-light text-muted-foreground group-hover:text-primary transition-colors duration-300">
          +
        </div>
        <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          Create Folder
        </div>
      </div>
    </div>
  );
};
