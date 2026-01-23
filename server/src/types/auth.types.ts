import { Document, Types } from "mongoose";

export interface NotificationSettings {
   answers: boolean;
   comments: boolean;
   followers: boolean;
   system: boolean;
}
export type EducationLevel =
    "middle school"
   | "high school"
   | "bachelor's degree"
   | "master's degree"
   | "other"
   | "None";


export interface UserDocument extends Document {
   _id: Types.ObjectId;
   username: string;
   email: string;
   role: UserRole;
   password: string;
   fullName: string;
   avatar: string;
   avatarPublicId: string;
   bio: String;
   educationLevel:EducationLevel;
   subjects: string[];
   points: Number;
   questionsAsked: Number;
   answersGiven: Number;
   resourcesUploaded: Number;
   followers: Types.ObjectId[];
   following: Types.ObjectId[];
   notificationSettings: NotificationSettings;
   lastLogin: Date;
   isVerified: boolean;
   refreshToken?: string;
   verificationToken?: string;
   verificationTokenExpiry?: Date;
   resetPasswordToken?: string;
   resetPasswordTokenExpiry?: Date;
   createdAt: Date;
   updatedAt: Date;
   isPasswordCorrect(password: string): Promise<boolean>;
   generateAccessToken(): string;
   generateRefreshToken(): string;
}
export type UserRole = "user" | "admin";
