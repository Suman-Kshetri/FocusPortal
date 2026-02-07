import type { Comment } from "@/types/commentType";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  currentUserId?: string;
  isLoading: boolean;
  editingCommentId: string | null;
  editingCommentText: string;
  activeCommentMenu: string | null;
  isUpdating: boolean;
  isDeleting: boolean;
  onEditComment: (comment: Comment) => void;
  onUpdateComment: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
  onToggleMenu: (commentId: string) => void;
}

export const CommentList = ({
  comments,
  currentUserId,
  isLoading,
  editingCommentId,
  editingCommentText,
  activeCommentMenu,
  isUpdating,
  isDeleting,
  onEditComment,
  onUpdateComment,
  onDeleteComment,
  onCancelEdit,
  onEditTextChange,
  onToggleMenu,
}: CommentListProps) => {
  if (isLoading) {
    return (
      <div className="px-4 pb-4 text-center text-muted-foreground">
        Loading comments...
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="px-4 pb-4 text-center text-muted-foreground text-sm">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="px-4 pb-4 space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          currentUserId={currentUserId}
          isEditing={editingCommentId === comment._id}
          editText={editingCommentText}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          showMenu={activeCommentMenu === comment._id}
          onEdit={() => onEditComment(comment)}
          onUpdate={() => onUpdateComment(comment._id)}
          onDelete={() => onDeleteComment(comment._id)}
          onCancelEdit={onCancelEdit}
          onEditTextChange={onEditTextChange}
          onToggleMenu={() => onToggleMenu(comment._id)}
        />
      ))}
    </div>
  );
};