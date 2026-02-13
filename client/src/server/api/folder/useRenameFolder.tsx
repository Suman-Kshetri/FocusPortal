import { useMutation, useQueryClient } from "@tanstack/react-query";
import { folderApi } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export interface RenameFolderInput {
  folderId: string;
  folderName: string;
}

export const useRenameFolder = () => {
  const queryClient = useQueryClient();
  const useRenameFolderMutation = useMutation({
    mutationFn: (input: RenameFolderInput) => folderApi.renameFolder(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folderContents"] });
      queryClient.invalidateQueries({ queryKey: ["folderPath"] });
      toast.success("Folder renamed");
    },
    onError: (error: AxiosError<any>) => {
      console.log("Error response:", error.response);
      const errorMessage =
        error.response?.data?.message || "Failed to rename Folder";
      toast.error(errorMessage);
    },
  });
  const onSubmit = ({ folderId, folderName }: RenameFolderInput) => {
    useRenameFolderMutation.mutate({ folderId, folderName });
  };

  return {
    onSubmit,
    isLoading: useRenameFolderMutation.isPending,
    error: useRenameFolderMutation.error,
  };
};
