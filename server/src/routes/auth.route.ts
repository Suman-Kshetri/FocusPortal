import express, { Request } from 'express';
import { forgotPassword, login, logout, signup, verifyEmail,resetPassword, refreshAccessToken, getUserProfile, changeCurrentPassword, updateUserDetails, updateUserAvatar, deleteUserAccount } from '../controllers/auth.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { authorizeRoles } from '../middlewares/auth.authorize.js';
import { adminTest } from '../controllers/auth.controller.js';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const authRouter = express.Router();

authRouter.post('/register', upload.single("avatar") ,signup);
authRouter.post("/admin", verifyJwt, authorizeRoles("admin"), adminTest);
authRouter.route('/login').post(login);
authRouter.route('/logout').post(verifyJwt, logout);

authRouter.route('/verify-email').post(verifyEmail);
authRouter.route('/forgot-password').post(forgotPassword);
authRouter.route('/reset-password/:token').post(resetPassword);

authRouter.get('/check-auth',verifyJwt,(req, res) => {
  res.json(
    new ApiResponse(200, "Authenticated successfully", {
      user: req.user
    })
  );
});
authRouter.route("/refresh-token").post(refreshAccessToken);
authRouter.route('/user/me').get(verifyJwt, getUserProfile);
authRouter.route('/user/change-password').patch(verifyJwt, changeCurrentPassword);
authRouter.route('/user/update-user-profile').patch(verifyJwt, updateUserDetails);
authRouter.patch(
  "/user/update-avatar",
  verifyJwt,
  upload.single("avatar"),
  updateUserAvatar
);
authRouter.delete('/user/delete-user-profile',verifyJwt, deleteUserAccount);
export default authRouter;