import { useQuery } from "@tanstack/react-query";
import { filesApi } from "./hooks";

export const useGetFiles = (folderId: string | null) => {
  return useQuery({
    queryKey: ["files", folderId],
    queryFn: async () => {
      const folderParam = folderId || "root";
      return await filesApi.getAllFiles(folderParam);
    },
    staleTime: 30000,
    retry: 1,
  });
};
