import { AdminLayout } from "@/components/layout/admin/index";
import { Spinner } from "@/components/ui/spinner";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { useSession } from "../server/api/auth/useSessions";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { isPending, error, data:response } = useSession();

  useEffect(() => {
    if (isPending) return;
    if (error || !response?.role) navigate({ to: "/auth/login" });
    if (response?.role === "user") navigate({ to: "/" });
  }, [isPending, response, error]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-dvh">
        <Spinner className="size-12 text-primary" />
      </div>
    );
  }

  return (    
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
