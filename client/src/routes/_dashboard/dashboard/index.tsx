import { Dashboard } from "@/components/pages/home";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/")({
  component: Dashboard,
});
