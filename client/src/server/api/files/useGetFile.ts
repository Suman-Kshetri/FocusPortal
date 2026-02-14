import { useQuery } from "@tanstack/react-query";
import { filesApi } from "./hooks";

export const useGetFile = (fileId: string | null) => {
  return useQuery({
    queryKey: ["file", fileId],
    queryFn: () => filesApi.getFile(fileId!),
    enabled: !!fileId,
  });
};
