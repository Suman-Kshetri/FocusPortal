import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router"
import { authApi } from "./hook";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export const useVerify = () => {
    const navigate = useNavigate();
    const verifyEmailMutation = useMutation({
        mutationFn: authApi.verifyEmail,
        onSuccess: (response) => {
            toast.success( response.message || "Email Verification Successfull !!")
            navigate({to:"/auth/login"})
        },
        onError :  (error: AxiosError<{ message: string }>) => {
              toast.error(error.response?.data?.message || "Email Verification Error");
              console.error("Registration error:", error);
            },
    });
    const onSubmit = (code: string) => {
        verifyEmailMutation.mutate({ code });

    }
    return {
        onSubmit,
        isSuccess: verifyEmailMutation.isSuccess,
        isLoading: verifyEmailMutation.isPending
    }
}