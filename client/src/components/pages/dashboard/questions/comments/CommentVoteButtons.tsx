import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useVoteComment } from "@/server/api/comments/useVoteComment";
import { useSocket } from "@/context/socketContext";
import { toast } from "sonner";
import type { Comment } from "@/types/commentType";

interface CommentVoteButtonsProps {
  comment: Comment;
  currentUserId?: string;
}

export const CommentVoteButtons = ({
  comment,
  currentUserId,
}: CommentVoteButtonsProps) => {
  const socket = useSocket();
  const {
    onSubmit: voteComment,
    onRemove: removeVote,
    isLoading,
  } = useVoteComment();
  const initialUpvoted =
    comment.hasUpvoted ??
    (currentUserId ? comment.upvotedBy?.includes(currentUserId) : false);
  const initialDownvoted =
    comment.hasDownvoted ??
    (currentUserId ? comment.downvotedBy?.includes(currentUserId) : false);
  const initialUpvotes = comment.upvotes ?? comment.upvotedBy?.length ?? 0;
  const initialDownvotes =
    comment.downvotes ?? comment.downvotedBy?.length ?? 0;

  const [upvoted, setUpvoted] = useState(initialUpvoted);
  const [downvoted, setDownvoted] = useState(initialDownvoted);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);

  useEffect(() => {
    if (!socket) return;

    const handleCommentVoted = (payload: {
      commentId: string;
      upvotes: number;
      downvotes: number;
      userId?: string;
      action?: string;
    }) => {
      if (payload.commentId !== comment._id) return;

      setUpvotes(payload.upvotes);
      setDownvotes(payload.downvotes);

      if (payload.userId === currentUserId) {
        if (payload.action === "upvote") {
          setUpvoted(true);
          setDownvoted(false);
        } else if (payload.action === "downvote") {
          setUpvoted(false);
          setDownvoted(true);
        } else if (payload.action === "remove") {
          setUpvoted(false);
          setDownvoted(false);
        }
      }
    };

    socket.on("comment:voted", handleCommentVoted);

    return () => {
      socket.off("comment:voted", handleCommentVoted);
    };
  }, [socket, comment._id, currentUserId]);

  const handleUpvote = () => {
    if (!currentUserId) {
      toast.error("Please login to vote");
      return;
    }

    if (upvoted) {
      removeVote(comment._id);
      setUpvotes((prev) => prev - 1);
      setUpvoted(false);
    } else {
      voteComment(comment._id, "upvote");
      setUpvotes((prev) => prev + 1);
      setUpvoted(true);

      if (downvoted) {
        setDownvotes((prev) => prev - 1);
        setDownvoted(false);
      }
    }
  };

  const handleDownvote = () => {
    if (!currentUserId) {
      toast.error("Please login to vote");
      return;
    }

    if (downvoted) {
      removeVote(comment._id);
      setDownvotes((prev) => prev - 1);
      setDownvoted(false);
    } else {
      voteComment(comment._id, "downvote");
      setDownvotes((prev) => prev + 1);
      setDownvoted(true);

      if (upvoted) {
        setUpvotes((prev) => prev - 1);
        setUpvoted(false);
      }
    }
  };

  return (
    <div className="flex items-center gap-2 mt-1 px-4">
      {/* Upvote Button */}
      <button
        onClick={handleUpvote}
        disabled={isLoading}
        className={`
          flex items-center gap-1 px-2 py-1 rounded-md
          text-xs font-medium transition-all
          ${
            upvoted
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        title={upvoted ? "Remove upvote" : "Upvote"}
      >
        <ThumbsUp className={`w-3.5 h-3.5 ${upvoted ? "fill-current" : ""}`} />
        <span>{upvotes}</span>
      </button>

      {/* Downvote Button */}
      <button
        onClick={handleDownvote}
        disabled={isLoading}
        className={`
          flex items-center gap-1 px-2 py-1 rounded-md
          text-xs font-medium transition-all
          ${
            downvoted
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        title={downvoted ? "Remove downvote" : "Downvote"}
      >
        <ThumbsDown
          className={`w-3.5 h-3.5 ${downvoted ? "fill-current" : ""}`}
        />
        <span>{downvotes}</span>
      </button>
    </div>
  );
};
