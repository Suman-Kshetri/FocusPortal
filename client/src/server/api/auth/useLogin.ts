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
    onSuccess: (response) => {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      navigate({ to: "/dashboard" });

      toast.success("Login successful!");
    },
      onError: (error: AxiosError<{ message: string }>) => {
        toast.error(error.response?.data?.message || "Login failed");
      },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

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
