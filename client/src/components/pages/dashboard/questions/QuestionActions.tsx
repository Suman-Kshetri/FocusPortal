import { ThumbsUp, ThumbsDown, MessageSquare} from "lucide-react";

interface QuestionActionsProps {
  upvoted: boolean;
  downvoted: boolean;
  isVoting: boolean;
  onUpvote: () => void;
  onDownvote: () => void;
  onToggleComments: () => void;
}

export const QuestionActions = ({
  upvoted,
  downvoted,
  isVoting,
  onUpvote,
  onDownvote,
  onToggleComments,
}: QuestionActionsProps) => {
  return (
    <div className="px-2 py-1 flex items-center justify-around">
      <button
        onClick={onUpvote}
        disabled={isVoting}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          hover:bg-accent transition-colors flex-1
          disabled:opacity-50 disabled:cursor-not-allowed
          ${upvoted ? "text-primary font-semibold" : "text-muted-foreground"}
        `}
      >
        <ThumbsUp
          className="w-4 h-4"
          fill={upvoted ? "currentColor" : "none"}
        />
        <span className="text-sm">Upvote</span>
      </button>

      <button
        onClick={onDownvote}
        disabled={isVoting}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          hover:bg-accent transition-colors flex-1
          disabled:opacity-50 disabled:cursor-not-allowed
          ${downvoted ? "text-destructive font-semibold" : "text-muted-foreground"}
        `}
      >
        <ThumbsDown
          className="w-4 h-4"
          fill={downvoted ? "currentColor" : "none"}
        />
        <span className="text-sm">Downvote</span>
      </button>

      <button
        onClick={onToggleComments}
        className="
          flex items-center gap-2 px-4 py-2 rounded-lg
          hover:bg-accent transition-colors flex-1
          text-muted-foreground
        "
      >
        <MessageSquare className="w-4 h-4" />
        <span className="text-sm">Comment</span>
      </button>
    </div>
  );
};
