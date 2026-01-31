import { ThumbsUp, ThumbsDown, MessageSquare, Share2 } from "lucide-react";
import { useState } from "react";

interface Question {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  images?: string[];
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  dislikes: number;
  commentsCount: number;
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
}

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard = ({ question }: QuestionCardProps) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(question.likes);
  const [dislikes, setDislikes] = useState(question.dislikes);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: { name: "John Doe" },
      content: "Great question! I had the same issue last week.",
      createdAt: "2h ago",
      likes: 5,
    },
    {
      id: "2",
      author: { name: "Jane Smith" },
      content: "Have you tried checking the documentation? It might help.",
      createdAt: "1h ago",
      likes: 3,
    },
  ]);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
      if (disliked) {
        setDislikes(dislikes - 1);
        setDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDislikes(dislikes - 1);
      setDisliked(false);
    } else {
      setDislikes(dislikes + 1);
      setDisliked(true);
      if (liked) {
        setLikes(likes - 1);
        setLiked(false);
      }
    }
  };

  const handleComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: { name: "You" },
        content: commentText,
        createdAt: "Just now",
        likes: 0,
      };
      setComments([newComment, ...comments]);
      setCommentText("");
    }
  };

  return (
    <div className="bg-background border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
          {question.author.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{question.author.name}</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{question.createdAt}</span>
            <span>•</span>
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
              {question.category}
            </span>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="px-4 pb-3">
        <h2 className="text-lg font-bold mb-2">{question.title}</h2>
        <p className="text-muted-foreground text-sm whitespace-pre-wrap">
          {question.content}
        </p>

        {/* Tags */}
        {question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {question.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2.5 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Images */}
        {question.images && question.images.length > 0 && (
          <div className={`mt-4 grid gap-2 ${question.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
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

      {/* Stats Bar */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-muted-foreground border-t border-b border-border">
        <div className="flex items-center gap-3">
          <span>{likes} likes</span>
          <span>{dislikes} dislikes</span>
        </div>
        <span>{comments.length} comments</span>
      </div>

      {/* Action Buttons */}
      <div className="px-2 py-1 flex items-center justify-around">
        <button
          onClick={handleLike}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            hover:bg-accent transition-colors flex-1
            ${liked ? "text-primary font-semibold" : "text-muted-foreground"}
          `}
        >
          <ThumbsUp className="w-4 h-4" fill={liked ? "currentColor" : "none"} />
          <span className="text-sm">Like</span>
        </button>

        <button
          onClick={handleDislike}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            hover:bg-accent transition-colors flex-1
            ${disliked ? "text-destructive font-semibold" : "text-muted-foreground"}
          `}
        >
          <ThumbsDown className="w-4 h-4" fill={disliked ? "currentColor" : "none"} />
          <span className="text-sm">Dislike</span>
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

          <div className="px-4 pb-4 space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-semibold text-sm">
                  {comment.author.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="bg-secondary rounded-2xl px-4 py-2">
                    <h4 className="font-semibold text-sm">
                      {comment.author.name}
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
        </div>
      )}
    </div>
  );
};