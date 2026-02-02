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
  category: string;
  tags: string[];
  images: string[];
  author: Author;
  upvotes: number;
  downvotes: number;
  acceptedAnswer?: string;
  status: QuestionStatus;
  createdAt: string;
  updatedAt: string;
}