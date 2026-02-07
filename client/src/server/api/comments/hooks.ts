import axiosInstance from "@/config/api/axios.config";
import type { CreateCommentData } from "@/types/commentType";

export const commentApis = {
  createComment: async (questionId: string, data: CreateCommentData) => {
    const response = await axiosInstance.post(
      `/comment/${questionId}/comments`,
      data
    );
    return response.data;
  },

  getCommentsByQuestion: async (questionId: string) => {
    const response = await axiosInstance.get(
      `/comment/${questionId}/comments`
    );
    return response.data;
  },

  updateComment: async (commentId: string, data: CreateCommentData) => {
    const response = await axiosInstance.put(
      `/comment/comments/${commentId}`,
      data
    );
    return response.data;
  },

  deleteComment: async (commentId: string) => {
    const response = await axiosInstance.delete(
      `/comment/comments/${commentId}`
    );
    return response.data;
  },
};