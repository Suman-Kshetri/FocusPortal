import { SettingsPage } from "@/components/pages/SettingPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/settings")({
  component: SettingsPage,
});
