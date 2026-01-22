import { ApiError } from "../utils/apiError.js";
import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/auth.types.js";

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized: User not authenticated");
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(403, "Forbidden: Insufficient permissions");
        }

        next();
    }
}