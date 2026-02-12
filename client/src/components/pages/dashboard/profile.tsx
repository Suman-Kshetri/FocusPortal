import { useEffect, useState } from "react";
import {
  User,
  Mail,
  BookOpen,
  Award,
  MessageSquare,
  Upload,
  Users,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { useGetUserProfile } from "@/server/api/users/usegetUserProfile";
import EditProfileDialog from "@/components/dialog/edit-profile-dialog";
import { AvatarUpload } from "@/components/updateAvatar";
import { useGetDetailedStats } from "@/server/api/stats/useGetStats";
import { TopContributors } from "@/components/other/TopContrubutors";

export const Profile = () => {
  const { userData, isLoading, error } = useGetUserProfile();
  const {
    stats,
    topContributors,
    isLoading: statsLoading,
  } = useGetDetailedStats();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (userData) {
      setUser(userData.data);
    }
  }, [userData]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  if (error || !user)
    return (
      <div className="flex items-center justify-center min-h-screen text-destructive">
        Error loading profile
      </div>
    );

  const getBadges = () => {
    const badges = [];
    if (user.questionsAsked >= 10)
      badges.push({
        name: "Curious Mind",
        icon: "🤔",
        color: "bg-blue-100 text-blue-800",
      });
    if (user.answersGiven >= 50)
      badges.push({
        name: "Helpful Expert",
        icon: "🎓",
        color: "bg-green-100 text-green-800",
      });
    if (user.resourcesUploaded >= 20)
      badges.push({
        name: "Content Creator",
        icon: "📚",
        color: "bg-purple-100 text-purple-800",
      });
    if (user.points >= 1000)
      badges.push({
        name: "Super Student",
        icon: "⭐",
        color: "bg-yellow-100 text-yellow-800",
      });
    return badges;
  };

  const badges = getBadges();

  const displaySubjects =
    user.subjects?.length && user.subjects[0] !== "None"
      ? user.subjects
      : ["Mathematics", "Physics", "Computer Science"];

  const displayEducation =
    user.educationLevel && user.educationLevel !== "None"
      ? user.educationLevel
      : "Not Set";

  const displayBio =
    user.bio && user.bio !== "Not Set" ? user.bio : "No bio available";

  const getUserRank = () => {
    if (!topContributors || topContributors.length === 0) return "N/A";
    const rank = topContributors.findIndex((c: any) => c._id === user._id);
    return rank !== -1 ? `#${rank + 1}` : "Unranked";
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="h-40 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/70 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full border-2 border-card shadow-xl bg-card overflow-hidden">
                <AvatarUpload src={user.avatar} alt={user.fullName} />
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                      {user.fullName}
                    </h1>
                    <p className="text-xl text-muted-foreground mb-2">
                      @{user.username}
                    </p>
                    <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                      <Mail className="w-5 h-5" />
                      <span className="text-sm">{user.email}</span>
                    </div>

                    {/* Rank Badge */}
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        Rank: {getUserRank()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <EditProfileDialog />
                  </div>
                </div>
              </div>
            </div>

            {badges.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </h3>
                <div className="flex flex-wrap gap-3">
                  {badges.map((badge, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${badge.color}`}
                    >
                      <span className="text-lg">{badge.icon}</span>
                      {badge.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Information + Community Stats */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-3xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <User className="w-6 h-6" />
                  Profile Information
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-accent/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">Bio</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-7">
                    {displayBio}
                  </p>
                </div>

                <div className="bg-accent/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">
                      Education Level
                    </h3>
                  </div>
                  <p className="text-muted-foreground pl-7 capitalize">
                    {displayEducation}
                  </p>
                </div>

                {/* Subjects */}
                <div className="bg-accent/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">
                      Subjects of Interest
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3 pl-7">
                    {displaySubjects.map((subject: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium transition-all duration-200 hover:bg-accent/80"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Overview Stats */}
            {!statsLoading && stats?.overview && (
              <div className="bg-card border border-border rounded-3xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Platform Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <PlatformStatCard
                    icon={<MessageSquare className="w-6 h-6" />}
                    color="bg-blue-100"
                    label="Total Questions"
                    value={stats.overview.questions ?? 0}
                  />
                  <PlatformStatCard
                    icon={<Users className="w-6 h-6" />}
                    color="bg-purple-100"
                    label="Active Users"
                    value={stats.overview.activeUsers ?? 0}
                  />
                  <PlatformStatCard
                    icon={<Users className="w-6 h-6" />}
                    color="bg-yellow-100"
                    label="Total Members"
                    value={stats.overview.totalUsers ?? 0}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Community Stats + Top Contributors */}
          <div className="space-y-6">
            {/* User Stats */}
            <div className="bg-card border border-border rounded-2xl shadow-lg p-6 space-y-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center gap-4">
                <Award className="w-6 h-6 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Your Stats
                </h2>
              </div>

              <div className="space-y-4">
                <StatCard
                  icon={<Award className="w-5 h-5 text-yellow-600" />}
                  color="bg-yellow-100"
                  label="Total Points"
                  value={user.points}
                />
                <StatCard
                  icon={<MessageSquare className="w-5 h-5 text-blue-600" />}
                  color="bg-blue-100"
                  label="Questions Asked"
                  value={user.questionsAsked}
                />
                <StatCard
                  icon={<Upload className="w-5 h-5 text-purple-600" />}
                  color="bg-purple-100"
                  label="Resources Shared"
                  value={user.resourcesUploaded}
                />
              </div>
            </div>

            {/* Top Contributors - Now using the component */}
            <TopContributors
              contributors={topContributors || []}
              isLoading={statsLoading}
              maxDisplay={5}
              currentUserId={user._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, color, label, value }: any) => (
  <div
    className={`flex items-start gap-4 rounded-xl px-4 py-3 ${color} flex-nowrap transition-all duration-200 hover:scale-105`}
  >
    <div className="w-8 h-8 rounded-lg flex items-center justify-center mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-700 font-medium">{label}</p>
      <p className="text-gray-800 text-lg font-bold">{value}</p>
    </div>
  </div>
);

const PlatformStatCard = ({ icon, color, label, value }: any) => (
  <div
    className={`rounded-xl ${color} p-6 text-center transition-all duration-200 hover:scale-105`}
  >
    <div className="flex justify-center mb-3 text-gray-700">{icon}</div>
    <p className="text-sm text-gray-600 mb-2 font-medium">{label}</p>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);
