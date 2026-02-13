import LandingPage from "@/components/pages/LandingPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return <LandingPage />;
}
