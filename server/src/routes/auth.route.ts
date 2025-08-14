import express from 'express';
import { forgotPassword, login, logout, signup, verifyEmail,resetPassword } from '../controllers/auth.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const authRouter = express.Router();

authRouter.post('/register', upload.single("avatar") ,signup);
authRouter.route('/login').post(login);
authRouter.route('/logout').post(logout);

authRouter.route('/verify-email').post(verifyEmail);
authRouter.route('/forgot-password').post(forgotPassword);
authRouter.route('/reset-password/:token').post(resetPassword);

export default authRouter;