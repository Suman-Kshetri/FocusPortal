import { SidebarApp } from "./sideBar";
import { Navbar } from "./navBar";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: Props) {
    const [isOpen, setIsOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home");

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle("dark");
    
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };
    return(
        <div className="min-h-screen bg-background">
      <Navbar
        selectedItem={selectedItem}
        onToggleSidebar={() => setIsOpen(!isOpen)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      <SidebarApp
        isOpen={isOpen}
        selectedItem={selectedItem}
        onSelectItem={setSelectedItem}
      />

      <main
        className={`mt-16 p-8 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-16"
        }`}
      >
        {children}
      </main>
    </div>
    )
}