
export const QuestionCardSkeleton = () => {
  return (
    <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="animate-shimmer">
        <div className="p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r  via-muted/50 to-muted bg-[length:200%_100%]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded w-32" />
            <div className="flex items-center gap-2">
              <div className="h-3 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded w-16" />
              <div className="h-3 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded w-20" />
            </div>
          </div>
        </div>

        <div className="px-4 pb-3 space-y-3">
          <div className="h-5 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded w-full" />
            <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded w-5/6" />
            <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded w-4/6" />
          </div>

          <div className="flex gap-2 pt-2">
            <div className="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded-md w-16" />
            <div className="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded-md w-20" />
            <div className="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded-md w-24" />
          </div>
        </div>

        <div className="px-4 py-2 flex items-center justify-between border-t border-b border-border">
          <div className="flex gap-3">
            <div className="h-3 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded w-16" />
            <div className="h-3 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded w-16" />
          </div>
          <div className="h-3 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded w-20" />
        </div>
        <div className="px-2 py-1 flex items-center justify-around">
          <div className="h-8 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded w-20" />
          <div className="h-8 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded w-20" />
          <div className="h-8 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded w-24" />
          <div className="h-8 bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] rounded w-20" />
        </div>
      </div>
    </div>
  );
};

export const QuestionsFeedSkeleton = () => {
  return (
    <div className="space-y-4">
        <QuestionCardSkeleton/>
    </div>
  );
};