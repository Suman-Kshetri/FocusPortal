import { ThumbsUp, ThumbsDown } from "lucide-react";

interface QuestionStatsProps {
  upvotes: number;
  downvotes: number;
  commentCount: number;
}

export const QuestionStats = ({
  upvotes,
  downvotes,
  commentCount,
}: QuestionStatsProps) => {
  return (
    <div className="px-4 py-2 flex items-center justify-between text-xs text-muted-foreground border-t border-b border-border">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <ThumbsUp className="w-3 h-3" />
          {upvotes}
        </span>
        <span className="flex items-center gap-1">
          <ThumbsDown className="w-3 h-3" />
          {downvotes}
        </span>
      </div>
      <span>{commentCount} comments</span>
    </div>
  );
};