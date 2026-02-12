export default function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="text-xl font-medium text-muted-foreground">Loading</div>
      <div className="flex gap-1 mt-3">
        <span
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        />
        <span
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
      </div>
    </div>
  );
}
