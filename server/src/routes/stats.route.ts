import { Router } from "express";
import {
   getQuestionsCount,
   getActiveUsersCount,
   getStatsOverview,
   getDetailedStats,
} from "../controllers/stats.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const statsRoute = Router();
statsRoute.get("/overview", getStatsOverview);

statsRoute.get("/questions/count", getQuestionsCount);
statsRoute.get("/users/active-count", getActiveUsersCount);
statsRoute.get("/detailed", verifyJwt, getDetailedStats);

export default statsRoute;
