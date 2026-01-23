import bcrypt from "bcryptjs";
import mongoose from "mongoose"
import jwt, { SignOptions } from 'jsonwebtoken'
import { UserDocument } from "../types/auth.types.js";
import dotenv from 'dotenv'

dotenv.config();

const userSchema = new mongoose.Schema<UserDocument>({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        // Remove unique: true - passwords shouldn't be unique
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        required: true,
    },
    avatarPublicId: {
        type: String,
        required: true,
    },
    role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: String,
    verificationToken: String,
    verificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
}, { timestamps: true })

// Hash password before saving
userSchema.pre("save", async function(next) {
    if (!this.isModified("password") || !this.password)
        return next();
    
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

// Compare password method
userSchema.methods.isPasswordCorrect = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

// Generate Access Token (synchronous)
userSchema.methods.generateAccessToken = function(): string {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const expiry = process.env.ACCESS_TOKEN_EXPIRY;
    
    if (!secret || !expiry) {
        throw new Error("Access token secret or expiry not defined in environment variables");
    }
    
    const payload = {
        _id: this._id,
        email: this.email,
        username: this.username
    }
    
    const options: SignOptions = { expiresIn: expiry as jwt.SignOptions['expiresIn'] };
    
    return jwt.sign(payload, secret, options);
}

// Generate Refresh Token (synchronous)
userSchema.methods.generateRefreshToken = function(): string {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const expiry = process.env.REFRESH_TOKEN_EXPIRY;
    
    if (!secret || !expiry) {
        throw new Error("Refresh token secret or expiry not defined in environment variables");
    }
    
    const payload = {
        _id: this._id,
    }
    
    const options: SignOptions = { expiresIn: expiry as jwt.SignOptions['expiresIn'] };
    
    return jwt.sign(payload, secret, options);
}

export const User = mongoose.model<UserDocument>('User', userSchema);
