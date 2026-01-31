export interface QuestionFormData {
  title: string;
  content: string;
  category: string;
  tags: string; 
}

// API payload sent to backend
export interface CreateQuestionPayload {
  title: string;
  content: string;
  category: string;
  tags: string;
  images?: File[];
}
//from backend
export interface Question {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  images: string[]; // image paths
  createdAt: string;
  updatedAt: string;
}
// API success response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

// API error response
export interface ApiErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  errors?: any[];
}