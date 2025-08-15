import express from 'express';
import { forgotPassword, login, logout, signup, verifyEmail,resetPassword } from '../controllers/auth.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { ApiResponse } from '../utils/apiResponse.js';

const authRouter = express.Router();

authRouter.post('/register', upload.single("avatar") ,signup);
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

export default authRouter;