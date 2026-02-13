import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApis } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { CreateCommentData } from "@/types/commentType";

interface UpdateCommentParams {
  commentId: string;
  data: CreateCommentData;
}

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, data }: UpdateCommentParams) =>
      commentApis.updateComment(commentId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Comment updated successfully");
    },

    onError: (error: AxiosError<any>) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update comment";
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
