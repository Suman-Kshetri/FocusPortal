import bcrypt from "bcryptjs";
import mongoose from "mongoose"
import jwt, { SignOptions } from 'jsonwebtoken'
import { UserDocument } from "../types/auth.types.js";
import dotenv from 'dotenv'

dotenv.config();

const userSchema = new mongoose.Schema<UserDocument>({
    username: {
        type:String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type:String,
        required:true,
    },
    avatar: {
        type: String,
        required: true,
    },
    lastLogin: {
        type:Date,
        default: Date.now
    },
    isVerified : {
        type:Boolean,
        default: false
    },
    refreshToken: String,
    verificationToken: String,
    verificationTokenExpiry: Date,
    resetPasswordToken : String,
    resetPasswordTokenExpiry: Date,
},{timestamps: true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password") || !this.password)
        return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

userSchema.methods.isPasswordCorrect = async function(this: any, password: string){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(this){
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const expiry = process.env.ACCESS_TOKEN_EXPIRY;
    if(!secret || !expiry){
        throw new Error("Access token or access token expiry not defined in enviroment variables ");
    }
    const payload = {
        _id: this._id,
        email: this.email,
        username: this.username
    }
    const options: SignOptions = { expiresIn: expiry as jwt.SignOptions['expiresIn'] };
    return jwt.sign(payload, secret as string, options)
}
userSchema.methods.generateRefreshToken = function(this){
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const expiry = process.env.REFRESH_TOKEN_EXPIRY;
    if(!secret || !expiry){
        throw new Error("Refresh token or refresh token expiry not defined in enviroment variables ");
    }
    const payload = {
        _id: this._id,
    }
    const options: SignOptions = { expiresIn: expiry as jwt.SignOptions['expiresIn'] };
    return jwt.sign(payload, secret as string, options)
}

export const User =  mongoose.model<UserDocument>('User', userSchema);
