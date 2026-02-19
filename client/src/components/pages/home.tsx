import { Link } from "@tanstack/react-router";
import { useGetFiles } from "@/server/api/files/useGetFolderFiles";
import {
  FileText,
  Upload,
  MessageSquare,
  FolderOpen,
  TrendingUp,
  Clock,
  Star,
  Plus,
  ArrowRight,
  User,
  Settings,
  FileEdit,
  Cloud,
} from "lucide-react";
import { getTimeAgo } from "@/utils/timeUtils";

export const Dashboard = () => {
  // Get recent files
  const { data: filesData } = useGetFiles(null);
  const files = filesData?.data?.files || [];
  const recentFiles = files.slice(0, 5);

  // Calculate stats
  const totalFiles = files.length;
  const markdownFiles = files.filter(
    (f: { type: string }) => f.type === "md",
  ).length;
  const docxFiles = files.filter(
    (f: { type: string }) => f.type === "docx",
  ).length;
  const pdfFiles = files.filter(
    (f: { type: string }) => f.type === "pdf",
  ).length;

  // Quick action cards
  const quickActions = [
    {
      title: "Create Note",
      description: "Start writing a new markdown note",
      icon: FileText,
      link: "/dashboard/notes",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
    },
    {
      title: "Upload Files",
      description: "Upload documents and resources",
      icon: Upload,
      link: "/dashboard/resources",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      title: "Ask Question",
      description: "Get help from the community",
      icon: MessageSquare,
      link: "/dashboard/questions",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
    },
    {
      title: "Browse Folders",
      description: "Organize your resources",
      icon: FolderOpen,
      link: "/dashboard/resources",
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
    },
  ];

  // Stats cards
  const stats = [
    {
      label: "Total Files",
      value: totalFiles,
      icon: FileEdit,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Markdown Notes",
      value: markdownFiles,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      label: "Documents",
      value: docxFiles,
      icon: FileEdit,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      label: "PDFs",
      value: pdfFiles,
      icon: Cloud,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "md":
        return FileText;
      case "docx":
        return FileEdit;
      case "pdf":
        return Cloud;
      default:
        return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            Welcome Back! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's what's happening with your workspace today
          </p>
        </div>

        {/* Stats Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="
        group relative overflow-hidden
        bg-card border border-border rounded-2xl p-5
        hover:shadow-lg hover:-translate-y-0.5
        transition-all duration-200
        animate-scale-in
      "
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Subtle corner glow on hover */}
              <div
                className={`
          pointer-events-none absolute -top-6 -right-6 w-24 h-24
          rounded-full blur-2xl opacity-0 group-hover:opacity-40
          transition-opacity duration-500 ${stat.bgColor}
        `}
              />

              {/* Top row: icon + label + trending badge — all inline, no justify-between */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>

                <h2 className="text-sm font-medium text-muted-foreground flex-1">
                  {stat.label}
                </h2>

                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                </div>
              </div>

              {/* Value */}
              <h3 className="text-3xl font-bold text-foreground tracking-tight leading-none">
                {stat.value}
              </h3>

              {/* Bottom accent line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-[2px] ${stat.bgColor} opacity-50`}
              />
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-in">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="
                  group
                  bg-card border border-border rounded-xl p-6
                  hover:shadow-xl transition-all duration-300
                  hover-lift
                  cursor-pointer
                  animate-slide-in-left
                "
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`
                  w-12 h-12 rounded-lg ${action.color}
                  flex items-center justify-center mb-4
                  transition-transform group-hover:scale-110
                `}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {action.description}
                </p>
                <div className="flex items-center text-sm text-blue-600 font-medium">
                  <span>Get started</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity & Quick Links Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Recent Files */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Recent Files
              </h2>
              <Link
                to="/dashboard/resources"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentFiles.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No files yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start by creating a note or uploading a file
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    to="/dashboard/notes"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Note
                  </Link>
                  <Link
                    to="/dashboard/resources"
                    className="px-4 py-2 bg-accent text-foreground rounded-lg hover:bg-accent/80 transition-colors"
                  >
                    Upload File
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {recentFiles.map((file: any, index: number) => {
                  const FileIcon = getFileIcon(file.type);
                  return (
                    <Link
                      key={file._id}
                      to="/dashboard/resources"
                      className="
                        flex items-center gap-4 p-4
                        bg-accent/50 hover:bg-accent
                        rounded-lg transition-all duration-200
                        hover-lift
                        group
                      "
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                        <FileIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate group-hover:text-blue-600 transition-colors">
                          {file.fileName}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{getTimeAgo(file.updatedAt)}</span>
                          <span>•</span>
                          <span className="uppercase text-xs">{file.type}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Quick Links
            </h2>
            <div className="space-y-3">
              <Link
                to="/dashboard/notes"
                className="
                  flex items-center gap-3 p-3
                  rounded-lg hover:bg-accent
                  transition-colors group
                "
              >
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <span className="flex-1 font-medium text-foreground group-hover:text-blue-600 transition-colors">
                  Study Notes
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/dashboard/resources"
                className="
                  flex items-center gap-3 p-3
                  rounded-lg hover:bg-accent
                  transition-colors group
                "
              >
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <FolderOpen className="w-4 h-4 text-green-600" />
                </div>
                <span className="flex-1 font-medium text-foreground group-hover:text-green-600 transition-colors">
                  Resources
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/dashboard/questions"
                className="
                  flex items-center gap-3 p-3
                  rounded-lg hover:bg-accent
                  transition-colors group
                "
              >
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                </div>
                <span className="flex-1 font-medium text-foreground group-hover:text-purple-600 transition-colors">
                  Q&A Forum
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/dashboard/profile"
                className="
                  flex items-center gap-3 p-3
                  rounded-lg hover:bg-accent
                  transition-colors group
                "
              >
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <User className="w-4 h-4 text-orange-600" />
                </div>
                <span className="flex-1 font-medium text-foreground group-hover:text-orange-600 transition-colors">
                  My Profile
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/dashboard/settings"
                className="
                  flex items-center gap-3 p-3
                  rounded-lg hover:bg-accent
                  transition-colors group
                "
              >
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900/30">
                  <Settings className="w-4 h-4 text-gray-600" />
                </div>
                <span className="flex-1 font-medium text-foreground group-hover:text-gray-600 transition-colors">
                  Settings
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Pro Tip: Organize Your Workflow
              </h3>
              <p className="text-muted-foreground mb-4">
                Use folders to organize your files, create markdown notes for
                quick thoughts, and upload documents for long-term storage. You
                can edit both markdown and Word documents directly in your
                browser!
              </p>
              <Link
                to="/dashboard/resources"
                className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Start Organizing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
