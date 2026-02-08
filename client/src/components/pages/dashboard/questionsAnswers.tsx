import { CreateQuestions } from "@/components/dialog/create-question-dialog";
import { Award, RotateCw, MessageSquare, Users } from "lucide-react";
import { StatsSkeleton } from "@/components/skeleton/StatsSkeleton";
import { useGetStats } from "@/server/api/stats/useGetStats";
import { useGetDetailedStats } from "@/server/api/stats/useGetStats";
import { QuestionsFeed } from "./questions/questionFeed";
import TypingCatGif from "@/components/TypingGif";

export const QuestionsAnswers = () => {
  const { statsData, isLoading, error, refetch } = useGetStats();
  const isFetching = isLoading;

  const { topContributors, isLoading: contributorsLoading } =
    useGetDetailedStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header Section */}
      <div className="bg-background border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Questions & Answers
            </h1>
            <p className="text-muted-foreground text-lg">
              Get help from the community, share your knowledge
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2"></div>
            </div>
            <CreateQuestions />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-background/50 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            {isLoading ? (
              <StatsSkeleton />
            ) : error ? (
              <div className="text-sm text-destructive flex items-center gap-2">
                <span>Error loading statistics</span>
                <button
                  onClick={() => refetch()}
                  className="ml-2 px-2 py-1 text-xs rounded hover:bg-secondary transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : statsData?.data ? (
              <div className="flex items-center gap-6 text-muted-foreground">
                <span className="hover:text-foreground transition-colors cursor-default">
                  <strong className="text-foreground">
                    {statsData.data.questions?.toString() ?? 0}
                  </strong>{" "}
                  Questions
                </span>
                <span className="hover:text-foreground transition-colors cursor-default">
                  <strong className="text-green-400">
                    {statsData.data.activeUsers?.toString() ?? 0}
                  </strong>{" "}
                  Active Users
                </span>
              </div>
            ) : null}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${isFetching ? "bg-primary/10 text-primary" : "hover:bg-secondary text-muted-foreground"}
              disabled:opacity-50
            `}
            title="Refresh statistics"
          >
            <RotateCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Questions Feed */}
          <div className="lg:col-span-8">
            <QuestionsFeed />
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-4">
            {/* Top Contributors Card */}
            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Top Contributors
              </h3>

              {contributorsLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : !topContributors || topContributors.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No contributors yet
                </p>
              ) : (
                <div className="space-y-3">
                  {topContributors.slice(0, 5).map((user: any, idx: number) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full border-2 border-card shadow-xl bg-card overflow-hidden">
                        <img src={user.avatar} alt={user.fullName} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.points?.toString() ?? 0} points
                        </p>
                      </div>

                      <div className="text-xl">
                        {idx === 0
                          ? "🥇"
                          : idx === 1
                            ? "🥈"
                            : idx === 2
                              ? "🥉"
                              : "⭐"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Tags Card */}
            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
              <TypingCatGif />
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5">
              <h3 className="font-semibold mb-2 text-primary">
                💡 Asking Tips
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span>•</span> Be specific and clear in your title
                </li>
                <li className="flex gap-2">
                  <span>•</span> Include code examples when relevant
                </li>
                <li className="flex gap-2">
                  <span>•</span> Add appropriate tags
                </li>
                <li className="flex gap-2">
                  <span>•</span> Show what you've tried
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
