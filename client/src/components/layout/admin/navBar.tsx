
import {
  LayoutDashboard,
  Settings,
  LogOut,
  PanelLeft,
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  selectedItem: string;
  onToggleSidebar: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar = ({
  selectedItem,
  onToggleSidebar,
  isDarkMode,
  onToggleTheme,
}: NavbarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full bg-background border-b border-border">
      <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between">

          {/* Left Section */}
          <div className="flex items-center gap-3 sm:gap-6 md:gap-10 min-w-0">
            <h1 className="text-sm sm:text-base font-semibold text-foreground truncate">
              Focus Portal
            </h1>

            <div className="flex items-center gap-3 sm:gap-6">
              <button
                onClick={onToggleSidebar}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0"
                aria-label="Toggle Sidebar"
              >
                <PanelLeft className="w-4 sm:w-5 h-4 sm:h-5 text-foreground" />
              </button>

              <h2 className="text-xs sm:text-sm font-semibold text-foreground truncate hidden sm:block">
                {selectedItem}
              </h2>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2">

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 sm:w-5 h-4 sm:h-5 text-foreground" />
              ) : (
                <Moon className="w-4 sm:w-5 h-4 sm:h-5 text-foreground" />
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 sm:gap-2 p-0.5 sm:p-1 rounded-lg hover:bg-accent transition-colors flex-shrink-0"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-label="Open profile menu"
              >
                <img
                  className="w-6 sm:w-8 h-6 sm:h-8 rounded-full ring-2 ring-border"
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="User profile"
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-12 z-50 bg-popover border border-border rounded-lg shadow-lg w-56">

                  {/* User Information */}
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-popover-foreground">
                      Neil Sims
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      neil.sims@flowbite.com
                    </p>
                  </div>

                  {/* Menu Items */}
                  <ul className="p-2 text-sm">
                    <li>
                      <a
                        href="#"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-popover-foreground hover:bg-accent rounded transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-popover-foreground hover:bg-accent rounded transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </a>
                    </li>

                    <li className="border-t border-border mt-2 pt-2">
                      <button
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
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
