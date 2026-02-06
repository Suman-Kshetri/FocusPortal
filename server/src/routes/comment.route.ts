import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
   createComment,
   getCommentsByQuestion,
   deleteComment,
   updateComment,
} from "../controllers/comment.controller.js";

const commentRoute = express.Router();

commentRoute.post("/:questionId/comments", verifyJwt, createComment);
commentRoute.get("/:questionId/comments", getCommentsByQuestion);
commentRoute.put("/comments/:commentId", verifyJwt, updateComment);
commentRoute.delete("/comments/:commentId", verifyJwt, deleteComment);

export default commentRoute;
