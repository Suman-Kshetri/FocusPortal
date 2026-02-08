import { useEffect } from "react";
import { useSocket } from "@/context/socketContext";
import { useGetAllQuestions } from "@/server/api/questions/getAllQuestions";
import { useGetUserProfile } from "@/server/api/users/usegetUserProfile";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Question } from "@/types/questionType";
import { QuestionCard } from "./QuestionCard";
import { QuestionCardSkeleton } from "@/components/skeleton/questionCardSkeleton";

export const QuestionsFeed = () => {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useGetAllQuestions();
  const { userData } = useGetUserProfile();

  const questions = data?.data ?? [];
  const currentUserId = userData?.data?._id ?? "";

  useEffect(() => {
    if (!socket) return;

    const handleNewQuestion = (newQuestion: Question) => {
      queryClient.setQueryData(["questions"], (old: any) => {
        if (!old?.data) return old;
        if (old.data.some((q: Question) => q._id === newQuestion._id))
          return old;

        toast.success(`New question: ${newQuestion.title}`);
        return { ...old, data: [newQuestion, ...old.data] };
      });
    };

    socket.on("question:created", handleNewQuestion);
    return () => {
      socket.off("question:created", handleNewQuestion);
    };
  }, [socket, queryClient]);

  if (isLoading) return <QuestionCardSkeleton />;
  if (error)
    return (
      <div className="text-center text-destructive p-4">
        Error loading questions
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Questions</h1>
        <span className="text-sm text-muted-foreground">
          {questions.length} questions
        </span>
      </div>

      {questions.length === 0 ? (
        <div className="text-center text-muted-foreground p-8">
          No questions yet. Be the first to ask!
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question: Question) => (
            <QuestionCard
              key={question._id}
              question={question}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
