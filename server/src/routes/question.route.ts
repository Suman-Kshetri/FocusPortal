import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
   createQuestions,
   deleteQuestion,
   getAllQuestions,
   questionVote,
   removeVote,
   updateQuestion,
} from "../controllers/question.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const questionRoute = express.Router();

questionRoute.post(
   "/create-questions",
   verifyJwt,
   upload.array("images", 2),
   createQuestions
);

questionRoute.get("/get-all-questions", verifyJwt, getAllQuestions);

questionRoute.post("/:id/vote", verifyJwt, questionVote);
questionRoute.delete("/:id/vote", verifyJwt, removeVote);
questionRoute.put("/:id", verifyJwt, updateQuestion);
questionRoute.delete("/:id", verifyJwt, deleteQuestion);

export default questionRoute;
