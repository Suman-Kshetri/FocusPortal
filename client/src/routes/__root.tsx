import NotFound from "@/components/pages/notFound";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: (props: any) => <NotFound {...props} />,
});

function RootComponent() {
  return (
    <>
      <div className="min-h-screen">
        <Toaster richColors position="top-right" />
        <Outlet />
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
