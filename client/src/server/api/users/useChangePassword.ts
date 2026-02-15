// File: src/server/api/user/useChangePassword.ts
import { useMutation } from "@tanstack/react-query";
import { userApi } from "./hooks";

export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  status: number;
  message: string;
  data: Record<string, never>;
}

export const useChangePassword = () => {
  return useMutation<ChangePasswordResponse, Error, ChangePasswordParams>({
    mutationFn: async ({ oldPassword, newPassword }: ChangePasswordParams) => {
      const response = await userApi.changePassword({
        oldPassword,
        newPassword,
      });
      return response.data;
    },
    onError: (error: any) => {
      console.error("Error changing password:", error);
    },
  });
};
