import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import type { Question } from "@/types/questionType";
import { useVoteQuestion } from "@/server/api/questions/voteQuestions";
import { useSocket } from "@/context/socketContext";
import { toast } from "sonner";

interface Comment {
  id: string;
  author: {
    fullName: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
}

interface QuestionCardProps {
  question: Question;
  currentUserId?: string;
}

export const QuestionCard = ({ question, currentUserId }: QuestionCardProps) => {
  const socket = useSocket();
  const { onSubmit: voteQuestion, onRemove: removeVote, isLoading: isVoting } = useVoteQuestion();
  const [upvoted, setUpvoted] = useState(
    currentUserId ? question.upvotedBy?.includes(currentUserId) : false
  );
  const [downvoted, setDownvoted] = useState(
    currentUserId ? question.downvotedBy?.includes(currentUserId) : false
  );
  const [upvotes, setUpvotes] = useState(question.upvotedBy?.length || 0);
  const [downvotes, setDownvotes] = useState(question.downvotedBy?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleVoteUpdate = (payload: {
      questionId: string;
      upvotes: number;
      downvotes: number;
      userId?: string;
      action?: string;
    }) => {
      if (payload.questionId === question._id) {
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
      }
    };

    socket.on("question:voted", handleVoteUpdate);

    return () => {
      socket.off("question:voted", handleVoteUpdate);
    };
  }, [socket, question._id, currentUserId]);

  const handleUpvote = () => {
    if (!currentUserId) {
      toast.error("Please login to vote");
      return;
    }

    if (upvoted) {
      // Remove upvote
      removeVote(question._id);
      setUpvotes((prev) => prev - 1);
      setUpvoted(false);
    } else {
      // Add upvote
      voteQuestion(question._id, "upvote");
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
      // Remove downvote
      removeVote(question._id);
      setDownvotes((prev) => prev - 1);
      setDownvoted(false);
    } else {
      // Add downvote
      voteQuestion(question._id, "downvote");
      setDownvotes((prev) => prev + 1);
      setDownvoted(true);

      if (upvoted) {
        setUpvotes((prev) => prev - 1);
        setUpvoted(false);
      }
    }
  };

  const handleComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: { fullName: "You" },
        content: commentText,
        createdAt: "Just now",
        likes: 0,
      };
      setComments([newComment, ...comments]);
      setCommentText("");
    }
  };

  const getTimeAgo = (dateString: string) => {
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

  const getStatusColor = () => {
    switch (question.status) {
      case "answered":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "closed":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  return (
    <div className="bg-background border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
          <img
            src={question.author?.avatar}
            alt={question.author?.fullName || "User avatar"}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-sm">
            {question.author?.fullName || "Anonymous"}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <span>{getTimeAgo(question.createdAt)}</span>
            <span>•</span>
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
              {question.category}
            </span>
            {question.status !== "open" && (
              <>
                <span>•</span>
                <span
                  className={`px-2 py-0.5 rounded-full border text-xs font-medium ${getStatusColor()}`}
                >
                  {question.status === "answered" && (
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                  )}
                  {question.status.charAt(0).toUpperCase() +
                    question.status.slice(1)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-3">
        <h2 className="text-lg font-bold mb-2">{question.title}</h2>
        <p className="text-muted-foreground text-sm whitespace-pre-wrap">
          {question.content}
        </p>

        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {question.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2.5 py-1 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {question.images && question.images.length > 0 && (
          <div
            className={`mt-4 grid gap-2 ${
              question.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {question.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Question image ${index + 1}`}
                className="w-full rounded-lg object-cover max-h-96"
              />
            ))}
          </div>
        )}
      </div>

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
        <span>{comments.length} comments</span>
      </div>

      <div className="px-2 py-1 flex items-center justify-around">
        <button
          onClick={handleUpvote}
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
          onClick={handleDownvote}
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
          onClick={() => setShowComments(!showComments)}
          className="
            flex items-center gap-2 px-4 py-2 rounded-lg
            hover:bg-accent transition-colors flex-1
            text-muted-foreground
          "
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm">Comment</span>
        </button>

        <button
          className="
            flex items-center gap-2 px-4 py-2 rounded-lg
            hover:bg-accent transition-colors flex-1
            text-muted-foreground
          "
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm">Share</span>
        </button>
      </div>

      {showComments && (
        <div className="border-t border-border">
          <div className="p-4 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary text-sm">
              Y
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && handleComment()}
                placeholder="Write a comment..."
                className="
                  flex-1 px-4 py-2
                  bg-secondary rounded-full
                  text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary
                "
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="
                  px-4 py-2 bg-primary text-primary-foreground
                  rounded-full text-sm font-semibold
                  hover:bg-primary/90
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all
                "
              >
                Post
              </button>
            </div>
          </div>

          {comments.length > 0 && (
            <div className="px-4 pb-4 space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-semibold text-sm">
                    {comment.author.fullName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="bg-secondary rounded-2xl px-4 py-2">
                      <h4 className="font-semibold text-sm">
                        {comment.author.fullName}
                      </h4>
                      <p className="text-sm mt-0.5">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-1 px-4 text-xs text-muted-foreground">
                      <button className="hover:underline font-semibold">
                        Like
                      </button>
                      <button className="hover:underline">Reply</button>
                      <span>{comment.createdAt}</span>
                      {comment.likes > 0 && (
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> {comment.likes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};