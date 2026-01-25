import { useMutation } from "@tanstack/react-query";
import { userApi } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export const useUserUpdateProfile = () => {
  const useUserUpdateMutation = useMutation({
    mutationFn: userApi.updateUserData,  
    onSuccess: (response) => {
      console.log("user data updated successfully", response);
      toast.success("User data updated successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Update error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Update failed. Please try again.";
      toast.error(errorMsg);
    },
  });
  
  const onSubmit = (data: any) => {
    useUserUpdateMutation.mutate(data);
  };
  
  return {
    onSubmit,
    isLoading: useUserUpdateMutation.isPending,
    error: useUserUpdateMutation.error,
  };
};