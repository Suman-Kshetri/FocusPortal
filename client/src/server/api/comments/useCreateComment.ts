import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApis } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { CreateCommentData } from "@/types/commentType";

interface CreateCommentParams {
  questionId: string;
  data: CreateCommentData;
}

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: ({ questionId, data }: CreateCommentParams) =>
      commentApis.createComment(questionId, data),

    onSuccess: (response, { questionId }) => {
      toast.success("Comment posted successfully");
      // console.log($&)
      queryClient.invalidateQueries({ queryKey: ["comments", questionId] });
    },

    onError: (error: AxiosError<any>) => {
      const errorMessage =
        error.response?.data?.message || "Failed to post comment";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (questionId: string, data: CreateCommentData) => {
    createCommentMutation.mutate({ questionId, data });
  };

  return {
    onSubmit,
    isLoading: createCommentMutation.isPending,
    error: createCommentMutation.error,
  };
};
