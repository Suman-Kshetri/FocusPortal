// routes/question.route.ts
import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createQuestions, getAllQuestions } from "../controllers/question.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const questionRoute = express.Router();

questionRoute.post(
   "/create-questions",
   verifyJwt,
   upload.array("images", 2),
   createQuestions
);

questionRoute.get("/get-all-questions", getAllQuestions);

export default questionRoute;