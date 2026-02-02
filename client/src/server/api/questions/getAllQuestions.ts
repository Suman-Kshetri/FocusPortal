import { useQuery } from "@tanstack/react-query";
import { questionApis } from "./hooks";

export const useGetAllQuestions = () => {
  return useQuery({
    queryKey: ['questions'],
    queryFn: questionApis.getAllQuestions,
    staleTime: 1000 * 60 * 5,
  });
};