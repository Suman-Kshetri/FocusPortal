import { useState, useEffect } from "react";
import type { Question } from "@/types/questionType";
import { useVoteQuestion } from "@/server/api/questions/voteQuestions";
import { useSocket } from "@/context/socketContext";
import { toast } from "sonner";
import { QuestionHeader } from "./QuestionHeader";
import { QuestionContent } from "./QuestionContent";
import { QuestionStats } from "./QuestionStats";
import { QuestionActions } from "./QuestionActions";
import { CommentSection } from "./comments/CommentSection";

interface QuestionCardProps {
  question: Question;
  currentUserId?: string;
}

export const QuestionCard = ({
  question,
  currentUserId,
}: QuestionCardProps) => {
  const socket = useSocket();
  const {
    onSubmit: voteQuestion,
    onRemove: removeVote,
    isLoading: isVoting,
  } = useVoteQuestion();

  const [upvoted, setUpvoted] = useState(
    currentUserId ? question.upvotedBy?.includes(currentUserId) : false
  );
  const [downvoted, setDownvoted] = useState(
    currentUserId ? question.downvotedBy?.includes(currentUserId) : false
  );
  const [upvotes, setUpvotes] = useState(question.upvotedBy?.length || 0);
  const [downvotes, setDownvotes] = useState(question.downvotedBy?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

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

  return (
    <div className="bg-background border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <QuestionHeader question={question} />
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