import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";

export const verifyJwt = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "");
        if(!token){
            throw new ApiError(401, "Unauthorized request.")
        }
        const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new Error(
        "ACCESS_TOKEN_SECRET is not defined in environment variables"
      );
    }
  
    const decodedToken = jwt.verify(token, secret) ;
  
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
  
    if(!user) {
      throw new ApiError(401, "Invalid Access Token")
    }
    req.user = user;
    next();
    } catch (error) {
        throw new ApiError(401, "Invalid or expired token.");
    }
})