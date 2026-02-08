import axiosInstance from "@/config/api/axios.config";

export const statsApi = {
  getOverviewStats: async () => {
    const response = await axiosInstance.get("/stats/overview");
    return response.data;
  },
  getQuestionsCount: async () => {
    const response = await axiosInstance.get("/stats/answers/count");
    return response.data;
  },
  getActiveUsersCount: async () => {
    const response = await axiosInstance.get("/stats/users/active-count");
    return response.data;
  },
  getDetailedStats: async () => {
    const response = await axiosInstance.get("/stats/detailed");
    return response.data;
  },
};
