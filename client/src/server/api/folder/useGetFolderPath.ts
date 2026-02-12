import { useQuery } from "@tanstack/react-query";
import { folderApi } from "./hooks";

interface BreadcrumbItem {
  id: string;
  name: string;
}

interface FolderPathResponse {
  status: number;
  message: string;
  data: BreadcrumbItem[];
}

export const useGetFolderPath = (folderId: string | null) => {
  return useQuery<FolderPathResponse>({
    queryKey: ["folderPath", folderId],
    queryFn: async () => {
      if (!folderId || folderId === "null") {
        return {
          status: 200,
          message: "At root",
          data: [],
        };
      }
      return await folderApi.getFolderPath(folderId);
    },
    enabled: !!folderId && folderId !== "null",
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};
