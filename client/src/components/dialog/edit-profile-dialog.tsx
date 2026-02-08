import { useUserUpdateProfile } from "@/server/api/users/updateUserProfile";
import { useGetUserProfile } from "@/server/api/users/usegetUserProfile";
import { Edit2 } from "lucide-react";
import { useEffect, useState } from "react";

const EditProfileDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { onSubmit, isLoading } = useUserUpdateProfile();
  const { userData } = useGetUserProfile();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: "",
    educationLevel: "",
    subjects: "",
  });

  useEffect(() => {
    if (userData.data) {
      setFormData({
        fullName: userData.data.fullName ?? "",
        username: userData.data.username ?? "",
        bio: userData.data.bio ?? "",
        educationLevel: userData.data.educationLevel ?? "",
        subjects: userData.data.subjects?.join(", ") ?? "None",
      });
    }
  }, [userData?.data]);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const payload = {
      fullName: formData.fullName,
      username: formData.username,
      bio: formData.bio,
      educationLevel: formData.educationLevel,
      subjects: formData.subjects
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    console.log(payload);
    onSubmit(payload);
    closeDialog();
  };

  return (
    <div className="relative">
      <button
        onClick={openDialog}
        className="flex items-center mt-6 gap-2 px-5 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-all cursor-pointer"
      >
        <Edit2 className="w-4 h-4" /> Edit Profile
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeDialog} // closes ONLY when clicking backdrop
        >
          <div
            className="bg-background border-2 border-border mt-[1vh] rounded-lg shadow-2xl max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Edit Profile Details
              </h2>
              <button
                onClick={closeDialog}
                className="text-primary hover:text-red-500 cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows={4}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Education Level
                </label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select education level</option>
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Subjects (comma-separated)
                </label>
                <input
                  type="text"
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleChange}
                  placeholder="e.g. Math, Physics, Computer Science"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeDialog}
                className="px-4 py-2 text-foreground bg-secondary rounded-lg hover:bg-accent/80 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition cursor-pointer"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfileDialog;
