import express from 'express';
import { AuthController } from "./auth.controllers.ts";
import { AuthService } from "./service/auth.ts";
import { TokenService } from "./service/token.ts";
import { authLimiter } from '../middleware/ratelimiter.js';
import { verifyToken } from "./auth.middleware.ts";
import cors from "cors";



export function AuthRoutes(authService:AuthService, tokenService:TokenService){
	const authRouter = express.Router();
	const auth = new AuthController(authService, tokenService);

	authRouter.get('/auth/reset-password', cors({ origin: process.env.FRONTEND_URL, credentials:false }), auth.passwordReset);
	authRouter.patch('/auth/reset-password',  cors({ origin: process.env.FRONTEND_URL, credentials:false }), auth.passwordResetAccept)

	authRouter.get('/auth/me', verifyToken, auth.currUser);
	authRouter.post('/auth/signup', authLimiter, auth.signup);
	authRouter.post('/auth/login', authLimiter, auth.login);
	authRouter.post('/auth/logout', verifyToken, auth.logout);
	authRouter.delete('/auth/delete', verifyToken, auth.deleteUser);

	return authRouter;
}
