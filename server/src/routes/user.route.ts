import epxress from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
   changeCurrentPassword,
   deleteUserAccount,
   getUserProfile,
   updateUserAvatar,
   updateProfileDetails,
   followUser,
   unFollowUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRoute = epxress.Router();

userRoute.route("/me").get(verifyJwt, getUserProfile);
userRoute.route("/change-password").patch(verifyJwt, changeCurrentPassword);
userRoute.route("/update-user-profile").patch(verifyJwt, updateProfileDetails);
userRoute.patch(
   "/update-avatar",
   verifyJwt,
   upload.single("avatar"),
   updateUserAvatar
);
userRoute.delete("/delete-user-profile", verifyJwt, deleteUserAccount);
userRoute.route("/:username/follow").post(verifyJwt, followUser);
userRoute.route("/:username/unfollow").post(verifyJwt, unFollowUser);

export default userRoute;
