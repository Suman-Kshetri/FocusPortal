import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (folderId: string | null) => void;
}

export const Breadcrumb = ({ items, onNavigate }: BreadcrumbProps) => {
  return (
    <div className="flex items-center gap-2 p-4 bg-card border border-border rounded-lg mb-4">
      <button
        onClick={() => onNavigate(null)}
        className="
          flex items-center gap-2 px-3 py-1.5 rounded-md
          hover:bg-accent transition-colors
          text-sm font-medium
        "
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>

      {items.map((item, index) => (
        <div key={item.id || "root"} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <button
            onClick={() => onNavigate(item.id)}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium
              transition-colors
              ${
                index === items.length - 1
                  ? "text-foreground bg-accent"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }
            `}
          >
            {item.name}
          </button>
        </div>
      ))}
    </div>
  );
};
