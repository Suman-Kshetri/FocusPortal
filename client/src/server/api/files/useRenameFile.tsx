import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesApi } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export const useRenameFile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ fileId, fileName }: { fileId: string; fileName: string }) =>
      filesApi.renameFile(fileId, fileName),
    onSuccess: () => {
      toast.success("File renamed successfully");
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to rename file");
    },
  });

  return {
    onSubmit: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
