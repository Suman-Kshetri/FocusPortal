import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { questionApis } from "./hooks";



export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: questionApis.updateQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Question updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update question");
    },
  });
};
