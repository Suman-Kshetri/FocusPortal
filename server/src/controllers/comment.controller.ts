import { Comment } from "../models/comment.model.js";
import { Question } from "../models/questions.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

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
    console.log(`Comment created for question ${questionId}`);
  }

  res.status(201).json(
    new ApiResponse(201, "Comment created successfully", comment)
  );
});

export const getCommentsByQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;

  const question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  const comments = await Comment.find({
    commentableType: "Question",
    commentableId: questionId,
  })
    .populate("author", "fullName email avatar username")
    .sort({ createdAt: -1 });

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
    console.log(`Comment ${commentId} updated`);
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
    console.log(`Comment ${commentId} deleted`);
  }

  res.status(200).json(
    new ApiResponse(200, "Comment deleted successfully", { commentId })
  );
});