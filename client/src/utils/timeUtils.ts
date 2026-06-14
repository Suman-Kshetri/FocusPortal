export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

export const getStatusColor = (
  status: "open" | "closed" | "answered"
): string => {
  switch (status) {
    case "answered":
      return "bg-chart-3/10 text-chart-3 border-chart-3/20";
    case "closed":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
};