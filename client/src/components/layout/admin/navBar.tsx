import { PanelLeft, Sun, Moon, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { useState } from "react";

export const Navbar = ({ selectedItem, onToggleSidebar, isDarkMode, onToggleTheme }:any) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full bg-background border-b border-border\">\n      <div className=\"px-3 sm:px-4 md:px-6 py-2.5 sm:py-3\">\n        <div className=\"flex items-center justify-between\">\n        \n          <div className=\"flex items-center gap-3 sm:gap-6 md:gap-10 min-w-0\">\n            <h1 className=\"text-sm sm:text-base font-semibold text-foreground truncate\">Focus Portal</h1>\n            <div className=\"flex items-center gap-3 sm:gap-6\">\n            <button\n              onClick={onToggleSidebar}\n              className=\"p-1.5 sm:p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0\"\n              aria-label=\"Toggle Sidebar\"\n            >\n              <PanelLeft className=\"w-4 sm:w-5 h-4 sm:h-5 text-foreground\" />\n            </button>\n            <h1 className=\"text-xs sm:text-sm font-semibold text-foreground truncate hidden sm:block\">\n              {selectedItem}\n            </h1>\n            </div>\n          </div>\n\n          <div className=\"flex items-center gap-1 sm:gap-2\">\n            <button\n              onClick={onToggleTheme}\n              className=\"p-1.5 sm:p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0\"\n              aria-label=\"Toggle theme\"\n            >\n              {isDarkMode ? (\n                <Sun className=\"w-4 sm:w-5 h-4 sm:h-5 text-foreground\" />\n              ) : (\n                <Moon className=\"w-4 sm:w-5 h-4 sm:h-5 text-foreground\" />\n              )}\n            </button>\n\n            <div className=\"relative\">\n              <button\n                onClick={() => setIsDropdownOpen(!isDropdownOpen)}\n                className=\"flex items-center gap-1 sm:gap-2 p-0.5 sm:p-1 rounded-lg hover:bg-accent transition-colors flex-shrink-0\"\n                aria-expanded={isDropdownOpen}\n              >\n                <img\n                  className=\"w-6 sm:w-8 h-6 sm:h-8 rounded-full ring-2 ring-border\"\n                  src=\"https://flowbite.com/docs/images/people/profile-picture-5.jpg\"\n                  alt=\"user photo\""
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
                      <a
                        href="#"
                        className="flex items-center gap-2 w-full px-3 py-2 text-popover-foreground hover:bg-accent rounded transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center gap-2 w-full px-3 py-2 text-popover-foreground hover:bg-accent rounded transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </a>
                    </li>
                    <li className="border-t border-border mt-2 pt-2">
                      <a
                        href="#"
                        className="flex items-center gap-2 w-full px-3 py-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </a>
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
