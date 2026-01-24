import { Home, Inbox, Calendar, Search, Settings } from "lucide-react";

export const SidebarApp = ({ isOpen, selectedItem, onSelectItem }:any) => {
  const items = [
    { title: "Home", url: "#", icon: Home },
    { title: "Inbox", url: "#", icon: Inbox },
    { title: "Calendar", url: "#", icon: Calendar },
    { title: "Search", url: "#", icon: Search },
    { title: "Settings", url: "#", icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-[calc(100vh)] bg-background border-r border-sidebar-border transition-[width,opacity] duration-300 ease-in-out ${
        isOpen ? "w-50" : "w-16"
      }`}
      aria-label="Sidebar"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className=" border-b border-sidebar-border flex items-center justify-between min-h-15">
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isOpen ? "w-full opacity-100" : "w-0 opacity-0"
            }`}
          >
            <div className="px-3 py-2">
              <span className="text-sm font-medium text-sidebar-foreground">
                Focus Portal
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li key={index}>
                <a
                  href={item.url}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectItem(item.title);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedItem === item.title
                      ? "bg-sidebar-accent/30 text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-ring/40 hover:text-sidebar-accent-foreground"
                  }`}
                  title={item.title}
                >
                  {item.icon && (
                    <item.icon
                      className={`w-5 h-5 shrink-0 ${
                        selectedItem === item.title
                          ? "text-sidebar-primary"
                          : "text-sidebar-foreground/50"
                      }`}
                    />
                  )}
                  <span
                    className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${
                      isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
                    }`}
                  >
                    {item.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};