import { useMutation } from "@tanstack/react-query";
import { commentApis } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { CreateCommentData } from "@/types/commentType";

interface CreateCommentParams {
  questionId: string;
  data: CreateCommentData;
}

export const useCreateComment = () => {

  const createCommentMutation = useMutation({
    mutationFn: ({ questionId, data }: CreateCommentParams) =>
      commentApis.createComment(questionId, data),
    onSuccess: (response) => {
      console.log("Comment created successfully", response.data);
      toast.success("Comment posted successfully");
    },
    onError: (error: AxiosError<any>) => {
      console.error("Create comment error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to post comment. Please try again.";
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