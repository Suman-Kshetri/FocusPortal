import mongoose from "mongoose";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { generateVerificationToken } from "../utils/generateVerificationTokenAndSetCookies.js";
import { accessCookieOptions, refreshCookieOptions } from "../types/cookies.types.js";

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

      if(!verificationToken){
         throw new ApiError(500, "Verification token generate failed !!!");
      }
      const user = await User.create({
         username: username.toLowerCase(),
         fullName,
         email,
         password,
         avatar: avatarImage.url,
         verificationToken,
         verificationTokenExpiry: Date.now() + 1 * 60 * 60 * 10000 //1hr
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
      throw new ApiError(400, error.message);
   }
});

export const verifyEmail = asyncHandler(async (req, res) => {
   const {code} = req.body;

   try {
      const user = await User.findOne({
         verificationToken : code,
         verificationTokenExpiry: {$gt: Date.now()}
      }).select("-password -refreshToken")
      if(!user){
         return res
         .status(400)
         .json(new ApiError(400,"Invalid or expired verification token !!!"))
      }
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
      await user.save()
      await sendWelcomeEmail(user.email, user.fullName)

      return res.status(202)
      .json(
         new ApiResponse(202, "Email verified successfully.", user)
      )
   } catch (error) {
      
   }
})

const generateAccessAndRefreshToken = async (userId: mongoose.Types.ObjectId) => {
   try {
      const user = await User.findById(userId);

      if (!user) {
         throw new ApiError(404, "User not found while generating tokens");
      }

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

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
   const {email, password} = req.body;
   if(!email && !password){
      throw new ApiError(400, "Email and Password field both are required!!!");
   }
   const user = await User.findOne({email});
   if(!user){
      throw new ApiError(404, "User doesn't exists")
   }
   const isPasswordalid = await user.isPasswordCorrect(password);
   if(!isPasswordalid){
      throw new ApiError(401, "Invalid user credentials !!!")
   } 
   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
   return res
   .status(200)
   .cookie("accessToken", accessToken, accessCookieOptions)
   .cookie("refreshToken", refreshToken, refreshCookieOptions)
   .json(new ApiResponse(200, "User logged in suggessfully",{
      user: loggedInUser,
      refreshToken,
      accessToken
   }))
});

export const logout = asyncHandler(async (req, res) => {
   const userId = req.user;
});
