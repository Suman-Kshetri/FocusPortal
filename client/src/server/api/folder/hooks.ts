import axiosInstance from "@/config/api/axios.config";
import type { folderCreationType } from "@/types/folderTypes";

export const folderApi = {
  createFolder: async (data: folderCreationType) => {
    const response = await axiosInstance.post("/folder/create", data);
    return response;
  },
  getFolderContents: async (folderId: string) => {
    const endpoint = folderId ? `/folder/${folderId}` : `/folder/root`;
    const response = await axiosInstance.get(endpoint);
    return response;
  },
};
