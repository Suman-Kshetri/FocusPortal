import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import type { Comment } from "@/types/commentType";
import { getTimeAgo } from "@/utils/timeUtils";
import { CommentVoteButtons } from "./CommentVoteButtons";

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  isEditing: boolean;
  editText: string;
  isUpdating: boolean;
  isDeleting: boolean;
  showMenu: boolean;
  onEdit: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
  onToggleMenu: () => void;
}

export const CommentItem = ({
  comment,
  currentUserId,
  isEditing,
  editText,
  isUpdating,
  isDeleting,
  showMenu,
  onEdit,
  onUpdate,
  onDelete,
  onCancelEdit,
  onEditTextChange,
  onToggleMenu,
}: CommentItemProps) => {
  const isAuthor = currentUserId === comment.author._id;

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-semibold text-sm overflow-hidden">
        {comment.author.avatar ? (
          <img
            src={comment.author.avatar}
            alt={comment.author.fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          comment.author.fullName.charAt(0).toUpperCase()
        )}
      </div>

      <div className="flex-1">
        {isEditing ? (
          /* Edit Mode */
          <div className="space-y-2">
            <textarea
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              maxLength={500}
              className="
                w-full px-4 py-2
                bg-secondary rounded-lg
                text-sm
                focus:outline-none focus:ring-2 focus:ring-primary
                resize-none
              "
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={onUpdate}
                disabled={!editText.trim() || isUpdating}
                className="
                  px-3 py-1 bg-primary text-primary-foreground
                  rounded-md text-xs font-semibold
                  hover:bg-primary/90
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
              <button
                onClick={onCancelEdit}
                className="
                  px-3 py-1 bg-secondary text-secondary-foreground
                  rounded-md text-xs font-semibold
                  hover:bg-accent
                "
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* View Mode */
          <>
            <div className="bg-secondary rounded-2xl px-4 py-2 relative">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">
                    {comment.author.fullName}
                  </h4>
                  <p className="text-sm mt-0.5 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>

                {/* Comment Menu (only for author) */}
                {isAuthor && (
                  <div className="relative">
                    <button
                      onClick={onToggleMenu}
                      className="p-1 hover:bg-accent rounded-full transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>

                    {showMenu && (
                      <div className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                        <button
                          onClick={onEdit}
                          className="
                            w-full px-4 py-2 text-left text-sm
                            hover:bg-accent transition-colors
                            flex items-center gap-2
                          "
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={onDelete}
                          disabled={isDeleting}
                          className="
                            w-full px-4 py-2 text-left text-sm
                            hover:bg-accent transition-colors
                            flex items-center gap-2
                            text-destructive
                          "
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-1 px-4 text-xs text-muted-foreground">
              <span>{getTimeAgo(comment.createdAt)}</span>
              {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                <span className="italic">(edited)</span>
              )}
            </div>

            {/* ✅ Add vote buttons */}
            <CommentVoteButtons
              comment={comment}
              currentUserId={currentUserId}
            />
          </>
        )}
      </div>
    </div>
  );
};
