import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
   createComment,
   getCommentsByQuestion,
   deleteComment,
   updateComment,
   commentVote,
   removeCommentVote,
} from "../controllers/comment.controller.js";

const commentRoute = express.Router();

commentRoute.post("/:questionId/create-comments", verifyJwt, createComment);
commentRoute.get("/:questionId/all-comments", getCommentsByQuestion);
commentRoute.put("/:commentId/update", verifyJwt, updateComment);
commentRoute.delete("/:commentId/delete", verifyJwt, deleteComment);
commentRoute.post("/:commentId/vote", verifyJwt, commentVote);
commentRoute.delete("/:commentId/remove-vote", verifyJwt, removeCommentVote);

export default commentRoute;
