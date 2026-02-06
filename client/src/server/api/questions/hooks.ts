import axiosInstance from "@/config/api/axios.config";

export const questionApis = {
  createQuestion: async (data: FormData) => {
    const response = await axiosInstance.post(
      "/question/create-questions",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
  getAllQuestions: async () => {
    const response = await axiosInstance.get("/question/get-all-questions");
    return response.data;
  },
  voteQuestion: async (
    questionId: string,
    data: { type: "upvote" | "downvote" },
  ) => {
    const response = await axiosInstance.post(
      `/question/${questionId}/vote`,
      data,
    );
    return response.data;
  },
  removeVote: async (questionId: string) => {
    const response = await axiosInstance.delete(`/question/${questionId}/vote`);
    return response.data;
  },
};
