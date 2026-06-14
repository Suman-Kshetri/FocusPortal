import { useEffect, useState, useRef } from "react";
import NotFound from "@/components/pages/notFound";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster, toast } from "sonner";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: (props: any) => <NotFound {...props} />,
});

function RootComponent() {
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  const toastShownRef = useRef(false);

  useEffect(() => {
    // Check screen width and show toast if needed
    const checkScreenWidth = () => {
      if (window.innerWidth < 700 && !toastShownRef.current) {
        toast.info(
          "💻 This site works better on a larger screen. Please view from a laptop or tablet for the best experience.",
          {
            duration: 5000,
          },
        );
        toastShownRef.current = true;
      }
    };

    // Check on mount
    checkScreenWidth();

    // No need to check on resize since we only show once
    return () => {};
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="min-h-screen">
        <Toaster theme={theme} richColors position="top-right" />
        <Outlet />
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
