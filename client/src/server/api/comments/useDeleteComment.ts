import { useMutation} from "@tanstack/react-query";
import { commentApis } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export const useDeleteComment = () => {

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => commentApis.deleteComment(commentId),
    onSuccess: (response) => {
      console.log("Comment deleted successfully", response.data);
      toast.success("Comment deleted successfully");
    },
    onError: (error: AxiosError<any>) => {
      console.error("Delete comment error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete comment. Please try again.";
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