import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { questionApis } from "./hooks";

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: questionApis.deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Question deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete question");
    },
  });
};
