// File: src/server/api/files/useReadFileContent.ts
import { useMutation } from "@tanstack/react-query";
import { filesApi } from "./hooks";

interface ReadFileContentResponse {
  status: number;
  message: string;
  data: {
    file: {
      id: string;
      fileName: string;
      type: string;
      size: number;
      editable: boolean;
    };
    content: string;
  };
}

export const useReadFileContent = () => {
  return useMutation<ReadFileContentResponse, Error, string>({
    mutationFn: async (fileId: string) => {
      const response = await filesApi.readFileContent(fileId);
      return response;
    },
    onError: (error) => {
      console.error("Error reading file content:", error);
    },
  });
};
