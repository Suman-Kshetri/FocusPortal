import FolderFile from "@/components/pages/dashboard/FolderFile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/resources")({
  component: FolderFile,
});
