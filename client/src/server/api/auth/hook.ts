import type { ForgotPasswordType } from "@/components/pages/forgot-pasword-page";
import axiosInstance from "@/config/api/axios.config";
import type { userLoginDataType } from "@/types/authType";
import type { resetPasswordType } from "./useResetPassword";

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
  verifyEmail: async(data: { code: string }) => {
    const response = await axiosInstance.post("/auth/verify-email", data)
    return response.data;
  },
  forgotPassword : async(data: ForgotPasswordType) => {
    const response = await axiosInstance.post("/auth/forgot-password", data);
    return response.data;
  },
  resetPassword: async(data: resetPasswordType)  => {
    const response = await axiosInstance.post(`/auth/reset-password/${data.token}`, data)
    return response.data;
  }
};
