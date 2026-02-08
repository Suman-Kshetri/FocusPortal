export interface QuestionFormData {
  title: string;
  content: string;
  category: string;
  tags: string;
}

export interface Author {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

export type QuestionStatus = "open" | "closed" | "answered";

export interface Question {
  _id: string;
  title: string;
  content: string;
  commentCount?:number;
  author: {
    _id: string;
    fullName: string;
    avatar?: string;
    email?: string;
    username?: string;
  };
  category: string;
  tags: string[];
  images?: string[];
  upvotedBy: string[];
  downvotedBy: string[];
  status: QuestionStatus;
  createdAt: string;
  updatedAt?: string;
}
