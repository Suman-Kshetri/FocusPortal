import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary, {
   deleteFromCloudinary,
} from "../utils/cloudinary.js";
import {
   accessCookieOptions,
   refreshCookieOptions,
} from "../types/cookies.types.js";
import { UserDocument } from "../types/auth.types.js";
import { Notification } from "../models/notification.model.js";

export const getUserProfile = asyncHandler(async (req, res) => {
   return res
      .status(200)
      .json(
         new ApiResponse(200, "User profile fetched successfully", req.user)
      );
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
   const { oldPassword, newPassword } = req.body;
   const currentUser = req.user;

   if (!oldPassword || !newPassword) {
      throw new ApiError(400, "Both old and new passwords are required");
   }

   if (newPassword.length < 6) {
      throw new ApiError(
         400,
         "New password must be at least 6 characters long"
      );
   }

   if (!currentUser) {
      throw new ApiError(401, "Unauthorized access");
   }

   const user = await User.findById(currentUser._id);
   if (!user) {
      throw new ApiError(404, "User not found");
   }

   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
   if (!isPasswordCorrect) {
      throw new ApiError(400, "Incorrect current password");
   }

   user.password = newPassword;
   await user.save();

   return res
      .status(200)
      .json(new ApiResponse(200, "Password changed successfully", {}));
});

export const updateProfileDetails = asyncHandler(async (req, res) => {
   const { fullName, username, bio, educationLevel, subjects } =
      req.body;

   if (!fullName && !username) {
      throw new ApiError(400, "At least one field is required to update");
   }

   const currentUser = req.user;
   if (!currentUser) {
      throw new ApiError(401, "Unauthorized access");
   }

   // Check if email or username is already taken by another user
   if (username) {
      const existingUser = await User.findOne({
         username: username.toLowerCase(),
         _id: { $ne: currentUser._id },
      });

      if (existingUser) {
         throw new ApiError(409, "Username already in use");
      }
   }

   const updateData: Partial<UserDocument> = {};
   if (fullName) updateData.fullName = fullName;
   if (username) updateData.username = username.toLowerCase();
   if (bio) updateData.bio = bio;
   if (educationLevel) updateData.educationLevel = educationLevel;
   if (subjects) updateData.subjects = subjects;

   const user = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: updateData },
      { new: true }
   ).select("-password -refreshToken");

   return res
      .status(200)
      .json(new ApiResponse(200, "Account details updated successfully", user));
});

export const updateUserAvatar = asyncHandler(async (req, res) => {
   const avatarLocalPath = req.file?.path;

   if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is missing");
   }

   const currentUser = req.user;
   if (!currentUser) {
      throw new ApiError(401, "Unauthorized access");
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath);
   if (!avatar || !avatar.url) {
      throw new ApiError(500, "Error while uploading to Cloudinary");
   }

   if (currentUser.avatarPublicId) {
      try {
         await deleteFromCloudinary(currentUser.avatarPublicId);
      } catch (error) {
         console.error("Error deleting old avatar from Cloudinary:", error);
      }
   }

   const user = await User.findByIdAndUpdate(
      currentUser._id,
      {
         $set: {
            avatar: avatar.url,
            avatarPublicId: avatar.public_id,
         },
      },
      { new: true }
   ).select("-password -refreshToken");

   return res
      .status(200)
      .json(new ApiResponse(200, "Profile picture updated successfully", user));
});

export const deleteUserAccount = asyncHandler(async (req, res) => {
   const currentUser = req.user;
   const { confirmation } = req.body;

   if (!currentUser) {
      throw new ApiError(401, "Unauthorized access");
   }

   const expected = `delete ${currentUser.username} account`;
   if (confirmation !== expected) {
      throw new ApiError(400, "Confirmation text does not match");
   }

   const user = await User.findById(currentUser._id);
   if (!user) {
      throw new ApiError(404, "User not found");
   }

   if (user.avatarPublicId) {
      try {
         await deleteFromCloudinary(user.avatarPublicId);
      } catch (err) {
         console.error("Error deleting avatar from Cloudinary:", err);
      }
   }

   await User.findByIdAndDelete(user._id);

   return res
      .status(200)
      .clearCookie("accessToken", accessCookieOptions as any)
      .clearCookie("refreshToken", refreshCookieOptions as any)
      .json(new ApiResponse(200, "User account deleted successfully", {}));
});

export const followUser = asyncHandler(async (req, res) => {
   try {
      const currentUserId = req.user._id;
      const usernameToFollow = req.params.username;

      const userToFollow = await User.findOne({
         username: usernameToFollow.toLowerCase(),
      });

      if (!userToFollow) {
         throw new ApiError(404, "User not found");
      }

      if (userToFollow._id.equals(currentUserId)) {
         throw new ApiError(400, "You cannot follow yourself");
      }

      if (userToFollow.followers.includes(currentUserId)) {
         throw new ApiError(400, "You are already following this user");
      }

      await User.findByIdAndUpdate(userToFollow._id, {
         $addToSet: { followers: currentUserId },
      });
      await User.findByIdAndUpdate(currentUserId, {
         $addToSet: { following: userToFollow._id },
      });

      if (userToFollow.notificationSettings.followers) {
         await Notification.create({
            user: userToFollow._id,
            type: "followers",
            message: `User ${req.user.username} started following you`,
            relatedId: currentUserId,
         });
      }

      res.status(200).json(
         new ApiResponse(200, `You are now following ${usernameToFollow}`, {})
      );
   } catch (err) {
      throw new ApiError(500, "Error following user");
   }
});
export const unFollowUser = asyncHandler(async (req, res) => {
   const usernameToUnfollow = req.params.username;
   const currentUserId = req.user._id;

   const userToUnfollow = await User.findOne({
      username: usernameToUnfollow.toLowerCase(),
   });
   if (!userToUnfollow) {
      throw new ApiError(404, "User not Found");
   }
   if (userToUnfollow._id.equals(currentUserId)) {
      throw new ApiError(400, "You cannot unfollow yourself");
   }
   if (!userToUnfollow.followers.includes(currentUserId)) {
      throw new ApiError(400, "You are not following this user");
   }
   await User.findByIdAndUpdate(userToUnfollow._id, {
      $pull: { followers: currentUserId },
   });
   await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userToUnfollow._id },
   });
   await Notification.deleteMany({
      user: userToUnfollow._id,
      type: "followers",
      relatedId: currentUserId,
   });
   res.status(200).json(
      new ApiResponse(200, `You have unfollowed ${usernameToUnfollow}`, {})
   );
});
