import { ChevronRight, Home, Folder, AlertCircle } from "lucide-react";

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (folderId: string | null) => void;
  isLoading?: boolean;
  error?: boolean;
}

export const Breadcrumb = ({
  items,
  onNavigate,
  isLoading,
  error,
}: BreadcrumbProps) => {
  if (error) {
    return (
      <nav className="flex items-center gap-2 p-4 bg-destructive/5 border border-destructive/20 rounded-lg mb-6">
        <AlertCircle className="w-4 h-4 text-destructive" />
        <span className="text-sm text-destructive">
          Failed to load folder path
        </span>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-2 p-4 bg-card border border-border rounded-lg mb-6 shadow-md animate-fade-in">
      {/* Home Button */}
      <button
        onClick={() => onNavigate(null)}
        className="
          flex items-center gap-2 px-3 py-2 rounded-md
          text-sm font-medium text-foreground
          hover:bg-accent hover:text-accent-foreground
          transition-all duration-200
          hover-lift
        "
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className="animate-shimmer h-6 w-32 rounded-md" />
        </div>
      )}

      {/* Breadcrumb Items */}
      {!isLoading &&
        items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <div
              key={item.id || `item-${index}`}
              className="flex items-center gap-2 animate-slide-in-right"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              {isLast ? (
                <div
                  className="
                    flex items-center gap-2 px-3 py-2 rounded-md
                    bg-primary/10 border border-primary/20
                    text-sm font-semibold text-primary
                  "
                >
                  <Folder className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
              ) : (
                <button
                  onClick={() => onNavigate(item.id)}
                  className="
                    flex items-center gap-2 px-3 py-2 rounded-md
                    text-sm font-medium text-muted-foreground
                    hover:bg-accent hover:text-accent-foreground
                    transition-all duration-200
                    hover-lift
                  "
                >
                  <Folder className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              )}
            </div>
          );
        })}
    </nav>
  );
};
