import type { Question } from "@/types/questionType";

interface QuestionContentProps {
  question: Question;
}

export const QuestionContent = ({ question }: QuestionContentProps) => {
  return (
    <div className="px-4 pb-3">
      <h2 className="text-lg font-bold mb-2">{question.title}</h2>
      <p className="text-muted-foreground text-sm whitespace-pre-wrap">
        {question.content}
      </p>

      {question.tags && question.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {question.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2.5 py-1 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {question.images && question.images.length > 0 && (
        <div
          className={`mt-4 grid gap-2 ${
            question.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {question.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Question image ${index + 1}`}
              className="w-full rounded-lg object-cover max-h-96"
            />
          ))}
        </div>
      )}
    </div>
  );
};