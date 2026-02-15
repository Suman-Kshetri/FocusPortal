import { Comment } from "../models/comment.model.js";
import { Question } from "../models/questions.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const createComment = asyncHandler(async (req, res) => {
   const { questionId } = req.params;
   const { content } = req.body;
   const userId = req.user?._id;

   if (!userId) {
      throw new ApiError(403, "Unauthorized access");
   }

   if (!content || content.trim().length === 0) {
      throw new ApiError(400, "Comment content is required");
   }

   if (content.length > 500) {
      throw new ApiError(400, "Comment must be 500 characters or less");
   }

   const question = await Question.findById(questionId);
   if (!question) {
      throw new ApiError(404, "Question not found");
   }
   const comment = await Comment.create({
      commentableType: "Question",
      commentableId: questionId,
      author: userId,
      content: content.trim(),
   });
   await comment.populate("author", "fullName email avatar username");

   const payload = {
      comment,
      questionId,
   };

   const io = req.app.get("io");
   if (io) {
      io.to("questions-feed").emit("comment:created", payload);
      // console.log($&)
   }

   res.status(201).json(
      new ApiResponse(201, "Comment created successfully", comment)
   );
});

export const getCommentsByQuestion = asyncHandler(async (req, res) => {
   const { questionId } = req.params;
   const userId = req.user?._id;

   const question = await Question.findById(questionId);
   if (!question) {
      throw new ApiError(404, "Question not found");
   }

   const comments = await Comment.aggregate([
      // Stage 1: Match comments for this question
      {
         $match: {
            commentableType: "Question",
            commentableId: new mongoose.Types.ObjectId(questionId),
         },
      },
      {
         $sort: { createdAt: -1 },
      },
      {
         $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
         },
      },
      {
         $unwind: "$author",
      },
      {
         $addFields: {
            upvotes: {
               $size: {
                  $ifNull: ["$upvotedBy", []],
               },
            },
            downvotes: {
               $size: {
                  $ifNull: ["$downvotedBy", []],
               },
            },
            userVote: {
               $cond: {
                  if: userId,
                  then: {
                     $cond: {
                        if: { $in: [userId, { $ifNull: ["$upvotedBy", []] }] },
                        then: "upvote",
                        else: {
                           $cond: {
                              if: {
                                 $in: [
                                    userId,
                                    { $ifNull: ["$downvotedBy", []] },
                                 ],
                              },
                              then: "downvote",
                              else: null,
                           },
                        },
                     },
                  },
                  else: null,
               },
            },
            hasUpvoted: {
               $eq: ["$userVote", "upvote"],
            },
            hasDownvoted: {
               $eq: ["$userVote", "downvote"],
            },
         },
      },
      {
         $project: {
            upvotedBy: 0,
            downvotedBy: 0,
            userVote: 0,
            "author.password": 0,
            "author.__v": 0,
            __v: 0,
         },
      },
   ]);

   res.status(200).json(
      new ApiResponse(200, "Comments fetched successfully", comments)
   );
});

export const updateComment = asyncHandler(async (req, res) => {
   const { commentId } = req.params;
   const { content } = req.body;
   const userId = req.user?._id;

   if (!userId) {
      throw new ApiError(403, "Unauthorized access");
   }

   if (!content || content.trim().length === 0) {
      throw new ApiError(400, "Comment content is required");
   }

   if (content.length > 500) {
      throw new ApiError(400, "Comment must be 500 characters or less");
   }

   const comment = await Comment.findById(commentId);
   if (!comment) {
      throw new ApiError(404, "Comment not found");
   }

   if (comment.author.toString() !== userId.toString()) {
      throw new ApiError(403, "You can only edit your own comments");
   }

   comment.content = content.trim();
   await comment.save();

   await comment.populate("author", "fullName email avatar username");

   const payload = {
      comment,
      questionId: comment.commentableId,
   };

   const io = req.app.get("io");
   if (io) {
      io.to("questions-feed").emit("comment:updated", payload);
      // console.log($&)
   }

   res.status(200).json(
      new ApiResponse(200, "Comment updated successfully", comment)
   );
});

export const deleteComment = asyncHandler(async (req, res) => {
   const { commentId } = req.params;
   const userId = req.user?._id;

   if (!userId) {
      throw new ApiError(403, "Unauthorized access");
   }

   const comment = await Comment.findById(commentId);
   if (!comment) {
      throw new ApiError(404, "Comment not found");
   }

   if (comment.author.toString() !== userId.toString()) {
      throw new ApiError(403, "You can only delete your own comments");
   }

   const questionId = comment.commentableId;

   await Comment.findByIdAndDelete(commentId);

   const payload = {
      commentId,
      questionId,
   };

   const io = req.app.get("io");
   if (io) {
      io.to("questions-feed").emit("comment:deleted", payload);
      // console.log($&)
   }

   res.status(200).json(
      new ApiResponse(200, "Comment deleted successfully", { commentId })
   );
});

export const commentVote = asyncHandler(async (req, res) => {
   const { commentId } = req.params;
   const { type } = req.body;
   const currentUser = req.user;
   if (!currentUser) {
      throw new ApiError(403, "Unauthorized access");
   }
   const userId = currentUser._id;
   if (!["upvote", "downvote"].includes(type)) {
      throw new ApiError(
         400,
         "Invalid vote type. Must be 'upvote' or 'downvote'"
      );
   }
   const comment = await Comment.findById(commentId);
   if (!comment) {
      throw new ApiError(404, "Comment not found");
   }
   const userIdStr = userId.toString();
   comment.upvotedBy = comment.upvotedBy.filter(
      (id: string) => id.toString() !== userIdStr
   );
   comment.downvotedBy = comment.downvotedBy.filter(
      (id: string) => id.toString() !== userIdStr
   );
   if (type === "upvote") {
      comment.upvotedBy.push(userId);
   } else if (type === "downvote") {
      comment.downvotedBy.push(userId);
   }
   await comment.save();

   const payload = {
      commentId: comment._id,
      upvotes: comment.upvotedBy.length,
      downvotes: comment.downvotedBy.length,
      questionId: comment.commentableId,
   };
   const io = req.app.get("io");
   if (io) {
      io.to("questions-feed").emit("comment:voted", payload);
      // console.log($&)
   }

   res.status(200).json(new ApiResponse(200, "Voted successfully", payload));
});

export const removeCommentVote = asyncHandler(async (req, res) => {
   const { commentId } = req.params;
   const userId = req.user?._id;

   if (!userId) {
      throw new ApiError(403, "Unauthorized access");
   }

   const comment = await Comment.findById(commentId);
   if (!comment) {
      throw new ApiError(404, "Comment not found");
   }

   const userIdStr = userId.toString();
   comment.upvotedBy = comment.upvotedBy.filter(
      (id: string) => id.toString() !== userIdStr
   );
   comment.downvotedBy = comment.downvotedBy.filter(
      (id: string) => id.toString() !== userIdStr
   );

   await comment.save();

   const payload = {
      commentId: comment._id,
      upvotes: comment.upvotedBy.length,
      downvotes: comment.downvotedBy.length,
      questionId: comment.commentableId,
      userId: userIdStr,
      action: "remove",
   };

   const io = req.app.get("io");
   if (io) {
      io.to("questions-feed").emit("comment:voted", payload);
      // console.log($&)
   }

   res.status(200).json(
      new ApiResponse(200, "Vote removed successfully", payload)
   );
});
