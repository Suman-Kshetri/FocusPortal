import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { questionApis } from "./hooks";
import { toast } from "sonner";

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  const useCreateQuestionMutation = useMutation({
    mutationFn: questionApis.createQuestion,
    onSuccess: (response) => {
      // console.log($&)
      toast.success("Question created successfully");

      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: AxiosError<any>) => {
      console.error("Create question error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create question. Please try again.";

      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: FormData) => {
    useCreateQuestionMutation.mutate(data);
  };

  return {
    onSubmit,
    isLoading: useCreateQuestionMutation.isPending,
    error: useCreateQuestionMutation.error,
  };
};
