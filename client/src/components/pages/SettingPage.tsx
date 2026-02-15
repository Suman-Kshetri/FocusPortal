import { useState, useEffect } from "react";
import {
  Lock,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
  Shield,
  Key,
  CheckCircle,
} from "lucide-react";
import { useChangePassword } from "@/server/api/users/useChangePassword";
import { useDeleteAccount } from "@/server/api/users/useDeleteAccount";
import { userApi } from "@/server/api/users/hooks";

export const SettingsPage = () => {
  // Change Password State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  const { mutateAsync: changePassword, isPending: isChangingPassword } =
    useChangePassword();
  const { mutateAsync: deleteAccount, isPending: isDeletingAccount } =
    useDeleteAccount();
  const expectedConfirmation = `delete ${currentUser?.username || "your"} account`;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userApi.getUserData();
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      await changePassword({ oldPassword, newPassword });
      setPasswordSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 5000);
    } catch (error: any) {
      setPasswordError(
        error.response?.data?.message || "Failed to change password",
      );
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmationText !== expectedConfirmation) {
      return;
    }

    try {
      await deleteAccount({ confirmation: confirmationText });
    } catch (error: any) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account security and preferences
          </p>
        </div>

        {/* Change Password Section */}
        <div className="bg-card border border-border rounded-xl p-6 animate-scale-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                Change Password
              </h2>
              <p className="text-sm text-muted-foreground">
                Update your password to keep your account secure
              </p>
            </div>
          </div>

          {/* Success Message */}
          {passwordSuccess && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Password changed successfully!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Your password has been updated. Please use your new password
                  for future logins.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {passwordError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-900 dark:text-red-100">
                {passwordError}
              </p>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Old Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Key className="w-5 h-5 text-muted-foreground" />
                </div>
                <input
                  type={showOldPassword ? "text" : "password"}
                  value=""
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showOldPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password (min 6 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {newPassword && newPassword.length < 6 && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPassword &&
                newPassword &&
                confirmPassword !== newPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    Passwords do not match
                  </p>
                )}
            </div>

            <button
              type="submit"
              disabled={
                isChangingPassword ||
                !oldPassword ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword ||
                newPassword.length < 6
              }
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isChangingPassword ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Changing Password...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>

        {/* Delete Account Section */}
        <div className="bg-card border border-red-200 dark:border-red-800 rounded-xl p-6 animate-scale-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                Delete Account
              </h2>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">
                  Warning: This action cannot be undone
                </p>
                <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                  <li>• All your files will be permanently deleted</li>
                  <li>• Your folders and organization will be lost</li>
                  <li>• All questions and answers will be removed</li>
                  <li>• You will be immediately logged out</li>
                </ul>
              </div>
            </div>
          </div>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />I Want to Delete My Account
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type{" "}
                  <code className="px-2 py-1 bg-accent rounded text-sm font-semibold">
                    {expectedConfirmation}
                  </code>{" "}
                  to confirm
                </label>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={expectedConfirmation}
                />
                {confirmationText &&
                  confirmationText !== expectedConfirmation && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      Confirmation text doesn't match
                    </p>
                  )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setConfirmationText("");
                  }}
                  disabled={isDeletingAccount}
                  className="flex-1 py-3 bg-accent text-foreground rounded-lg hover:bg-accent/80 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={
                    isDeletingAccount ||
                    confirmationText !== expectedConfirmation
                  }
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isDeletingAccount ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete Forever
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
