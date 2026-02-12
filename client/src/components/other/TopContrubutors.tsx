import { Award } from "lucide-react";

interface Contributor {
  _id: string;
  fullName: string;
  points: number;
  avatar?: string;
}

interface TopContributorsProps {
  contributors: Contributor[];
  isLoading?: boolean;
  maxDisplay?: number;
  currentUserId?: string;
}

export const TopContributors = ({
  contributors,
  isLoading = false,
  maxDisplay = 5,
  currentUserId,
}: TopContributorsProps) => {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl shadow-lg p-6 space-y-4 shrink grow">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground text-lg">
            Top Contributors
          </h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
              <div className="w-6 h-6 bg-muted animate-pulse rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!contributors || contributors.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl shadow-lg p-6 text-center">
        <Award className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No contributors yet</p>
      </div>
    );
  }

  const getMedalEmoji = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "⭐";
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-lg p-6 space-y-4 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground text-lg">
          Top Contributors
        </h3>
      </div>

      <div className="space-y-3">
        {contributors.slice(0, maxDisplay).map((contributor, idx) => {
          const isCurrentUser = currentUserId === contributor._id;

          return (
            <div
              key={contributor._id}
              className={`
                flex items-center gap-3 p-3 rounded-xl 
                transition-all duration-200 cursor-pointer
                hover:bg-accent
                ${isCurrentUser ? "bg-primary/10 border border-primary/20" : ""}
              `}
            >
              <span className="text-xl flex-shrink-0">
                {getMedalEmoji(idx)}
              </span>

              {contributor.avatar && (
                <img
                  src={contributor.avatar}
                  alt={contributor.fullName}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              )}

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    isCurrentUser ? "text-primary" : ""
                  }`}
                >
                  {contributor.fullName}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs text-primary">(You)</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {contributor.points} pts
                </p>
              </div>

              <div className="flex-shrink-0 text-sm font-semibold text-muted-foreground">
                #{idx + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
