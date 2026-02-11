import { useMutation } from "@tanstack/react-query";
import { folderApi } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export const useFolderCreation = () => {
  const useFolderCreationMutation = useMutation({
    mutationFn: folderApi.createFolder,
    onSuccess: (response) => {
      console.log("data is", response);
      toast.success(response.data.message || "Folder created successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Folder creation failed");
      console.error("Folder creation error:", error);
    },
  });
  const onSubmit = (data: any) => {
    useFolderCreationMutation.mutate(data);
  };
  return {
    onSubmit,
    isLoading: useFolderCreationMutation.isPending,
    error: useFolderCreationMutation.error?.response?.data?.message || null,
    isSuccess: useFolderCreationMutation.isSuccess,
  };
};
