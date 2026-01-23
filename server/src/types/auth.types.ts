
import { Document, Types } from 'mongoose';

export interface UserDocument extends Document {
  _id: Types.ObjectId;
    username: string;
    email: string;
    role:'user' | 'admin';
    password: string;
    fullName: string;
    avatar: string;
    avatarPublicId: string;
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
export type UserRole = 'user' | 'admin';
