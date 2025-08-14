import { Document, Types } from 'mongoose';

export interface UserFields {
  username: string;
  fullName: string;
  email: string;
  password: string;
  avatar: string;
  lastLogin: Date;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  refreshToken?: string;
  resetPasswordToken?:string,
  resetPasswordTokenExpiry?:Date
}

export interface UserDocument extends Document, UserFields {
   _id: Types.ObjectId;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}