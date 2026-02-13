// useGetAllFolders.tsx
import { useQuery } from "@tanstack/react-query";
import { folderApi } from "./hooks";

export const useGetAllFolders = () => {
  return useQuery({
    queryKey: ["allFoldersWithPaths"],
    queryFn: () => folderApi.getAllFoldersWithPaths(),
    staleTime: 5 * 60 * 1000,
  });
};
