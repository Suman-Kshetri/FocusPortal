import { Home, Settings, User } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

export const SidebarApp = ({ isOpen }: { isOpen: boolean }) => {
  const { location } = useRouterState();

  const pathname = location.pathname;

  const items = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "My Profile", url: "/dashboard/profile", icon: User },
  ];

  const footerItems = [
    { title: "Setting", url: "/dashboard/settings", icon: Settings },
  ];

  const isActive = (itemUrl: string) => pathname === itemUrl;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-background border-r border-sidebar-border transition-[width,opacity] duration-300 ${
        isOpen ? "w-50" : "w-16"
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="border-b border-sidebar-border min-h-15 flex items-center" />

        <div className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {items.map((item) => {
              const active = isActive(item.url);

              return (
                <li key={item.title}>
                  <Link
                    to={item.url}
                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      active
                        ? "bg-sidebar-accent/30 text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-ring/50"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        active
                          ? "text-sidebar-primary"
                          : "text-sidebar-foreground/50"
                      }`}
                    />
                    <span
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
                      }`}
                    >
                      {item.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-2 border-t border-sidebar-border">
          <ul className="space-y-1">
            {footerItems.map((item) => {
              const active = isActive(item.url);

              return (
                <li key={item.title}>
                  <Link
                    to={item.url}
                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      active
                        ? "bg-sidebar-accent/30 text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-ring/40"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        active
                          ? "text-sidebar-primary"
                          : "text-sidebar-foreground/50"
                      }`}
                    />
                    <span
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
                      }`}
                    >
                      {item.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
};
