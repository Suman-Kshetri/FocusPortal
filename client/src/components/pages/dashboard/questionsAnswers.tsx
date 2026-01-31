import { CreateQuestions } from "@/components/dialog/create-question-dialog";
import { QuestionsFeed } from "./questions/questionFeed";
import { Search, TrendingUp, Clock, Award, Filter } from "lucide-react";
import { useState } from "react";

export const QuestionsAnswers = () => {
  const [activeFilter, setActiveFilter] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    { id: "recent", label: "Recent", icon: Clock },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "top", label: "Top Rated", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section with Search and Create Button */}
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

          {/* Search Bar and Create Button */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions, tags, or topics..."
                className="
                  w-full pl-12 pr-4 py-3.5
                  bg-background border border-border
                  rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  transition-all
                  text-sm
                "
              />
            </div>
            <CreateQuestions />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2
                    rounded-lg font-medium text-sm
                    transition-all flex-shrink-0
                    ${
                      activeFilter === filter.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary text-secondary-foreground hover:bg-accent"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-background/50 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6 text-muted-foreground">
              <span>
                <strong className="text-foreground">1,247</strong> Questions
              </span>
              <span>
                <strong className="text-foreground">3,892</strong> Answers
              </span>
              <span>
                <strong className="text-foreground">892</strong> Active Users
              </span>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Side-by-side layout for desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-8">
            <QuestionsFeed />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-4">
            {/* Top Contributors */}
            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Top Contributors
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Sarah Chen", points: 2840, avatar: "S" },
                  { name: "Alex Kumar", points: 2156, avatar: "A" },
                  { name: "Mike Johnson", points: 1923, avatar: "M" },
                  { name: "Emma Wilson", points: 1745, avatar: "E" },
                ].map((user, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-semibold text-primary-foreground">
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.points} points
                      </p>
                    </div>
                    <div className="text-xl">
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "⭐"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "react", count: 234 },
                  { name: "javascript", count: 189 },
                  { name: "mongodb", count: 156 },
                  { name: "nodejs", count: 143 },
                  { name: "typescript", count: 127 },
                  { name: "docker", count: 98 },
                  { name: "python", count: 87 },
                  { name: "css", count: 76 },
                ].map((tag) => (
                  <button
                    key={tag.name}
                    className="
                      px-3 py-1.5 text-xs
                      bg-secondary hover:bg-accent
                      rounded-full
                      transition-colors
                      flex items-center gap-1.5
                    "
                  >
                    <span className="font-medium">#{tag.name}</span>
                    <span className="text-muted-foreground">{tag.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5">
              <h3 className="font-semibold mb-2 text-primary">💡 Asking Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Be specific and clear in your title</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Include code examples when relevant</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Add appropriate tags</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Show what you've tried</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};