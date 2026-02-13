import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

const GoToHomeButton = () => {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Go back to Home
    </Link>
  );
};

export default GoToHomeButton;
