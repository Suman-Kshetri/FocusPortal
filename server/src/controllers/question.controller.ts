import { Question } from "../models/questions.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createQuestions = asyncHandler(async (req, res) => {
   const { title, content, category } = req.body;
   const currentUser = req.user;
   if (!currentUser) {
      throw new ApiError(401, "Unauthorized Access");
   }

   if (!title || !content || !category) {
      throw new ApiError(400, "All fields are required");
   }
   let tags: string[] = [];
   if (req.body.tags) {
      try {
         tags = JSON.parse(req.body.tags);
      } catch {
         throw new ApiError(400, "Invalid tags format");
      }
   }

   const files = req.files as Express.Multer.File[] | undefined;
   const imagePaths = files?.map((file) => file.path) || [];
   const uploadedImages = await Promise.all(
      imagePaths.map(async (path) => {
         return await uploadOnCloudinary(path);
      })
   );

   const imageUrls = uploadedImages.map(img => img?.secure_url);

   const question = await Question.create({
      title,
      content,
      category,
      tags,
      images: imageUrls,
      author: currentUser._id,
   });
   res.status(201).json(
      new ApiResponse(201, "Question created successfully", question)
   );
});
