import FolderFileDashboard from "@/components/pages/dashboard/FolderFileDashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/resources")({
  component: FolderFileDashboard,
});
