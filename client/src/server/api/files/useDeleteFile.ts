import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesApi } from "./hooks";
import { toast } from "sonner";

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (fileId: string) => filesApi.deleteFile(fileId),
    onSuccess: () => {
      toast.success("File deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete file");
    },
  });

  return {
    onSubmit: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
