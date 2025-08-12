import express from 'express';
import { login, logout, signup, verifyEmail } from '../controllers/auth.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const authRouter = express.Router();

authRouter.post('/register', upload.single("avatar") ,signup);
authRouter.route('/login').post(login);
authRouter.route('/logout').post(logout);

authRouter.route('/verify-email').post(verifyEmail);

export default authRouter;