import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createQuestions, getAllQuestions, questionVote, removeVote } from "../controllers/question.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const questionRoute = express.Router();

questionRoute.post(
   "/create-questions",
   verifyJwt,
   upload.array("images", 2),
   createQuestions
);

questionRoute.get("/get-all-questions",verifyJwt, getAllQuestions);


questionRoute.post("/:id/vote", verifyJwt, questionVote);
questionRoute.delete("/:id/vote", verifyJwt, removeVote);


export default questionRoute;