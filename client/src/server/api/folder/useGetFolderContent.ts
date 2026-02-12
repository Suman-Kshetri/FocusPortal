import { useQuery } from "@tanstack/react-query";
import { folderApi } from "./hooks";

export const useGetFolderContents = (folderId: string | null) => {
  return useQuery({
    queryKey: ["folderContents", folderId || "root"],
    queryFn: () => folderApi.getFolderContents(folderId || "root"),
    // KEY ADDITIONS:
    staleTime: 0, // Always consider data stale - refetch when folderId changes
    refetchOnMount: true,
    enabled: true,
  });
};
