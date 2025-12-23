import mongoose from "mongoose";
import {
   sendVerificationEmail,
   sendWelcomeEmail,
   sendPasswordResetEmail,
   resetPasswordSuccessEmail,
} from "../mailtrap/email.js";
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

export const signup = asyncHandler(async (req, res) => {
   const { username, email, password, fullName } = req.body;
   try {
      if (
         [fullName, email, username, password].some(
            (field) => field?.trim() === ""
         )
      ) {
         throw new ApiError(400, "All the fields are required");
      }
      const existedUser = await User.findOne({
         $or: [{ username }, { email }],
      });
      if (existedUser) {
         throw new ApiError(401, "User already exists !!");
      }
      const avatarLocalPath = req.file?.path;
      console.log("avatarLocalPath:", avatarLocalPath);
      if (!avatarLocalPath) {
         throw new ApiError(400, "Profile Image is required");
      }
      const avatarImage = await uploadOnCloudinary(avatarLocalPath);
      if (!avatarImage || !avatarImage.url) {
         throw new ApiError(500, "Image upload failed");
      }
      const verificationToken = generateVerificationToken();

      if (!verificationToken) {
         throw new ApiError(500, "Verification token generate failed !!!");
      }
      const user = await User.create({
         username: username.toLowerCase(),
         fullName,
         email,
         password,
         avatar: avatarImage.url,
         verificationToken,
         verificationTokenExpiry: Date.now() + 1 * 60 * 60 * 10000, //1hr
      });
      const createdUser = await User.findOne({ _id: user._id }).select(
         "-password -refreshToken"
      );

      await sendVerificationEmail(user.email, verificationToken);
      return res
         .status(201)
         .json(
            new ApiResponse(201, "User Registered Sucessfully", createdUser)
         );
   } catch (error) {
      const message =
         error instanceof Error ? error.message : String(error ?? "Unknown error");
      throw new ApiError(400, message);
   }
});

export const verifyEmail = asyncHandler(async (req, res) => {
   const { code } = req.body;

   try {
      const user = await User.findOne({
         verificationToken: code,
         verificationTokenExpiry: { $gt: Date.now() },
      }).select("-password -refreshToken");
      if (!user) {
         return res
            .status(400)
            .json(
               new ApiError(400, "Invalid or expired verification token !!!")
            );
      }
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
      await user.save();
      await sendWelcomeEmail(user.email, user.fullName);

      return res
         .status(202)
         .json(new ApiResponse(202, "Email verified successfully.", user));
   } catch (error) {}
});

const generateAccessAndRefreshToken = async (
   userId: mongoose.Types.ObjectId
) => {
   try {
      const user = await User.findById(userId);

      if (!user) {
         throw new ApiError(404, "User not found while generating tokens");
      }

      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();

      //save refresh token to db
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
   } catch (error) {
      throw new ApiError(
         503,
         "Something went wrong while generating access and refresh token"
      );
   }
};

export const login = asyncHandler(async (req, res) => {
   const { email, password } = req.body;
   if (!email && !password) {
      throw new ApiError(400, "Email and Password field both are required!!!");
   }
   const user = await User.findOne({ email });
   if (!user) {
      throw new ApiError(404, "User doesn't exists");
   }
   const isPasswordalid = await user.isPasswordCorrect(password);
   if (!isPasswordalid) {
      throw new ApiError(401, "Invalid user credentials !!!");
   }
   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
   );
   const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );
   return res
      .status(200)
      .cookie("accessToken", accessToken, accessCookieOptions as any)
      .cookie("refreshToken", refreshToken, refreshCookieOptions as any)
      .json(
         new ApiResponse(200, "User logged in suggessfully", {
            user: loggedInUser,
         })
      );
});

export const forgotPassword = asyncHandler(async (req, res) => {
   const { email } = req.body;
   const user = await User.findOne({ email });
   if (!user) {
      throw new ApiError(404, "User not found!!");
   }
   const resetToken = crypto.randomBytes(20).toString("hex");
   const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000);
   user.resetPasswordToken = resetToken;
   user.resetPasswordTokenExpiry = resetTokenExpiry;
   await user.save();
   const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
   await sendPasswordResetEmail((await user).email, resetUrl);
   return res
      .status(200)
      .json(new ApiResponse(200, "Reset Password link send to your email", {}));
});

export const resetPassword = asyncHandler(async (req, res) => {
   const { token } = req.params;
   const { password } = req.body;
   const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: Date.now() },
   });
   if (!user) {
      throw new ApiError(403, "Ivalid or expired reset token !!");
   }
   user.password = password;
   user.resetPasswordToken = undefined;
   user.resetPasswordTokenExpiry = undefined;
   await user.save();
   if (!user.email) {
      throw new ApiError(400, "User not authenticated!!!");
   }
   resetPasswordSuccessEmail(user.email);
   return res
      .status(200)
      .json(new ApiResponse(200, "Password reset successfully.", {}));
});

