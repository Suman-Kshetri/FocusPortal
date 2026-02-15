// File: src/server/api/user/useDeleteAccount.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { userApi } from "./hooks";

export interface DeleteAccountParams {
  confirmation: string;
}

interface DeleteAccountResponse {
  status: number;
  message: string;
  data: Record<string, never>;
}

export const useDeleteAccount = () => {
  const navigate = useNavigate();

  return useMutation<DeleteAccountResponse, Error, DeleteAccountParams>({
    mutationFn: async ({ confirmation }: DeleteAccountParams) =>
      userApi.deleteAccount({ confirmation }),
    onSuccess: () => {
      localStorage.removeItem("token");
      navigate({ to: "/auth/login" });
    },
    onError: (error: any) => {
      console.error("Error deleting account:", error);
    },
  });
};
