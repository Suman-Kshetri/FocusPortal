import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authApi } from "@/server/api/auth/hook";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  username: string;
  avatar?: File;
}

export const useRegister = () => {
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      toast.success(
        response.message ||
          "Registration successful! Please check your email to verify your account."
      );
      navigate({ to: "/auth/verify-email" });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Registration failed");
      console.error("Registration error:", error);
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    const formData = new FormData();

    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("username", data.username.replace(/\s+/g, ""));

    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }

    registerMutation.mutate(formData);
  };

  return {
    onSubmit,
    isLoading: registerMutation.isPending,
    error: registerMutation.error?.response?.data?.message || null,
    isSuccess: registerMutation.isSuccess,
  };
};
