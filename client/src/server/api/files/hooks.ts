import axiosInstance from "@/config/api/axios.config";

export const filesApi = {
  fileUpload: async (data: FormData) => {
    const response = await axiosInstance.post("/files/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
