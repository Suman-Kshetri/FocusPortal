import { useEffect, useState } from "react";
import { useSocket } from "@/context/socketContext";
import { useGetAllQuestions } from "@/server/api/questions/getAllQuestions";
import { useGetUserProfile } from "@/server/api/users/usegetUserProfile";
import { useDeleteQuestion } from "@/server/api/questions/useDeleteQuestion";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Question } from "@/types/questionType";
import { QuestionCard } from "./QuestionCard";
import { QuestionCardSkeleton } from "@/components/skeleton/questionCardSkeleton";
import { DeleteConfirmationDialog } from "@/components/dialog/delete-confirmation-dialog";
import { EditQuestionDialog } from "@/components/dialog/edit-question-dialog";

export const QuestionsFeed = ({ activeTab }: { activeTab: "all" | "my" }) => {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useGetAllQuestions();
  const { userData } = useGetUserProfile();
  const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion();

  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);

  const questions = data?.data ?? [];
  const currentUserId = userData?.data?._id ?? "";

  const filteredQuestions =
    activeTab === "my"
      ? questions.filter((q: Question) => q.author?._id === currentUserId)
      : questions;

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

    const handleQuestionUpdated = (updatedQuestion: Question) => {
      queryClient.setQueryData(["questions"], (old: any) => {
        if (!old?.data) return old;

        const updatedData = old.data.map((q: Question) =>
          q._id === updatedQuestion._id ? updatedQuestion : q,
        );

        return { ...old, data: updatedData };
      });
    };

    const handleQuestionDeleted = (payload: { questionId: string }) => {
      queryClient.setQueryData(["questions"], (old: any) => {
        if (!old?.data) return old;

        const filteredData = old.data.filter(
          (q: Question) => q._id !== payload.questionId,
        );

        return { ...old, data: filteredData };
      });
    };

    socket.on("question:created", handleNewQuestion);
    socket.on("question:updated", handleQuestionUpdated);
    socket.on("question:deleted", handleQuestionDeleted);

    return () => {
      socket.off("question:created", handleNewQuestion);
      socket.off("question:updated", handleQuestionUpdated);
      socket.off("question:deleted", handleQuestionDeleted);
    };
  }, [socket, queryClient]);

  const handleDelete = (questionId: string) => {
    setQuestionToDelete(questionId);
  };

  const confirmDelete = () => {
    if (!questionToDelete) return;

    deleteQuestion(questionToDelete, {
      onSuccess: () => {
        setQuestionToDelete(null);
      },
    });
  };

  const handleEdit = (question: Question) => {
    setQuestionToEdit(question);
  };

  if (isLoading) return <QuestionCardSkeleton />;

  if (error)
    return (
      <div className="text-center text-destructive p-4">
        Error loading questions
      </div>
    );

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {activeTab === "my" ? "My Questions" : "All Questions"}
          </h1>
          <span className="text-sm text-muted-foreground">
            {filteredQuestions.length} question
            {filteredQuestions.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="text-center text-muted-foreground p-8 bg-muted/30 rounded-lg border border-dashed">
            {activeTab === "my"
              ? "You haven't asked any questions yet. Click 'Ask Question' to get started!"
              : "No questions yet. Be the first to ask!"}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question: Question) => (
              <QuestionCard
                key={question._id}
                question={question}
                currentUserId={currentUserId}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!questionToDelete}
        onOpenChange={(open) => !open && setQuestionToDelete(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      {/* Edit Question Dialog */}
      {questionToEdit && (
        <EditQuestionDialog
          question={questionToEdit}
          open={!!questionToEdit}
          onOpenChange={(open) => !open && setQuestionToEdit(null)}
        />
      )}
    </>
  );
};
