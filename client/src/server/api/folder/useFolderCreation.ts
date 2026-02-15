import { useMutation, useQueryClient } from "@tanstack/react-query";
import { folderApi } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export const useFolderCreation = () => {
  const queryClient = useQueryClient();

  const useFolderCreationMutation = useMutation({
    mutationFn: (data: any) => folderApi.createFolder(data),
    onSuccess: (response, variables) => {
      toast.success(response.data.message || "Folder created successfully");
      queryClient.invalidateQueries({
        queryKey: ["folderContents", variables.parentFolder || "root"],
      });

      // Optional: invalidate all folder queries
      queryClient.invalidateQueries({ queryKey: ["folderContents"] });
    },
    onError: (error: AxiosError<{ message: string }>, response) => {
      // console.log($&)
      // console.log($&)
      toast.error(error.response?.data?.message);
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
