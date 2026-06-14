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
    <nav className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 min-w-0">
          <h1 className="text-sm sm:text-base font-semibold truncate">Focus Portal</h1>

          <button
            onClick={onToggleSidebar}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-accent flex-shrink-0"
          >
            <PanelLeft className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>

          <h2 className="text-xs sm:text-sm font-semibold truncate hidden sm:block">{title}</h2>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-accent shrink-0"
              >
                <img
                  src={user.data.avatar}
                  alt={user.data.fullName}
                  className="w-6 sm:w-8 h-6 sm:h-8 rounded-full object-cover"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-popover border rounded-lg shadow-lg">
                  <div className="px-3 sm:px-4 py-2 sm:py-3 border-b">
                    <p className="text-xs sm:text-sm font-medium">{user.data.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.data.email}
                    </p>
                  </div>

                  <ul className="p-1 sm:p-2 text-xs sm:text-sm">
                    <li>
                      <Link
                        to="/dashboard"
                        className="flex gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded hover:bg-accent text-xs sm:text-sm"
                      >
                        <LayoutDashboard className="w-4 h-4 shrink-0" />
                        <span>Dashboard</span>
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/dashboard/settings"
                        className="flex gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded hover:bg-accent text-xs sm:text-sm"
                      >
                        <Settings className="w-4 h-4 shrink-0" />
                        <span>Settings</span>
                      </Link>
                    </li>

                    <li className="border-t mt-1 sm:mt-2 pt-1 sm:pt-2">
                      <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="flex gap-2 px-2 sm:px-3 py-1.5 sm:py-2 w-full text-destructive hover:bg-destructive/10 rounded text-xs sm:text-sm"
                      >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span>{isLoading ? "Signing out..." : "Sign out"}</span>
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
