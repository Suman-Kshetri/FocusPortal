import { useState, useEffect } from "react";
import type { Comment } from "@/types/commentType";
import { useCreateComment } from "@/server/api/comments/useCreateComment";
import { useGetComments } from "@/server/api/comments/useGetComment";
import { useUpdateComment } from "@/server/api/comments/useUpdateComment";
import { useDeleteComment } from "@/server/api/comments/useDeleteComment";
import { useSocket } from "@/context/socketContext";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const { onSubmit: createComment, isLoading: isCreatingComment } =
    useCreateComment();
  const { onSubmit: updateComment, isLoading: isUpdatingComment } =
    useUpdateComment();
  const { onSubmit: deleteComment, isLoading: isDeletingComment } =
    useDeleteComment();

  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [activeCommentMenu, setActiveCommentMenu] = useState<string | null>(
    null,
  );

  const { data: commentsData, isLoading: isLoadingComments } = useGetComments(
    questionId,
    showComments,
  );

  // ✅ Use React Query data directly - single source of truth
  const comments = commentsData?.data ?? [];

  // ✅ Socket.IO updates React Query cache only
  useEffect(() => {
    if (!socket) return;

    const handleCommentCreated = (payload: {
      comment: Comment;
      questionId: string;
    }) => {
      if (payload.questionId !== questionId) return;

      queryClient.setQueryData(["comments", questionId], (old: any) => {
        if (!old?.data) return old;

        // Prevent duplicates
        if (old.data.some((c: Comment) => c._id === payload.comment._id)) {
          return old;
        }

        return {
          ...old,
          data: [payload.comment, ...old.data],
        };
      });
    };

    const handleCommentUpdated = (payload: {
      comment: Comment;
      questionId: string;
    }) => {
      if (payload.questionId !== questionId) return;

      queryClient.setQueryData(["comments", questionId], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((c: Comment) =>
            c._id === payload.comment._id ? payload.comment : c,
          ),
        };
      });
    };

    const handleCommentDeleted = (payload: {
      commentId: string;
      questionId: string;
    }) => {
      if (payload.questionId !== questionId) return;

      queryClient.setQueryData(["comments", questionId], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.filter((c: Comment) => c._id !== payload.commentId),
        };
      });
    };
    const handleCommentVoted = (payload: {
      commentId: string;
      upvotes: number;
      downvotes: number;
      questionId: string;
      userId: string;
      action: "upvote" | "downvote" | "remove";
    }) => {
      if (payload.questionId !== questionId) return;

      queryClient.setQueryData(["comments", questionId], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((c: Comment) => {
            if (c._id !== payload.commentId) return c;

            return {
              ...c,
              upvotes: payload.upvotes,
              downvotes: payload.downvotes,
              userVote:
                payload.userId === currentUserId
                  ? payload.action === "upvote"
                    ? "up"
                    : payload.action === "downvote"
                      ? "down"
                      : null
                  : c.userVote,
            };
          }),
        };
      });
    };

    socket.on("comment:created", handleCommentCreated);
    socket.on("comment:updated", handleCommentUpdated);
    socket.on("comment:deleted", handleCommentDeleted);
    socket.on("comment:voted", handleCommentVoted);

    return () => {
      socket.off("comment:created", handleCommentCreated);
      socket.off("comment:updated", handleCommentUpdated);
      socket.off("comment:deleted", handleCommentDeleted);
      socket.off("comment:voted", handleCommentVoted);
    };
  }, [socket, questionId, queryClient]);

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
