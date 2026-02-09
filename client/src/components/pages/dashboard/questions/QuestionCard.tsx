import { useState, useEffect, useRef } from "react";
import type { Question } from "@/types/questionType";
import { useVoteQuestion } from "@/server/api/questions/voteQuestions";
import { useSocket } from "@/context/socketContext";
import { toast } from "sonner";
import { QuestionHeader } from "./QuestionHeader";
import { QuestionContent } from "./QuestionContent";
import { QuestionStats } from "./QuestionStats";
import { QuestionActions } from "./QuestionActions";
import { CommentSection } from "./comments/CommentSection";
import { MoreVertical, Edit, Trash2 } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  currentUserId?: string;
  onEdit?: (question: Question) => void;
  onDelete?: (questionId: string) => void;
}

export const QuestionCard = ({
  question,
  currentUserId,
  onEdit,
  onDelete,
}: QuestionCardProps) => {
  const socket = useSocket();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    onSubmit: voteQuestion,
    onRemove: removeVote,
    isLoading: isVoting,
  } = useVoteQuestion();

  const [upvoted, setUpvoted] = useState(
    currentUserId ? question.upvotedBy?.includes(currentUserId) : false,
  );
  const [downvoted, setDownvoted] = useState(
    currentUserId ? question.downvotedBy?.includes(currentUserId) : false,
  );
  const [upvotes, setUpvotes] = useState(question.upvotedBy?.length || 0);
  const [downvotes, setDownvotes] = useState(question.downvotedBy?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(question.commentCount ?? 0);
  const [showDropdown, setShowDropdown] = useState(false);

  const isAuthor = currentUserId && question.author?._id === currentUserId;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

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

  useEffect(() => {
    if (!socket) return;

    const handleCommentCreated = (payload: { questionId: string }) => {
      if (payload.questionId === question._id) {
        setCommentCount((prev) => prev + 1);
      }
    };

    const handleCommentDeleted = (payload: { questionId: string }) => {
      if (payload.questionId === question._id) {
        setCommentCount((prev) => Math.max(0, prev - 1));
      }
    };

    socket.on("comment:created", handleCommentCreated);
    socket.on("comment:deleted", handleCommentDeleted);

    return () => {
      socket.off("comment:created", handleCommentCreated);
      socket.off("comment:deleted", handleCommentDeleted);
    };
  }, [socket, question._id]);

  const handleUpvote = () => {
    if (!currentUserId) {
      toast.error("Please login to vote");
      return;
    }

    if (upvoted) {
      removeVote(question._id);
      setUpvotes((prev) => prev - 1);
      setUpvoted(false);
    } else {
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
      removeVote(question._id);
      setDownvotes((prev) => prev - 1);
      setDownvoted(false);
    } else {
      voteQuestion(question._id, "downvote");
      setDownvotes((prev) => prev + 1);
      setDownvoted(true);

      if (upvoted) {
        setUpvotes((prev) => prev - 1);
        setUpvoted(false);
      }
    }
  };

  const handleEdit = () => {
    setShowDropdown(false);
    if (onEdit) {
      onEdit(question);
    }
  };

  const handleDelete = () => {
    setShowDropdown(false);
    if (onDelete) {
      onDelete(question._id);
    }
  };

  return (
    <div className="bg-background border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <QuestionHeader question={question} />

        {/* Action Menu - Only show to author */}
        {isAuthor && onEdit && onDelete && (
          <div className="absolute top-4 right-4" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-1 z-10">
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Question
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Question
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <QuestionContent question={question} />
      <QuestionStats
        upvotes={upvotes}
        downvotes={downvotes}
        commentCount={commentCount}
      />
      <QuestionActions
        upvoted={upvoted}
        downvoted={downvoted}
        isVoting={isVoting}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
        onToggleComments={() => setShowComments(!showComments)}
      />
      <CommentSection
        questionId={question._id}
        currentUserId={currentUserId}
        showComments={showComments}
      />
    </div>
  );
};
