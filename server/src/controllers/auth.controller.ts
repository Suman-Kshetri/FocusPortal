import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

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
      const user = await User.create({
         username: username.toLowerCase(),
         fullName,
         email,
         password,
         avatar: avatarImage.url,
      });
      const createdUser = await User.findOne({ _id: user._id }).select("-password -refreshToken");
      return res
         .status(201)
         .json(
            new ApiResponse(200, "User Registered Sucessfully", createdUser)
         );
   } catch (error) {
      throw new ApiError(400, error.message);
   }
});

export const login = asyncHandler(async (req, res) => {
   res.send("login Route");
});

export const logout = asyncHandler(async (req, res) => {
   res.send("logout Route");
});
