import { QuestionCard } from "./questionCard";
import { useEffect, useState } from "react";
import { useSocket } from "@/context/socketContext";
import { useGetAllQuestions } from "@/server/api/questions/getAllQuestions";
import type { Question } from "@/types/questionType";
import { QuestionCardSkeleton } from "@/components/skeleton/questionCardSkeleton";
import { toast } from "sonner";

export const QuestionsFeed = () => {
  const socket = useSocket();
  const { data, isLoading, error } = useGetAllQuestions();
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (data?.data) {
      setQuestions(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (!socket) return;

    const handleNewQuestion = (newQuestion: Question) => {
      setQuestions((prev) => {
        if (prev.some((q) => q._id === newQuestion._id)) return prev;
        toast.success(`New question: ${newQuestion.title}`);
        return [newQuestion, ...prev];
      });
    };

    socket.on("question:created", handleNewQuestion);

    return () => {
      socket.off("question:created", handleNewQuestion);
    };
  }, [socket]);

  if (isLoading) {
    return <QuestionCardSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-4">
        Error loading questions. Please try again.
      </div>
    );
  }

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
          {questions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
};
