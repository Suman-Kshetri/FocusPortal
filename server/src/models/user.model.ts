import bcrypt from "bcryptjs";
import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import { UserDocument } from "../types/auth.types.js";

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
    verificationToken: String,
    verificationTokenExpiry: Date,
    refreshToken: String,
},{timestamps: true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password") || !this.password)
        return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

userSchema.methods.isPasswordCorrect = async function(this, password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function(this){
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const expiry = process.env.ACCESS_TOEKN_EXPIRY;
    if(!secret || !expiry){
        throw new Error("Access token or access token expiry not defined in enviroment variables ");
    }
    const payload = {
        _id: this._id,
        email: this.email,
        username: this.username
    }
    return jwt.sign(payload, secret, expiry)
}
userSchema.methods.generateRefreshToken = async function(this){
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const expiry = process.env.REFRESH_TOEKN_EXPIRY;
    if(!secret || !expiry){
        throw new Error("Access token or access token expiry not defined in enviroment variables ");
    }
    const payload = {
        _id: this._id,
    }
    return jwt.sign(payload, secret, expiry)
}


export const User =  mongoose.model<UserDocument>('User', userSchema);
