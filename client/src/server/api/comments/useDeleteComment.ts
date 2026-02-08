import { useMutation } from "@tanstack/react-query";
import { commentApis } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export const useDeleteComment = () => {
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => commentApis.deleteComment(commentId),

    onSuccess: () => {
      toast.success("Comment deleted successfully");
    },

    onError: (error: AxiosError<any>) => {
      const errorMessage =
        error.response?.data?.message || "Failed to delete comment";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (commentId: string) => {
    deleteCommentMutation.mutate(commentId);
  };

  return {
    onSubmit,
    isLoading: deleteCommentMutation.isPending,
    error: deleteCommentMutation.error,
  };
};
