import axiosInstance from "@/config/api/axios.config";
import type { folderCreationType } from "@/types/folderTypes";
import type { RenameFolderInput } from "./useRenameFolder";
import type { MoveFolderInput } from "./useMoveFolder";

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
  getFolderPath: async (folderId: string) => {
    const response = await axiosInstance.get(`/folder/${folderId}/path`);
    return response.data;
  },
  renameFolder: async ({ folderId, folderName }: RenameFolderInput) => {
    const response = await axiosInstance.patch(`/folder/${folderId}/edit`, {
      folderName,
    });
    return response.data;
  },
  moveFolder: async ({ folderId, newParentId }: MoveFolderInput) => {
    const response = await axiosInstance.put(`/folder/${folderId}/move`, {
      newParentId,
    });
    return response.data;
  },
  getAllFoldersWithPaths: async () => {
    const response = await axiosInstance.get("/folder/all/with-paths");
    return response.data;
  },
  deleteFolder: async (folderId: string) => {
    const response = await axiosInstance.delete(`folder/${folderId}/delete`);
    return response.data;
  },
};
