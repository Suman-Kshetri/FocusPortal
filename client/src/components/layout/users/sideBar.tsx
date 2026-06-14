import {
  Home,
  Settings,
  User,
  MessageSquare,
  CloudUpload,
  Notebook,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

export const SidebarApp = ({ isOpen }: { isOpen: boolean }) => {
  const { location } = useRouterState();
  const pathname = location.pathname;

  const items = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    {
      title: "Notes",
      url: "/dashboard/notes",
      icon: Notebook,
    },
    {
      title: "Resources",
      url: "/dashboard/resources",
      icon: CloudUpload,
    },
    { title: "Q&A", url: "/dashboard/questions", icon: MessageSquare },
    { title: "My Profile", url: "/dashboard/profile", icon: User },
  ];

  const footerItems = [
    { title: "Settings", url: "/dashboard/settings", icon: Settings },
  ];

  const isActive = (url: string) => pathname === url;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="pt-16 flex flex-col h-full">
        <ul className="flex-1 p-2 space-y-1">
          {items.map((item) => {
            const active = isActive(item.url);

            return (
              <li key={item.title}>
                <Link
                  to={item.url}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {isOpen && <span>{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        <ul className="p-2 border-t border-sidebar-border">
          {footerItems.map((item) => {
            const active = isActive(item.url);

            return (
              <li key={item.title}>
                <Link
                  to={item.url}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {isOpen && <span>{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};
