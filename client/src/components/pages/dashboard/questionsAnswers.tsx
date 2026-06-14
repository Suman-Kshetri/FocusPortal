import { CreateQuestions } from "@/components/dialog/create-question-dialog";
import { Award, RotateCw } from "lucide-react";
import { StatsSkeleton } from "@/components/skeleton/StatsSkeleton";
import { useGetStats } from "@/server/api/stats/useGetStats";
import { useGetDetailedStats } from "@/server/api/stats/useGetStats";
import { QuestionsFeed } from "./questions/questionFeed";
import TypingCatGif from "@/components/TypingGif";
import { useState } from "react";
import LoadingAnimation from "@/components/other/LoadingAnimation";

export const QuestionsAnswers = () => {
  const { statsData, isLoading, error, refetch } = useGetStats();
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const isFetching = isLoading;

  const { topContributors, isLoading: contributorsLoading } =
    useGetDetailedStats();

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Header Section */}
      <div className="bg-background border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Questions & Answers
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Get help from the community, share your knowledge
            </p>
          </div>
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 items-center justify-center sm:justify-start">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              All Questions
            </button>
            <button
              onClick={() => setActiveTab("my")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap ${
                activeTab === "my"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              My Questions
            </button>
            <div className="relative flex-1 w-full">
              <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2"></div>
            </div>
            <CreateQuestions />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-background/50 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div>
            {isLoading ? (
              <StatsSkeleton />
            ) : error ? (
              <div className="text-xs sm:text-sm text-destructive flex items-center gap-2">
                <span>Error loading statistics</span>
                <button
                  onClick={() => refetch()}
                  className="ml-1 sm:ml-2 px-2 py-0.5 text-xs rounded hover:bg-secondary transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : statsData?.data ? (
              <div className="flex items-center gap-3 sm:gap-6 text-muted-foreground text-xs sm:text-sm">
                <span className="hover:text-foreground transition-colors cursor-default">
                  <strong className="text-foreground">
                    {statsData.data.questions?.toString() ?? 0}
                  </strong>{" "}
                  <span className="hidden sm:inline">Questions</span>
                  <span className="sm:hidden">Q</span>
                </span>
                <span className="hover:text-foreground transition-colors cursor-default">
                  <strong className="text-chart-3">
                    {statsData.data.activeUsers?.toString() ?? 0}
                  </strong>{" "}
                  <span className="hidden sm:inline">Active Users</span>
                  <span className="sm:hidden">Users</span>
                </span>
              </div>
            ) : null}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className={`
              p-1.5 sm:p-2 rounded-lg transition-all duration-200
              ${isFetching ? "bg-primary/10 text-primary" : "hover:bg-secondary text-muted-foreground"}
              disabled:opacity-50
              flex-shrink-0
            `}
            title="Refresh statistics"
          >
            <RotateCw
              className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Questions Feed */}
          <div className="lg:col-span-8">
            <QuestionsFeed activeTab={activeTab} />
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-3 sm:space-y-4">
            {/* Top Contributors Card */}
            <div className="bg-background border border-border rounded-xl p-4 sm:p-5 shadow-sm">
              <h3 className="font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Award className="w-4 h-4 text-primary shrink-0" />
                <span>Top Contributors</span>
              </h3>

              {contributorsLoading ? (
                <p className="text-sm text-muted-foreground flex items-center justify-center">
                  <LoadingAnimation />
                </p>
              ) : !topContributors || topContributors.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No contributors yet
                </p>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {topContributors.slice(0, 5).map((user: any, idx: number) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    >
                      <div className=\"w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 border-card shadow-xl bg-card overflow-hidden shrink-0\">
                        <img src={user.avatar} alt={user.fullName} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">
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
            <div className="bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5">
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
