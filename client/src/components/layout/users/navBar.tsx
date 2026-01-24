import { useLogout } from "@/server/api/auth/useLogout";
import { Link } from "@tanstack/react-router";
import {
  PanelLeft,
  Sun,
  Moon,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";
import { useState } from "react";

export const Navbar = ({
  selectedItem,
  onToggleSidebar,
  isDarkMode,
  onToggleTheme,
}: any) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout, isLoading } = useLogout();
  const handleLogout = () => {
    if (!isLoading) { 
    setIsDropdownOpen(false);
    logout();
  }
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-background border-b border-border">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-10">
            <h1 className="text-lg font-semibold text-foreground">
              Focus Portal
            </h1>
            <div className="flex items-center gap-20">
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Toggle Sidebar"
              >
                <PanelLeft className="w-5 h-5 text-foreground" />
              </button>
              <h1 className="text-md font-semibold text-foreground">
                {selectedItem}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-accent transition-colors"
                aria-expanded={isDropdownOpen}
              >
                <img
                  className="w-8 h-8 rounded-full ring-2 ring-border"
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="user photo"
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-12 z-50 bg-popover border border-border rounded-lg shadow-lg w-56">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-popover-foreground">
                      Neil Sims
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      neil.sims@flowbite.com
                    </p>
                  </div>
                  <ul className="p-2 text-sm">
                    <li>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 w-full px-3 py-2 text-popover-foreground hover:bg-accent rounded transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 w-full px-3 py-2 text-popover-foreground hover:bg-accent rounded transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </li>
                    <li className="border-t border-border mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="flex items-center gap-2 w-full px-3 py-2 text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        {isLoading ? "Signing out..." : "Sign out"}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
