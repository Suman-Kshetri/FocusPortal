import { useMutation } from "@tanstack/react-query";
import { questionApis } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";

interface VoteParams {
  questionId: string;
  type: "upvote" | "downvote";
}

export const useVoteQuestion = () => {
  const voteQuestionMutation = useMutation({
    mutationFn: (params: VoteParams) =>
      questionApis.voteQuestion(params.questionId, { type: params.type }),

    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = error.response?.data?.message || "Failed to vote";
      toast.error(errorMessage);
    },
  });

  const removeVoteMutation = useMutation({
    mutationFn: (questionId: string) => questionApis.removeVote(questionId),

    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data?.message || "Failed to remove vote";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (questionId: string, type: "upvote" | "downvote") => {
    voteQuestionMutation.mutate({ questionId, type });
  };

  const onRemove = (questionId: string) => {
    removeVoteMutation.mutate(questionId);
  };

  return {
    onSubmit,
    onRemove,
    isLoading: voteQuestionMutation.isPending || removeVoteMutation.isPending,
    error: voteQuestionMutation.error || removeVoteMutation.error,
  };
};
