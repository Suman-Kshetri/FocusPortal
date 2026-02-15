// File: src/server/api/files/useCreateFile.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesApi } from "./hooks";

interface CreateFileParams {
  fileName: string;
  type: "md" | "xlsx";
  content?: string;
  folder?: string | null;
}

interface CreateFileResponse {
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

export const useCreateFile = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateFileResponse, Error, CreateFileParams>({
    mutationFn: async (params: CreateFileParams) => {
      const response = await filesApi.createFile(params);
      return response;
    },
    onSuccess: (data) => {
      // Invalidate and refetch file lists
      queryClient.invalidateQueries({ queryKey: ["files"] });

      // If file was created in a specific folder, invalidate that folder's files
      if (data.data.folder) {
        queryClient.invalidateQueries({
          queryKey: ["files", "folder", data.data.folder],
        });
      }

      console.log("File created successfully:", data.data.fileName);
    },
    onError: (error) => {
      console.error("Error creating file:", error);
    },
  });
};
