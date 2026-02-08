import { useQuery } from "@tanstack/react-query";
import { commentApis } from "./hooks";

export const useGetComments = (questionId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["comments", questionId],
    queryFn: () => commentApis.getCommentsByQuestion(questionId),
    enabled: enabled && !!questionId,
    staleTime: 1000 * 60 * 5,
  });
};