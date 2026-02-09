import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateQuestion } from "@/server/api/questions/useUpdateQuestion";
import type { Question } from "@/types/questionType";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditQuestionDialogProps {
  question: Question;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditQuestionDialog = ({
  question,
  open,
  onOpenChange,
}: EditQuestionDialogProps) => {
  const { mutate: updateQuestion, isPending } = useUpdateQuestion();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: question.title,
      content: question.content,
      tags: question.tags?.join(", ") || "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: question.title,
        content: question.content,
        tags: question.tags?.join(", ") || "",
      });
    }
  }, [open, question, reset]);

  const onSubmit = (data: any) => {
    updateQuestion(
      {
        id: question._id,
        title: data.title,
        content: data.content,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
          : [],
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              {...register("title", { required: "Title is required" })}
              placeholder="What's your question?"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              {...register("content", { required: "Description is required" })}
              placeholder="Provide more details..."
              rows={6}
            />
            {errors.content && (
              <p className="text-sm text-destructive mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Tags (comma-separated)
            </label>
            <Input
              {...register("tags")}
              placeholder="javascript, react, typescript"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
