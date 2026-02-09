export default function LoadingAnimation() {
  return (
    <div className="relative w-10 h-10">
      <div
        className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-ping"
        style={{ animationDuration: "3s" }}
      ></div>
      <div
        className="absolute inset-2 border-4 border-indigo-300 rounded-full animate-ping"
        style={{ animationDuration: "3s", animationDelay: "0.5s" }}
      ></div>
      <div
        className="absolute inset-4 border-4 border-indigo-400 rounded-full animate-ping"
        style={{ animationDuration: "3s", animationDelay: "1s" }}
      ></div>
      <div className="absolute inset-6 bg-indigo-600 rounded-full"></div>
    </div>
  );
}
