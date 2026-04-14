import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { questionApis } from "./hooks";
import type { AxiosError } from "axios";

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: questionApis.deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Question deleted successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to delete question");
    },
  });
};
