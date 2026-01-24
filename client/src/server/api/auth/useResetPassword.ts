import { useMutation } from "@tanstack/react-query";
import { authApi } from "./hook";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type resetPasswordType = z.infer<typeof resetPasswordSchema>;

export const resetPassword = () => {
  const navigate = useNavigate();
  const form = useForm<resetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
     defaultValues: {
      password: "",
      confirmPassword: "",
      token: "",
    },
  });
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (response) => {
      navigate({ to: "/auth/login" });
      toast.success(response.message || "Reset Password successful!");
    },
    // onError: (error: AxiosError<{ message: string }>) => {
    //   toast.error(error?.message || "Reset password failed");
    // },
    onError: () => {
      toast.error("Reset password failed");
    },
  });
  const onSubmit = (data: resetPasswordType) => {
      resetPasswordMutation.mutate(data);
    };
    return {
    form,
    onSubmit,
  };
};
