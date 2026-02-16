import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/config/api/axios.config";
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
      try {
        // First, try to get the file
        const response = await axiosInstance.get(`/files/${fileId}/download`);

        // Check if it's a Cloudinary image (returns JSON with URL)
        if (response.data?.data?.type === "cloudinary") {
          const cloudinaryUrl = response.data.data.url;
          const secureUrl = cloudinaryUrl.replace("http://", "https://");

          const imageResponse = await fetch(secureUrl);
          const blob = await imageResponse.blob();

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);

          return { success: true };
        }

        // Otherwise it's a blob response from backend
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return { success: true };
      } catch (error) {
        console.error("Download error details:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("File downloaded successfully");
    },
    onError: (error: any) => {
      console.error("Download mutation error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to download file";
      toast.error(errorMessage);
    },
  });

  return {
    onSubmit: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