export const logout = asyncHandler(async (req, res) => {
   const userId = req.user;
   if (!userId) {
      throw new ApiError(401, "Unauthorized: User not Found");
   }

   await User.findByIdAndUpdate(
      req.user._id,
      { $set: { refreshToken: undefined } },
      { new: true }
   );
   return res
      .status(200)
      .clearCookie("accessToken", accessCookieOptions as any)
      .clearCookie("refreshToken", refreshCookieOptions as any)
      .json(new ApiResponse(200, "User Logged Out Successfully", {}));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
   const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
   if (!incomingRefreshToken) {
      throw new ApiError(404, "Unauthorized request");
   }
   const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
   if (!refreshTokenSecret) {
      throw new ApiError(
         401,
         "RrefreshToken secret not found in environment variable"
      );
   }
   try {
      const decodedToken = jwt.verify(incomingRefreshToken, refreshTokenSecret) as jwt.JwtPayload;
      const user = await User.findById(decodedToken._id);

      if (!user) {
         throw new ApiError(401, "Invalid Refresh Token");
      }
      if (incomingRefreshToken !== user?.refreshToken) {
         throw new ApiError(402, "Refresh Token is Expired or Used");
      }

      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
         user._id
      );

      res.status(200)
         .cookie("accessToken", accessToken, accessCookieOptions as any)
         .cookie("refreshToken", refreshToken, refreshCookieOptions as any)
         .json(
            new ApiResponse(200, "Access Token Refreshed Successfully", {})
         );
   } catch (error) {
      throw new ApiError(401, "Invalid refresh Token");
   }
});

export const getUserProfile = asyncHandler(async (req, res) => {
   return res
      .status(200)
      .json(
         new ApiResponse(200, "User profile fetched sucessfully.", req.user)
      );
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
   const { oldPassword, newPassword } = req.body;
   const currentUser = req.user;
   if (!currentUser) {
      throw new ApiError(403, "Unauthorized access !!!");
   }
   const user = await User.findById(currentUser._id);
   if (!user) {
      throw new ApiError(401, "Invalid User");
   }
   const isPasswordCorrect = await user?.isPasswordCorrect(oldPassword);
   if (!isPasswordCorrect) {
      throw new ApiError(400, "Incorrect current password !!");
   }
   user.password = newPassword;
   await user.save({ validateBeforeSave: false });

   return res
      .status(200)
      .json(new ApiResponse(200, "Password changed successfully", {}));
});

export const updateUserDetails = asyncHandler(async (req, res) => {
   const { fullName, email, username } = req.body;
   if (!fullName || !email || !username) {
      throw new ApiError(400, "All fields are required !!");
   }
   const currentUser = req.user;
   if (!currentUser) {
      throw new ApiError(403, "Unauthorized access !!");
   }
   const user = await User.findByIdAndUpdate(
      currentUser._id,
      {
         $set: {
            fullName: fullName,
            email: email,
            username: username,
         },
      },
      {
         new: true,
      }
   ).select("-password -refreshToken");
   return res
      .status(200)
      .json(
         new ApiResponse(200, "Account Details Updated Successfully", user)
      );
});


export const updateUserAvatar = asyncHandler(async(req, res) => {
   const avatarLocalPath = req.file?.path;
   if(!avatarLocalPath){
      throw new ApiError(400, "Avatar file is missing");
   }
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   if(!avatar){
      throw new ApiError(500, "Error while uploading to cloudinary !!")
   }
   const currentUser = req.user;
   if(!currentUser){
      throw new ApiError(403, "Unauthorized access !!");
   }
   await deleteFromCloudinary(currentUser.avatarPublicId)
   const user = await User.findByIdAndUpdate(currentUser._id,
      {
         $set: {
            avatar: avatar.url
         }
      },
      {new:true}
   ).select("-password -refreshToken");
   return res
  .status(200)
  .json(
    new ApiResponse(200, "User Profile picture changed successfully",user)
  )
})

export const deleteUserAccount = asyncHandler(async(req, res) => {
   const currentUser = req.user;
   const {confirmation} = req.body;
   if(!currentUser){
    throw new ApiError(403, "Unauthorized access !!")
  }
  const expected = `delete ${currentUser.username} account`;
   if (confirmation !== expected) {
    throw new ApiError(400, "Confirmation text does not match");
  }
  const user = await User.findById(currentUser._id);
  if(!user){
   throw new ApiError(403,"User not found !!");
  }
  if(user.avatar){
   try{
      await deleteFromCloudinary(user.avatar);
   }
   catch(err){
      console.error(`Error deleting avatar from cloudinary`, err);
   }
  }
  await User.findByIdAndDelete(user._id);
  return res
  .status(200)
  .json(
    new ApiResponse(200, "User Account deleted successfully", {})
  )
})