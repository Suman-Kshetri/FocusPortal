import { useLogout } from "@/server/api/auth/useLogout";
import { useGetUserProfile } from "@/server/api/users/usegetUserProfile";
import {
  PanelLeft,
  Sun,
  Moon,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

type NavbarProps = {
  title: string;
  onToggleSidebar: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
};

export const Navbar = ({
  title,
  onToggleSidebar,
  isDarkMode,
  onToggleTheme,
}: NavbarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { logout, isLoading } = useLogout();
  const { userData: user } = useGetUserProfile();

  const handleLogout = () => {
    if (!isLoading) {
      setIsDropdownOpen(false);
      logout();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="fixed top-0 z-50 w-full bg-background border-b border-border">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-semibold">Focus Portal</h1>

          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-accent"
          >
            <PanelLeft className="w-5 h-5" />
          </button>

          <h2 className="text-md font-semibold">{title}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg hover:bg-accent"
          >
            {isDarkMode ? <Sun /> : <Moon />}
          </button>

          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-1 rounded-lg hover:bg-accent"
              >
                <img
                  src={user.data.avatar}
                  alt={user.data.fullName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-popover border rounded-lg shadow-lg">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium">{user.data.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.data.email}
                    </p>
                  </div>

                  <ul className="p-2 text-sm">
                    <li>
                      <Link
                        to="/dashboard"
                        className="flex gap-2 px-3 py-2 rounded hover:bg-accent"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/dashboard/settings"
                        className="flex gap-2 px-3 py-2 rounded hover:bg-accent"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </li>

                    <li className="border-t mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="flex gap-2 px-3 py-2 w-full text-destructive hover:bg-destructive/10 rounded"
                      >
                        <LogOut className="w-4 h-4" />
                        {isLoading ? "Signing out..." : "Sign out"}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
