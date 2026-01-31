import { Navbar } from "./navBar";
import { SidebarApp } from "./sideBar";
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

type Props = {
  children: React.ReactNode;
};

export function UserLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const { location } = useRouterState();
  const pathname = location.pathname;

  const routeTitleMap: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/questions": "Q&A",
    "/dashboard/profile": "My Profile",
    "/dashboard/settings": "Settings",
  };

  const title = routeTitleMap[pathname] ?? "Dashboard";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        title={title}
        onToggleSidebar={() => setIsOpen(!isOpen)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      <SidebarApp isOpen={isOpen} />

      <main
        className={`pt-20 p-8 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-16"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
