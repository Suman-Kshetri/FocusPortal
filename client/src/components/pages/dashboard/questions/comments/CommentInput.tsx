interface CommentInputProps {
  currentUserId?: string;
  commentText: string;
  isCreating: boolean;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
}

export const CommentInput = ({
  currentUserId,
  commentText,
  isCreating,
  onTextChange,
  onSubmit,
}: CommentInputProps) => {
  return (
    <div className="p-4 flex gap-3">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary text-sm">
        {currentUserId ? "Y" : "?"}
      </div>
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && onSubmit()}
          placeholder="Write a comment..."
          maxLength={500}
          className="
            flex-1 px-4 py-2
            bg-secondary rounded-full
            text-sm
            focus:outline-none focus:ring-2 focus:ring-primary
          "
        />
        <button
          onClick={onSubmit}
          disabled={!commentText.trim() || isCreating}
          className="
            px-4 py-2 bg-primary text-primary-foreground
            rounded-full text-sm font-semibold
            hover:bg-primary/90
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all
          "
        >
          {isCreating ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};