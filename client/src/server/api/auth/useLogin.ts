import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/server/api/auth/hook";
import { AxiosError } from "axios";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Since authApi.login returns response.data, the tokens are directly in data
      console.log("Login response:", data); // Debug: check the structure
      
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      
      toast.success("Login successful!");
      navigate({ to: "/dashboard" });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Login error:", error); // Debug logging
      const errorMsg = error.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(errorMsg);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const errorMessage = loginMutation.error
    ? (loginMutation.error as AxiosError<{ message: string }>).response?.data
        ?.message || "Login failed. Please check your credentials."
    : null;

  return {
    form,
    onSubmit,
    isLoading: loginMutation.isPending,
    error: errorMessage,
    isSuccess: loginMutation.isSuccess,
  };
};