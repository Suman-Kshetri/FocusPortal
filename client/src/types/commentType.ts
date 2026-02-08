// commentType.ts
// commentType.ts
export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    fullName: string;
    email: string;
    avatar: string;
    username: string;
  };
  commentableType: string;
  commentableId: string;

  upvotes?: number;
  downvotes?: number;
  hasUpvoted?: boolean;
  hasDownvoted?: boolean;
  userVote?: "upvote" | "downvote" | null;
  upvotedBy?: string[];
  downvotedBy?: string[];
  
  createdAt: string;
  updatedAt: string;
}
export interface CreateCommentData {
  content: string;
}
