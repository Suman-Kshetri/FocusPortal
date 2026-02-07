import { useState, useEffect } from "react";
import type { Comment } from "@/types/commentType";
import { useCreateComment } from "@/server/api/comments/useCreateComment";
import { useGetComments } from "@/server/api/comments/useGetComment";
import { useUpdateComment } from "@/server/api/comments/useUpdateComment";
import { useDeleteComment } from "@/server/api/comments/useDeleteComment";
import { useSocket } from "@/context/socketContext";
import { toast } from "sonner";
import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";

interface CommentSectionProps {
  questionId: string;
  currentUserId?: string;
  showComments: boolean;
}

export const CommentSection = ({
  questionId,
  currentUserId,
  showComments,
}: CommentSectionProps) => {
  const socket = useSocket();
  const { onSubmit: createComment, isLoading: isCreatingComment } =
    useCreateComment();
  const { onSubmit: updateComment, isLoading: isUpdatingComment } =
    useUpdateComment();
  const { onSubmit: deleteComment, isLoading: isDeletingComment } =
    useDeleteComment();

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [activeCommentMenu, setActiveCommentMenu] = useState<string | null>(
    null
  );

  const {
    data: commentsData,
    isLoading: isLoadingComments,
  } = useGetComments(questionId, showComments);

  useEffect(() => {
    if (commentsData?.data) {
      setComments(commentsData.data);
    }
  }, [commentsData]);

  // Listen for real-time comment updates
  useEffect(() => {
    if (!socket) return;

    const handleCommentCreated = (payload: {
      comment: Comment;
      questionId: string;
    }) => {
      if (payload.questionId === questionId) {
        setComments((prev) => {
          if (prev.some((c) => c._id === payload.comment._id)) return prev;
          return [payload.comment, ...prev];
        });
      }
    };

    const handleCommentUpdated = (payload: {
      comment: Comment;
      questionId: string;
    }) => {
      if (payload.questionId === questionId) {
        setComments((prev) =>
          prev.map((c) => (c._id === payload.comment._id ? payload.comment : c))
        );
      }
    };

    const handleCommentDeleted = (payload: {
      commentId: string;
      questionId: string;
    }) => {
      if (payload.questionId === questionId) {
        setComments((prev) => prev.filter((c) => c._id !== payload.commentId));
      }
    };

    socket.on("comment:created", handleCommentCreated);
    socket.on("comment:updated", handleCommentUpdated);
    socket.on("comment:deleted", handleCommentDeleted);

    return () => {
      socket.off("comment:created", handleCommentCreated);
      socket.off("comment:updated", handleCommentUpdated);
      socket.off("comment:deleted", handleCommentDeleted);
    };
  }, [socket, questionId]);

  const handleCreateComment = () => {
    if (!currentUserId) {
      toast.error("Please login to comment");
      return;
    }

    if (commentText.trim()) {
      createComment(questionId, { content: commentText.trim() });
      setCommentText("");
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.content);
    setActiveCommentMenu(null);
  };

  const handleUpdateComment = (commentId: string) => {
    if (editingCommentText.trim()) {
      updateComment(commentId, { content: editingCommentText.trim() });
      setEditingCommentId(null);
      setEditingCommentText("");
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteComment(commentId);
      setActiveCommentMenu(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleToggleMenu = (commentId: string) => {
    setActiveCommentMenu(activeCommentMenu === commentId ? null : commentId);
  };

  if (!showComments) return null;

  return (
    <div className="border-t border-border">
      <CommentInput
        currentUserId={currentUserId}
        commentText={commentText}
        isCreating={isCreatingComment}
        onTextChange={setCommentText}
        onSubmit={handleCreateComment}
      />

      <CommentList
        comments={comments}
        currentUserId={currentUserId}
        isLoading={isLoadingComments}
        editingCommentId={editingCommentId}
        editingCommentText={editingCommentText}
        activeCommentMenu={activeCommentMenu}
        isUpdating={isUpdatingComment}
        isDeleting={isDeletingComment}
        onEditComment={handleEditComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        onCancelEdit={handleCancelEdit}
        onEditTextChange={setEditingCommentText}
        onToggleMenu={handleToggleMenu}
      />
    </div>
  );
};