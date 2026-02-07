export interface Comment {
  _id: string;
  commentableType: "Question" | "Answer";
  commentableId: string;
  author: {
    _id: string;
    fullName: string;
    email?: string;
    avatar?: string;
    username?: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCommentData {
  content: string;
}