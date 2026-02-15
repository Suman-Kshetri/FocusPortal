import axiosInstance from "@/config/api/axios.config";
import type { ChangePasswordParams } from "./useChangePassword";
import type { DeleteAccountParams } from "./useDeleteAccount";

export const userApi = {
  getUserData: async () => {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  },
  updateUserData: async (data: any) => {
    const response = await axiosInstance.patch(
      "/users/update-user-profile",
      data,
    );
    return response.data;
  },
  updateUploadAvatar: async (data: string) => {
    const response = await axiosInstance.patch("/users/update-avatar", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  changePassword: async ({
    oldPassword,
    newPassword,
  }: ChangePasswordParams) => {
    const response = await axiosInstance.patch("/users/change-password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
  deleteAccount: async ({ confirmation }: DeleteAccountParams) => {
    const response = await axiosInstance.delete("/users/delete-user-profile", {
      data: { confirmation },
    });
    return response.data;
  },
};
