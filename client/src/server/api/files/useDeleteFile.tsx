import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/config/api/axios.config";
import { toast } from "sonner";

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (fileId: string) => {
      const response = await axiosInstance.delete(`/files/delete/${fileId}`);
      return response.data;
    },
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
