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
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "closed":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  }
};