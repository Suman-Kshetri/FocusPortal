import { useMutation, useQueryClient } from "@tanstack/react-query";
import { folderApi } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  const useDeleteFolderMutation = useMutation({
    mutationFn: (folderId: string) => folderApi.deleteFolder(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folderContents"] });
      queryClient.invalidateQueries({ queryKey: ["folderPath"] });
      queryClient.invalidateQueries({ queryKey: ["allFoldersWithPaths"] });
      toast.success("Folder deleted successfully");
    },
    onError: (error: AxiosError<any>) => {
      // console.log($&)
      const errorMessage =
        error.response?.data?.message || "Failed to rename Folder";
      toast.error(errorMessage);
    },
  });
  const onDelete = (folderId: string) => {
    useDeleteFolderMutation.mutate(folderId);
  };
  return {
    onDelete,
    isLoading: useDeleteFolderMutation.isPending,
    isError: useDeleteFolderMutation.isError,
  };
};
