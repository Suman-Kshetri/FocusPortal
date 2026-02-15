// File: src/server/api/files/useEditFile.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesApi } from "./hooks";

export interface EditFileParams {
  id: string;
  content: string;
}

interface EditFileResponse {
  status: number;
  message: string;
  data: {
    _id: string;
    fileName: string;
    type: string;
    source: string;
    path: string;
    size: number;
    mimeType: string;
    folder: string | null;
    owner: string;
    editable: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export const useEditFile = () => {
  const queryClient = useQueryClient();

  return useMutation<EditFileResponse, Error, EditFileParams>({
    mutationFn: async ({ id, content }: EditFileParams) => {
      const response = await filesApi.editFile({ id, content });
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["files"] });

      // Invalidate the specific file
      queryClient.invalidateQueries({
        queryKey: ["files", data.data._id],
      });

      // If file is in a folder, invalidate that folder's files
      if (data.data.folder) {
        queryClient.invalidateQueries({
          queryKey: ["files", "folder", data.data.folder],
        });
      }

      console.log("File updated successfully:", data.data.fileName);
    },
    onError: (error) => {
      console.error("Error updating file:", error);
    },
  });
};
