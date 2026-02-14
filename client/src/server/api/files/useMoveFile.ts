import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesApi } from "./hooks";
import { toast } from "sonner";

export const useMoveFile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      fileId,
      folderId,
    }: {
      fileId: string;
      folderId: string | null;
    }) => filesApi.moveFile(fileId, folderId),
    onSuccess: () => {
      toast.success("File moved successfully");
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to move file");
    },
  });

  return {
    onSubmit: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

