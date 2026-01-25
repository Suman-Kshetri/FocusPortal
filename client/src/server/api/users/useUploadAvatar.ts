import { useMutation } from "@tanstack/react-query";
import { userApi } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export const useUploadAvatar = () => {
  const useUploadAvatarMutation = useMutation({
    mutationFn: userApi.updateUploadAvatar,  
    onSuccess: (response) => {
      console.log("user avatar updated successfully", response);
      toast.success("User avatar updated successfully.. Please reload page");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Update error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Update failed. Please try again.";
      toast.error(errorMsg);
    },
  });
  
  const onUpload = (data: any) => {
    useUploadAvatarMutation.mutate(data);
  };
  
  return {
    onUpload,
    isLoading: useUploadAvatarMutation.isPending,
    error: useUploadAvatarMutation.error,
  };
};