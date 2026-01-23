import mongoose from "mongoose";
import {
   sendVerificationEmail,
   sendWelcomeEmail,
   sendPasswordResetEmail,
   resetPasswordSuccessEmail,
} from "../mailtrap/email.service.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary, { deleteFromCloudinary } from "../utils/cloudinary.js";
import { generateVerificationToken } from "../utils/generateVerificationTokenAndSetCookies.js";
import {
   accessCookieOptions,
   refreshCookieOptions,
} from "../types/cookies.types.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const adminTest = asyncHandler(async (req, res) => {
   const user = await User.find()
   return res.status(200).json(new ApiResponse(200, "This is admin", user))
})

export const signup = asyncHandler(async (req, res) => {
   const { username, email, password, fullName } = req.body;
   
   try {

      if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
         throw new ApiError(400, "All the fields are required");
      }

      const existedUser = await User.findOne({
         $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
      });
      
      if (existedUser) {
         throw new ApiError(409, "User with email or username already exists");
      }

      const avatarLocalPath = req.file?.path;
      if (!avatarLocalPath) {
         throw new ApiError(400, "Profile Image is required");
      }

      const avatarImage = await uploadOnCloudinary(avatarLocalPath);
      if (!avatarImage || !avatarImage.url) {
         throw new ApiError(500, "Image upload failed");
      }
      const verificationToken = generateVerificationToken();
      if (!verificationToken) {
         throw new ApiError(500, "Verification token generation failed");
      }

      const user = await User.create({
         username: username.toLowerCase(),
         fullName,
         email: email.toLowerCase(),
         password,
         avatar: avatarImage.url,
         avatarPublicId: avatarImage.public_id,
         verificationToken,
         verificationTokenExpiry: Date.now() + 60 * 60 * 1000,
      });

      const createdUser = await User.findById(user._id).select(
         "-password -refreshToken"
      );
      await sendVerificationEmail(user.email, verificationToken);

      return res
         .status(201)
         .json(
            new ApiResponse(201, "User registered successfully. Please verify your email.", createdUser)
         );
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
      throw new ApiError(400, message);
   }
});

export const verifyEmail = asyncHandler(async (req, res) => {
   const { code } = req.body;

   if (!code) {
      throw new ApiError(400, "Verification code is required");
   }

   try {
      const user = await User.findOne({
         verificationToken: code,
         verificationTokenExpiry: { $gt: Date.now() },
      }).select("-password -refreshToken");

      if (!user) {
         throw new ApiError(400, "Invalid or expired verification token");
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
      await user.save();

      await sendWelcomeEmail(user.email, user.fullName);

      return res
         .status(200)
         .json(new ApiResponse(200, "Email verified successfully.", user));
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
      throw new ApiError(400, message);
   }
});

const generateAccessAndRefreshToken = async (userId: mongoose.Types.ObjectId) => {
   try {
      const user = await User.findById(userId);

      if (!user) {
         throw new ApiError(404, "User not found while generating tokens");
      }

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
   } catch (error) {
      throw new ApiError(
         500,
         "Something went wrong while generating access and refresh token"
      );
   }
};

export const login = asyncHandler(async (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
   }

   const user = await User.findOne({ email: email.toLowerCase() });
   if (!user) {
      throw new ApiError(401, "Invalid credentials");
   }

   if (!user.isVerified) {
      throw new ApiError(403, "Please verify your email before logging in");
   }

   const isPasswordValid = await user.isPasswordCorrect(password);
   if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
   }

   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

   user.lastLogin = new Date();
   await user.save({ validateBeforeSave: false });

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   return res
      .status(200)
      .cookie("accessToken", accessToken, accessCookieOptions as any)
      .cookie("refreshToken", refreshToken, refreshCookieOptions as any)
      .json(
         new ApiResponse(200, "User logged in successfully", {
            user: loggedInUser,
            accessToken,
            refreshToken
         })
      );
});

export const forgotPassword = asyncHandler(async (req, res) => {
   const { email } = req.body;

   if (!email) {
      throw new ApiError(400, "Email is required");
   }

   const user = await User.findOne({ email: email.toLowerCase() });
   if (!user) {
      throw new ApiError(404, "User not found");
   }

   const resetToken = crypto.randomBytes(32).toString("hex");
   const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

   user.resetPasswordToken = resetToken;
   user.resetPasswordTokenExpiry = resetTokenExpiry;
   await user.save({ validateBeforeSave: false });

   const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;
   await sendPasswordResetEmail(user.email, resetUrl);

   return res
      .status(200)
      .json(new ApiResponse(200, "Password reset link sent to your email", {}));
});

export const resetPassword = asyncHandler(async (req, res) => {
   const { token, password } = req.body;

   if (!password || !token) {
      throw new ApiError(400, "Password and token are required");
   }

   if (password.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters long");
   }

   const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: Date.now() },
   });

   if (!user) {
      throw new ApiError(400, "Invalid or expired reset token");
   }

   user.password = password;
   user.resetPasswordToken = undefined;
   user.resetPasswordTokenExpiry = undefined;
   await user.save();

   await resetPasswordSuccessEmail(user.email);

   return res
      .status(200)
      .json(new ApiResponse(200, "Password reset successfully", {}));
});

export const logout = asyncHandler(async (req, res) => {
   const userId = req.user?._id;
   
   if (!userId) {
      throw new ApiError(401, "Unauthorized: User not found");
   }

   await User.findByIdAndUpdate(
      userId,
      { $unset: { refreshToken: 1 } },
      { new: true }
   );

   return res
      .status(200)
      .clearCookie("accessToken", accessCookieOptions as any)
      .clearCookie("refreshToken", refreshCookieOptions as any)
      .json(new ApiResponse(200, "User logged out successfully", {}));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
   const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

   if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is required");
   }

   const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
   if (!refreshTokenSecret) {
      throw new ApiError(500, "Refresh token secret not configured");
   }

   try {
      const decodedToken = jwt.verify(incomingRefreshToken, refreshTokenSecret) as jwt.JwtPayload;
      
      const user = await User.findById(decodedToken._id);

      if (!user) {
         throw new ApiError(401, "Invalid refresh token");
      }

      if (incomingRefreshToken !== user.refreshToken) {
         throw new ApiError(401, "Refresh token is expired or has been used");
      }

      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

      return res
         .status(200)
         .cookie("accessToken", accessToken, accessCookieOptions as any)
         .cookie("refreshToken", refreshToken, refreshCookieOptions as any)
         .json(
            new ApiResponse(200, "Access token refreshed successfully", {
               accessToken,
               refreshToken
            })
         );
   } catch (error) {
      throw new ApiError(401, "Invalid or expired refresh token");
   }
});
