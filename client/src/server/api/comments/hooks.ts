import axiosInstance from "@/config/api/axios.config";
import type { CreateCommentData } from "@/types/commentType";

export const commentApis = {
  createComment: async (questionId: string, data: CreateCommentData) => {
    const response = await axiosInstance.post(
      `/comments/${questionId}/create-comments`,
      data,
    );
    return response.data;
  },

  getCommentsByQuestion: async (questionId: string) => {
    const response = await axiosInstance.get(
      `/comments/${questionId}/all-comments`,
    );
    return response.data;
  },

  updateComment: async (commentId: string, data: CreateCommentData) => {
    const response = await axiosInstance.put(
      `/comments/${commentId}/update`,
      data,
    );
    return response.data;
  },

  deleteComment: async (commentId: string) => {
    const response = await axiosInstance.delete(
      `/comments/${commentId}/delete`,
    );
    return response.data;
  },
  voteComment: async (
    commentId: string,
    data: { type: "upvote" | "downvote" },
  ) => {
    const response = await axiosInstance.post(
      `/comments/${commentId}/vote`,
      data,
    );
    return response.data;
  },

  removeVote: async (commentId: string) => {
    const response = await axiosInstance.delete(
      `/comments/${commentId}/remove-vote`,
    );
    return response.data;
  },
};
