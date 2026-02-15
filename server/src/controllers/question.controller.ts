import { Comment } from "../models/comment.model.js";
import { Question } from "../models/questions.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createQuestions = asyncHandler(async (req, res) => {
   const { title, content, category } = req.body;
   const currentUser = req.user;

   if (!currentUser) {
      throw new ApiError(403, "Unauthorized Access");
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

   const imageUrls = uploadedImages.map((img) => img?.secure_url);

   const question = await Question.create({
      title,
      content,
      category,
      tags,
      images: imageUrls,
      author: currentUser._id,
   });

   await question.populate("author", "fullName email avatar username");
   await User.findByIdAndUpdate(currentUser._id, {
      $inc: {
         questionsAsked: 1,
         points: 5,
      },
   });
   // console.log($&)

   const io = req.app.get("io");

   if (!io) {
      console.error("Socket.IO instance not found on app!");
   } else {
      // console.log($&)

      io.to("questions-feed").emit("question:created", question);
      // console.log($&)

      const room = io.sockets.adapter.rooms.get("questions-feed");
      // console.log($&)
   }

   res.status(201).json(
      new ApiResponse(201, "Question created successfully", question)
   );
});

export const getAllQuestions = asyncHandler(async (req, res) => {
   const questions = await Question.aggregate([
      {
         $sort: { createdAt: -1 },
      },
      {
         //look for the author._id in the users database then created [{"_id": ...., "fullName": ...,}]
         $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
         },
      },
      {
         //converts array to object
         $unwind: "$author",
      },
      {
         $lookup: {
            from: "comments",
            let: { questionId: "$_id" },
            pipeline: [
               {
                  $match: {
                     $expr: {
                        $and: [
                           { $eq: ["$commentableId", "$$questionId"] },
                           { $eq: ["$commentableType", "Question"] },
                        ],
                     },
                  },
               },
            ],
            as: "comments",
         },
      },
      {
         $addFields: {
            commentCount: { $size: "$comments" },
         },
      },

      {
         $project: {
            comments: 0,
            "author.password": 0,
            "author.__v": 0,
         },
      },
   ]);

   res.status(200).json(
      new ApiResponse(200, "Questions fetched successfully", questions)
   );
});

export const questionVote = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { type } = req.body;
   const userId = req.user._id;

   if (!userId) {
      throw new ApiError(403, "Unauthorized access");
   }
   if (!["upvote", "downvote"].includes(type)) {
      throw new ApiError(
         400,
         "Invalid vote type. Must be 'upvote' or 'downvote'"
      );
   }

   const question = await Question.findById(id);
   if (!question) {
      throw new ApiError(404, "Question not found");
   }

   const userIdStr = userId.toString();

   question.upvotedBy = question.upvotedBy.filter(
      (id: string) => id.toString() !== userIdStr
   );
   question.downvotedBy = question.downvotedBy.filter(
      (id: string) => id.toString() !== userIdStr
   );

   if (type === "upvote") {
      question.upvotedBy.push(userId);
   } else if (type === "downvote") {
      question.downvotedBy.push(userId);
   }

   await question.save();

   const payload = {
      questionId: question._id,
      upvotes: question.upvotedBy.length,
      downvotes: question.downvotedBy.length,
   };

   const io = req.app.get("io");
   if (io) {
      io.to("questions-feed").emit("question:voted", payload);
      // console.log($&)
   }

   res.status(200).json(new ApiResponse(200, "Voted successfully", payload));
});

export const removeVote = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const userId = req.user?._id;

   if (!userId) {
      throw new ApiError(403, "Unauthorized access");
   }

   const question = await Question.findById(id);
   if (!question) {
      throw new ApiError(404, "Question not found");
   }

   const userIdStr = userId.toString();

   question.upvotedBy = question.upvotedBy.filter(
      (id: any) => id.toString() !== userIdStr
   );
   question.downvotedBy = question.downvotedBy.filter(
      (id: any) => id.toString() !== userIdStr
   );

   await question.save();

   const payload = {
      questionId: question._id,
      upvotes: question.upvotedBy.length,
      downvotes: question.downvotedBy.length,
      userId: userIdStr,
      action: "remove",
   };

   const io = req.app.get("io");
   if (io) {
      io.to("questions-feed").emit("question:voted", payload);
      // console.log($&)
   }

   res.status(200).json(
      new ApiResponse(200, "Vote removed successfully", payload)
   );
});

export const updateQuestion = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { title, content, tags } = req.body;
   const userId = req.user._id;

   const question = await Question.findById(id);

   if (!question) {
      throw new ApiError(404, "Question not found");
   }
   if (question.author.toString() !== userId.toString()) {
      throw new ApiError(403, "You can only edit your own questions");
   }
   question.title = title || question.title;
   question.content = content || question.content;
   question.tags = tags || question.tags;
   question.updatedAt = Date.now();

   await question.save();

   const updatedQuestion = await question.populate(
      "author",
      "fullName avatar email"
   );

   const io = req.app.get("io");
   if (io) {
      io.emit("question:updated", updatedQuestion);
   }

   return res
      .status(200)
      .json(
         new ApiResponse(200, "Question updated successfully", updatedQuestion)
      );
});

export const deleteQuestion = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const userId = req.user._id;

   const question = await Question.findById(id);

   if (!question) {
      throw new ApiError(404, "Question not found");
   }
   if (question.author.toString() !== userId.toString()) {
      throw new ApiError(403, "You can only delete your own questions");
   }
   await Comment.deleteMany({ questionId: id });
   await Question.findByIdAndDelete(id);
   await User.findByIdAndUpdate(userId, {
      $inc: {
         questionsAsked: -1,
         points: -5,
      },
   });

   const io = req.app.get("io");
   if (io) {
      io.emit("question:deleted", { questionId: id });
   }

   return res
      .status(200)
      .json(new ApiResponse(200, "Question deleted successfully", null));
});
