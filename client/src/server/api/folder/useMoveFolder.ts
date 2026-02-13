import { useMutation, useQueryClient } from "@tanstack/react-query";
import { folderApi } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export interface MoveFolderInput {
  folderId: string;
  newParentId: string | null;
}

export const useMoveFolder = () => {
  const queryClient = useQueryClient();
  const useMoveFolderMutation = useMutation({
    mutationFn: (input: MoveFolderInput) => folderApi.moveFolder(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folderContents"] });
      queryClient.invalidateQueries({ queryKey: ["folderPath"] });
      queryClient.invalidateQueries({ queryKey: ["allFoldersWithPaths"] });
      toast.success("Folder moved");
    },
    onError: (error: AxiosError<any>) => {
      console.log("Error response:", error.response);
      const errorMessage =
        error.response?.data?.message || "Failed to rename Folder";
      toast.error(errorMessage);
    },
  });
  const onSubmit = ({ folderId, newParentId }: MoveFolderInput) => {
    useMoveFolderMutation.mutate({ folderId, newParentId });
  };

  return {
    onSubmit,
    isLoading: useMoveFolderMutation.isPending,
    error: useMoveFolderMutation.isError,
  };
};
