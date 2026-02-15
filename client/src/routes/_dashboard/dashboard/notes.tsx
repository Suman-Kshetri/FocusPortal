import {NotesPage} from "@/components/pages/notes/NotesPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/notes")({
  component: NotesPage,
});
