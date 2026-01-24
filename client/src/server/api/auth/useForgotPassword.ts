import { useMutation } from "@tanstack/react-query"
import { authApi } from "./hook"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ForgotPasswordType } from "@/components/pages/forgot-pasword-page";

export const useForgotPassword = () =>{
    const navigate = useNavigate();
    const forgotPasswordMutation = useMutation({
        mutationFn: authApi.forgotPassword,
        onSuccess: () => {
            navigate({to: "/auth/login"})
            toast.success("Email send successfull. Please check your email")
        },
        onError: (error: AxiosError<{ message: string }>) => {
              toast.error(error.response?.data?.message || "Email not found");
            },
    })
    const onSubmit = (data: ForgotPasswordType) => {
        forgotPasswordMutation.mutate(data)
    }
    return {
        onSubmit,
    }
}