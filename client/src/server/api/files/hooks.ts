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
  getAllFiles: async (folderId: string) => {
    const response = await axiosInstance.get(`/files/folder/${folderId}/files`);
    return response.data;
  },

  getFile: async (fileId: string) => {
    const response = await axiosInstance.get(`/files/${fileId}`);
    return response.data;
  },

  downloadFile: async (fileId: string) => {
    const response = await axiosInstance.get(`/files/${fileId}/download`, {
      responseType: "blob",
    });
    return response;
  },

  moveFile: async (fileId: string, folderId: string | null) => {
    const response = await axiosInstance.patch(`/files/${fileId}/move`, {
      folderId: folderId || "root",
    });
    return response.data;
  },

  renameFile: async (fileId: string, fileName: string) => {
    const response = await axiosInstance.patch(`/files/${fileId}/rename`, {
      fileName,
    });
    return response.data;
  },

  deleteFile: async (fileId: string) => {
    const response = await axiosInstance.delete(`/files/${fileId}/delete`);
    return response.data;
  },
};
