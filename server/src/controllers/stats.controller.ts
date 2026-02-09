import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { Question } from "../models/questions.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getQuestionsCount = asyncHandler(
   async (req: Request, res: Response) => {
      const count = await Question.countDocuments();
      return res.status(200).json(
         new ApiResponse(200, "Questions count retrieved successfully", {
            count,
         })
      );
   }
);

export const getActiveUsersCount = asyncHandler(
   async (req: Request, res: Response) => {
      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

      const count = await User.countDocuments({
         lastLogin: { $gte: fiveDaysAgo },
      });

      return res.status(200).json(
         new ApiResponse(200, "Active users count retrieved successfully", {
            count,
         })
      );
   }
);

export const getStatsOverview = asyncHandler(
   async (req: Request, res: Response) => {
      const questionsCount = await Question.countDocuments();

      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      const activeUsersCount = await User.countDocuments({
         lastLogin: { $gte: fiveDaysAgo },
      });

      const totalUsers = await User.countDocuments();

      const stats = {
         questions: questionsCount,
         activeUsers: activeUsersCount,
         totalUsers: totalUsers,
      };

      return res
         .status(200)
         .json(
            new ApiResponse(200, "Stats overview retrieved successfully", stats)
         );
   }
);

export const getDetailedStats = asyncHandler(
   async (req: Request, res: Response) => {
      const questionsCount = await Question.countDocuments();

      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      const activeUsersCount = await User.countDocuments({
         lastLogin: { $gte: fiveDaysAgo },
      });

      const totalUsers = await User.countDocuments();
      const topContributors = await User.find()
         .select("username fullName avatar points questionsAsked answersGiven")
         .sort({ points: -1 })
         .limit(10)
         .lean();
      const recentQuestions = await Question.find()
         .select("title createdAt author")
         .sort({ createdAt: -1 })
         .limit(5)
         .populate("author", "username fullName avatar")
         .lean();

      const stats = {
         overview: {
            questions: questionsCount,
            activeUsers: activeUsersCount,
            totalUsers: totalUsers,
         },
         topContributors,
         recentActivity: {
            questions: recentQuestions,
         },
      };

      return res
         .status(200)
         .json(
            new ApiResponse(200, "Detailed stats retrieved successfully", stats)
         );
   }
);
