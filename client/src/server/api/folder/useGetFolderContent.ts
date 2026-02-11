import { useQuery } from "@tanstack/react-query";
import { folderApi } from "./hooks";

export const useGetFolderContents = (folderId: string | null) => {
  return useQuery({
    queryKey: ["folderContents", folderId || "root"],
    queryFn: () => folderApi.getFolderContents(folderId || "root"),
  });
};
