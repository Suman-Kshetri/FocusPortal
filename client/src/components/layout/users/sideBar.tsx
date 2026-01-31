import { Home, Settings, User, MessageSquare } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

export const SidebarApp = ({ isOpen }: { isOpen: boolean }) => {
  const { location } = useRouterState();
  const pathname = location.pathname;

  const items = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Q&A", url: "/dashboard/questions", icon: MessageSquare },
    { title: "My Profile", url: "/dashboard/profile", icon: User },
  ];

  const footerItems = [
    { title: "Settings", url: "/dashboard/settings", icon: Settings },
  ];

  const isActive = (url: string) => pathname === url;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen border-r bg-background transition-all duration-300 ${
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {isOpen && <span>{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        <ul className="p-2 border-t">
          {footerItems.map((item) => {
            const active = isActive(item.url);

            return (
              <li key={item.title}>
                <Link
                  to={item.url}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
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
