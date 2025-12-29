import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/server/api/auth/hook";
import { AxiosError } from "axios";

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
    onSuccess: (response) => {
      // Store token
      localStorage.setItem("token", response.token);
      
      // Navigate to dashboard
      navigate({ to: "/dashboard" });
      
      // Optional: Show success toast
      // toast.success("Login successful!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      // Optional: Show error toast
      // toast.error(error.response?.data?.message || "Login failed");
      console.error("Login error:", error);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  // Extract error message
  const errorMessage = loginMutation.error
    ? (loginMutation.error as AxiosError<{ message: string }>).response?.data
        ?.message || "!! Login failed. Please check your credentials."
    : null;

  return {
    form,
    onSubmit,
    isLoading: loginMutation.isPending,
    error: errorMessage,
    isSuccess: loginMutation.isSuccess,
  };
};