export type User = {
  data : {_id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  avatar: string;
  avatarPublicId: string;
  bio: string;
  educationLevel: EducationLevel;
  subjects: string[];
  points: number;
  questionsAsked: number;
  answersGiven: number;
  resourcesUploaded: number;
  followers: string[];
  following: string[];
  notificationSettings: NotificationSettings;
  lastLogin: string;
  isVerified: boolean;
  refreshToken?: string;
  verificationToken?: string;
  verificationTokenExpiry?: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: string;
  createdAt: string;
  updatedAt: string;}
};

export type UserRole = "user" | "admin";

export type EducationLevel =
  | "middle school"
  | "high school"
  | "bachelor's degree"
  | "master's degree"
  | "other"
  | "None";

export interface NotificationSettings {
  answers: boolean;
  comments: boolean;
  followers: boolean;
  system: boolean;
}