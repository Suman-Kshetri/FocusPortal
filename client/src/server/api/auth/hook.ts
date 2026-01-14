import axiosInstance from "@/config/api/axios.config";
import type { userLoginDataType } from "@/types/authType";

export const authApi = {
  login: async (Credentials: userLoginDataType) => {
    const response = await axiosInstance.post("/auth/login", Credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  register: async (data: FormData) => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  },
  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },
};
