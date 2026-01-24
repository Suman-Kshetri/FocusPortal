import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { authApi } from "./hook";
import { useNavigate } from "@tanstack/react-router";

export const useLogout = () => {
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate({ to: "/auth/login"});
      toast.success("Logout successful!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate({ to: "/auth/login", replace: true });
      toast.error(error.response?.data?.message || "Logout failed");
    },
  });

  return {
    logout: () => logoutMutation.mutate(), // ✅ wrap in function
    isLoading: logoutMutation.isPending,
  };
};
