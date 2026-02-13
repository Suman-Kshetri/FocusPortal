interface FolderDialogBoxProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onOpen?: () => void;
  onRename?: () => void;
  onEdit?: () => void;
  onCopy?: () => void;
  onMove?: () => void;
  onDelete?: () => void;
}

export const FolderDialogBox = ({
  isOpen,
  position,
  onClose,
  onOpen,
  onRename,
  onMove,
  onDelete,
}: FolderDialogBoxProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div
          className="
            absolute
            w-56 
            bg-card 
            border border-border 
            rounded-lg 
            shadow-xl 
            overflow-hidden
            pointer-events-auto
            animate-scale-in
          "
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          <div className="py-1">
            <div
              onClick={() => {
                onOpen?.();
                onClose();
              }}
              className="
                px-4 py-2.5 
                flex items-center gap-3
                text-sm font-medium text-foreground
                hover:bg-accent hover:text-accent-foreground
                cursor-pointer
                transition-colors duration-150
              "
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              <span>Open</span>
            </div>

            <div
              onClick={() => {
                onRename?.();
                onClose();
              }}
              className="
                px-4 py-2.5 
                flex items-center gap-3
                text-sm font-medium text-foreground
                hover:bg-accent hover:text-accent-foreground
                cursor-pointer
                transition-colors duration-150
              "
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>Rename</span>
            </div>
            <div className="my-1 h-px bg-border"></div>
            {/* <div
              onClick={() => {
                onCopy?.();
                onClose();
              }}
              className="
                px-4 py-2.5 
                flex items-center gap-3
                text-sm font-medium text-foreground
                hover:bg-accent hover:text-accent-foreground
                cursor-pointer
                transition-colors duration-150
              "
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy</span>
            </div> */}

            <div
              onClick={() => {
                onMove?.();
                onClose();
              }}
              className="
                px-4 py-2.5 
                flex items-center gap-3
                text-sm font-medium text-foreground
                hover:bg-accent hover:text-accent-foreground
                cursor-pointer
                transition-colors duration-150
              "
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
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <span>Move</span>
            </div>

            <div className="my-1 h-px bg-border"></div>

            <div
              onClick={() => {
                onDelete?.();
                onClose();
              }}
              className="
                px-4 py-2.5 
                flex items-center gap-3
                text-sm font-medium text-destructive
                hover:bg-destructive/10 hover:text-destructive
                cursor-pointer
                transition-colors duration-150
              "
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
              <span>Delete</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
