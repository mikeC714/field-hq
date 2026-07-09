import express from 'express';
import { login, signup, logout, currUser, deleteUserAcc, } from '../controllers/auth.controllers.js';
import { handlePasswordReset, handlePasswordResetAcceptance, sendPasswordReset } from '../controllers/email.controller.js';
import { authLimiter } from '../middleware/ratelimiter.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import cors from "cors";

const authRouter = express.Router();

authRouter.post('/auth/forgot-password', sendPasswordReset);
authRouter.get('/auth/reset-password', cors({ origin: process.env.FRONTEND_URL, credentials:false }), handlePasswordReset);
authRouter.patch('/auth/reset-password',  cors({ origin: process.env.FRONTEND_URL, credentials:false }), handlePasswordResetAcceptance)

authRouter.get('/auth/me', verifyToken, currUser);
authRouter.post('/auth/signup', authLimiter, signup);
authRouter.post('/auth/login', authLimiter, login);
authRouter.post('/auth/logout', verifyToken, logout);
authRouter.delete('/auth/delete', verifyToken, deleteUserAcc);

export default authRouter;
