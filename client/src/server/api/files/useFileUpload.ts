// server/api/files/useFileUpload.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesApi } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export const useFileUpload = () => {
  const queryClient = useQueryClient();

  const useFileUploadMutation = useMutation({
    mutationFn: (data: FormData) => filesApi.fileUpload(data),
    onSuccess: (data) => {
      const uploadedCount = data?.data?.success || 0;
      const failedCount = data?.data?.failed || 0;

      if (failedCount > 0 && uploadedCount > 0) {
        toast.warning(
          `${uploadedCount} file(s) uploaded, ${failedCount} failed`,
        );
      } else if (uploadedCount > 0) {
        toast.success(`Successfully uploaded ${uploadedCount} file(s)`);
      }

      // Fix the invalidateQueries syntax
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error: AxiosError<any>) => {
      // console.log($&)
      const errorMessage =
        error.response?.data?.message || "Failed to upload files";
      toast.error(errorMessage);
    },
  });

  // Return the mutateAsync for proper promise handling
  const onSubmit = async (data: FormData) => {
    return await useFileUploadMutation.mutateAsync(data);
  };

  return {
    onSubmit,
    isLoading: useFileUploadMutation.isPending,
    error: useFileUploadMutation.isError,
  };
};
