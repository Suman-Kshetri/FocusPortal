import { useMutation} from "@tanstack/react-query";
import { commentApis } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { CreateCommentData } from "@/types/commentType";

interface UpdateCommentParams {
  commentId: string;
  data: CreateCommentData;
}

export const useUpdateComment = () => {

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, data }: UpdateCommentParams) =>
      commentApis.updateComment(commentId, data),
    onSuccess: (response) => {
      console.log("Comment updated successfully", response.data);
      toast.success("Comment updated successfully");
    },
    onError: (error: AxiosError<any>) => {
      console.error("Update comment error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update comment. Please try again.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (commentId: string, data: CreateCommentData) => {
    updateCommentMutation.mutate({ commentId, data });
  };

  return {
    onSubmit,
    isLoading: updateCommentMutation.isPending,
    error: updateCommentMutation.error,
  };
};