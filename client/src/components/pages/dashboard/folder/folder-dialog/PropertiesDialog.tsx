interface PropertiesDialogProps {
  onClose: () => void;
}

const PropertiesDialog = ({ onClose }: PropertiesDialogProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4 animate-scale-in">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="text-4xl">📁</div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Folder Properties
              </h2>
              <p className="text-sm text-muted-foreground">Documents</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              General
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Type:</span>
                <span className="text-sm font-medium text-foreground">
                  Folder
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Location:</span>
                <span className="text-sm font-medium text-foreground">
                  /Home
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Size:</span>
                <span className="text-sm font-medium text-foreground">
                  24.5 MB
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Items:</span>
                <span className="text-sm font-medium text-foreground">
                  42 files, 8 folders
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-border"></div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Dates
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="text-sm font-medium text-foreground">
                  Jan 15, 2025
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Modified:</span>
                <span className="text-sm font-medium text-foreground">
                  Feb 11, 2025
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Accessed:</span>
                <span className="text-sm font-medium text-foreground">
                  Feb 11, 2025
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-muted/30 rounded-b-xl flex items-center justify-end">
          <button
            onClick={onClose}
            className="
              px-4 py-2
              text-sm font-medium text-primary-foreground
              bg-primary hover:bg-primary/90
              rounded-lg
              transition-colors duration-200
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesDialog;
