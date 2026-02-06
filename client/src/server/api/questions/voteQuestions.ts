import { useMutation } from "@tanstack/react-query";
import { questionApis } from "./hooks";
import { toast } from "sonner";
import type { AxiosError } from "axios";

interface VoteParams {
  questionId: string;
  type: 'upvote' | 'downvote';
}
interface RemoveVoteParams {
  questionId: string;
}

export const useVoteQuestion = () => {
  // const queryClient = useQueryClient();
  
  const voteQuestionMutation = useMutation({
    mutationFn: (params: VoteParams) => 
  questionApis.voteQuestion(params.questionId, { type: params.type }),
    
    onSuccess: (response) => {
      console.log("Question voted successfully", response.data);
      toast.success("Voted successfully");
    },
    
    onError: (error: AxiosError<any>) => {
      console.error("Vote question error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to vote. Please try again.";
      toast.error(errorMessage);
    },
  });

   const removeVoteMutation = useMutation({
    mutationFn: ({ questionId }: RemoveVoteParams) =>
      questionApis.removeVote(questionId),
    onSuccess: (response) => {
      console.log("Vote removed successfully", response.data);
      toast.success("Vote removed");
      // queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: (error: AxiosError<any>) => {
      console.error("Remove vote error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove vote. Please try again.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (questionId: string, type: "upvote" | "downvote") => {
    voteQuestionMutation.mutate({ questionId, type });
  };

  const onRemove = (questionId: string) => {
    removeVoteMutation.mutate({ questionId });
  };

  return {
    onSubmit,
    onRemove,
    isLoading: voteQuestionMutation.isPending || removeVoteMutation.isPending,
    error: voteQuestionMutation.error || removeVoteMutation.error,
  };
};