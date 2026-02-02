import { Question } from "../models/questions.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// Create Question (with Socket.IO)
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

   await question.populate('author', 'fullName email avatar username');

   console.log('Question created, preparing to emit:', question._id);

   // Get Socket.IO instance
   const io = req.app.get('io');
   
   if (!io) {
      console.error('Socket.IO instance not found on app!');
   } else {
      console.log('Socket.IO instance found');
      
      // Emit to questions-feed room
      io.to('questions-feed').emit('question:created', question);
      console.log('Emitted question:created event to questions-feed room');
      
      // Also log how many clients are in the room
      const room = io.sockets.adapter.rooms.get('questions-feed');
      console.log(`Clients in questions-feed room: ${room ? room.size : 0}`);
   }

   res.status(201).json(
      new ApiResponse(201, "Question created successfully", question)
   );
});

export const getAllQuestions = asyncHandler(async (req, res) => {
   const questions = await Question.find()
      .populate('author', 'fullName email avatar username')
      .sort({ createdAt: -1 });

   res.status(200).json(
      new ApiResponse(200, "Questions fetched successfully", questions)
   );
});