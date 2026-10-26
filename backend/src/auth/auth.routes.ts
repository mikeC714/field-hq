import express from 'express';
import { AuthController } from "./auth.controllers.ts";
import { AuthService } from "./service/auth.ts";
import { TokenService } from "./service/token.ts";
import { authLimiter } from '../middleware/ratelimiter.js';
import { verifyToken } from "./auth.middleware.ts";
import { handlePasswordReset, handlePasswordResetAcceptance, sendPasswordReset } from '../controllers/email.controller.js';
import cors from "cors";



export function AuthRoutes(authService:AuthService, tokenService:TokenService){
	const authRouter = express.Router();
	const controller = new AuthController(authService, tokenService);

	authRouter.post('/auth/forgot-password', sendPasswordReset);
	authRouter.get('/auth/reset-password', cors({ origin: process.env.FRONTEND_URL, credentials:false }), handlePasswordReset);
	authRouter.patch('/auth/reset-password',  cors({ origin: process.env.FRONTEND_URL, credentials:false }), handlePasswordResetAcceptance)

	authRouter.get('/auth/me', verifyToken, controller.currUser);
	authRouter.post('/auth/signup', authLimiter, controller.signup);
	authRouter.post('/auth/login', authLimiter, controller.login);
	authRouter.post('/auth/logout', verifyToken, controller.logout);
	authRouter.delete('/auth/delete', verifyToken, controller.deleteUser);

	return authRouter;
}
