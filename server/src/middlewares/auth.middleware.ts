import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";

export const verifyJwt = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || 
                     req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(401, "Access token is required");
        }
        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            throw new ApiError(500, "Server configuration error");
        }

        const decodedToken = jwt.verify(token, secret) as jwt.JwtPayload;
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }
        req.user = user;
        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new ApiError(401, "Invalid access token");
        }
        if (error instanceof jwt.TokenExpiredError) {
            throw new ApiError(401, "Access token expired");
        }
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Authentication failed");
    }
});