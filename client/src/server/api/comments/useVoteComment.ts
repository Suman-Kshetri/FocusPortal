import { useMutation } from "@tanstack/react-query";
import { commentApis } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";

interface VoteParams {
  commentId: string;
  type: "upvote" | "downvote";
}

export const useVoteComment = () => {
  const voteCommentMutation = useMutation({
    mutationFn: (params: VoteParams) =>
      commentApis.voteComment(params.commentId, { type: params.type }),

    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.message || "Failed to vote";
      toast.error(errorMessage);
    },
  });

  const removeVoteMutation = useMutation({
    mutationFn: (commentId: string) => commentApis.removeVote(commentId),

    onError: (error: AxiosError<any>) => {
      const errorMessage =
        error.response?.data?.message || "Failed to remove vote";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (commentId: string, type: "upvote" | "downvote") => {
    voteCommentMutation.mutate({ commentId, type });
  };

  const onRemove = (commentId: string) => {
    removeVoteMutation.mutate(commentId);
  };

  return {
    onSubmit,
    onRemove,
    isLoading: voteCommentMutation.isPending || removeVoteMutation.isPending,
    error: voteCommentMutation.error || removeVoteMutation.error,
  };
};
