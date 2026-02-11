import axiosInstance from "@/config/api/axios.config";
import type { folderCreationType } from "@/types/folderTypes";

export const folderApi = {
  createFolder: async (data: folderCreationType) => {
    const response = await axiosInstance.post("/folder/create", data);
    return response;
  },
};
