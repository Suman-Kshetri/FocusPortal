import { useEffect, useState } from "react";
import {
  User,
  Mail,
  BookOpen,
  Award,
  MessageSquare,
  Upload,
  Users,
  Edit2,
  GraduationCap,
} from "lucide-react";
import { useGetUserProfile } from "@/server/api/users/usegetUserProfile";

export const Profile = () => {
  const { userData, isLoading, error } = useGetUserProfile();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userData) {
      setUser(userData);
      console.log(userData)
    }
  }, [userData]);

  if (isLoading) return <div>Loading...</div>;
  if (error || !user) return <div>Error loading profile</div>;

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
    alert("Edit profile");
    console.log(user);
  };

  // Badges calculation
  const getBadges = () => {
    const badges = [];
    if (user.questionsAsked >= 10)
      badges.push({ name: "Curious Mind", icon: "🤔", color: "bg-blue-100 text-blue-800" });
    if (user.answersGiven >= 50)
      badges.push({ name: "Helpful Expert", icon: "🎓", color: "bg-green-100 text-green-800" });
    if (user.resourcesUploaded >= 20)
      badges.push({ name: "Content Creator", icon: "📚", color: "bg-purple-100 text-purple-800" });
    if (user.points >= 1000)
      badges.push({ name: "Super Student", icon: "⭐", color: "bg-yellow-100 text-yellow-800" });
    return badges;
  };

  const badges = getBadges();

  const displaySubjects =
    user.subjects?.length && user.subjects[0] !== "None"
      ? user.subjects
      : ["Mathematics", "Physics", "Computer Science"];

  const displayEducation =
    user.educationLevel && user.educationLevel !== "None" ? user.educationLevel : "Not Set";

  const displayBio = user.bio && user.bio !== "Not Set" ? user.bio : "No bio available";

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="h-32 bg-linear-to-r from-primary/20 via-accent to-primary/10"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-32 h-32 rounded-full border-4 border-card shadow-xl bg-card"
                />
               </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{user.fullName}</h1>
                    <p className="text-lg text-muted-foreground">@{user.username}</p>
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </div>

                    <button
                      onClick={handleEditProfile}
                      className="flex mt-6 items-center gap-2 px-5 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-all cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </button>
                </div>
              </div>
            </div>

            {badges.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">🏆 Achievements</h3>
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}
                    >
                      <span>{badge.icon}</span>
                      {badge.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Information + Community Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Profile Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">Bio</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-7">{displayBio}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">Education Level</h3>
                  </div>
                  <p className="text-muted-foreground pl-7 capitalize">{displayEducation}</p>
                </div>

                {/* Subjects */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">Subjects of Interest</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-7">
                    {displaySubjects.map((subject: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-card border border-border rounded-xl shadow-sm p-4 space-y-4">
            <div className="flex items-center gap-4">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Community Stats</h2>
            </div>

            <div className="space-y-3">
              <StatCard icon={<Award className="w-4 h-4 text-yellow-600" />} color="bg-yellow-100" label="Total Points" value={user.points} />
              <StatCard icon={<MessageSquare className="w-4 h-4 text-blue-600" />} color="bg-blue-100" label="Questions Asked" value={user.questionsAsked} />
              <StatCard icon={<Users className="w-4 h-4 text-green-600" />} color="bg-green-100" label="Answers Given" value={user.answersGiven} />
              <StatCard icon={<Upload className="w-4 h-4 text-purple-600" />} color="bg-purple-100" label="Resources Shared" value={user.resourcesUploaded} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const StatCard = ({ icon, color, label, value }: any) => (
  <div className={`flex items-start gap-3 rounded-lg px-3 py-2.5 ${color} flex-nowrap`}>
    <div className={`w-7 h-7 rounded-md flex items-center justify-center mt-0.5`}>{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-black text-sm font-semibold">{value}</p>
    </div>
  </div>
);