import { CheckCircle } from "lucide-react";
import type { Question } from "@/types/questionType";
import { getTimeAgo, getStatusColor } from "@/utils/timeUtils";

interface QuestionHeaderProps {
  question: Question;
}

export const QuestionHeader = ({ question }: QuestionHeaderProps) => {
  return (
    <div className="p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
        <img
          src={question.author?.avatar}
          alt={question.author?.fullName || "User avatar"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-sm">
          {question.author?.fullName || "Anonymous"}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <span>{getTimeAgo(question.createdAt)}</span>
          <span>•</span>
          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
            {question.category}
          </span>
          {question.status !== "open" && (
            <>
              <span>•</span>
              <span
                className={`px-2 py-0.5 rounded-full border text-xs font-medium ${getStatusColor(
                  question.status
                )}`}
              >
                {question.status === "answered" && (
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                )}
                {question.status.charAt(0).toUpperCase() +
                  question.status.slice(1)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};