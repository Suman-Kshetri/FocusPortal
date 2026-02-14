import { useMutation } from "@tanstack/react-query";
import { filesApi } from "./hooks";
import { toast } from "sonner";

export const useDownloadFile = () => {
  const mutation = useMutation({
    mutationFn: async ({
      fileId,
      fileName,
    }: {
      fileId: string;
      fileName: string;
    }) => {
      const response = await filesApi.downloadFile(fileId);

      // Creating blob link to download files
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return response.data;
    },
    onSuccess: () => {
      toast.success("File downloaded successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to download file");
    },
  });

  return {
    onSubmit: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
