import express from 'express';
import { AuthController } from "./auth.controllers.ts";
import { Auth } from "./auth.ts";
import { AuthService } from "./service/auth.ts";
import { TokenService } from "./service/token.ts";
import { authLimiter } from '../middleware/ratelimiter.ts';
import { verifyToken } from "./auth.middleware.ts";
import cors from "cors";



export function AuthRoutes(auth:Auth, authService:AuthService, tokenService:TokenService){
	const authRouter = express.Router();
	const controller = new AuthController(auth, authService, tokenService);

	authRouter.get('/auth/reset-password', cors({ origin: process.env.FRONTEND_URL, credentials:false }), controller.passwordReset);
	authRouter.patch('/auth/reset-password',  cors({ origin: process.env.FRONTEND_URL, credentials:false }), controller.passwordResetAccept)

	// authRouter.get('/auth/me', verifyToken, auth.currUser);
	authRouter.post('/auth/signup', authLimiter, controller.signup);
	authRouter.post('/auth/login', authLimiter, controller.login);
	authRouter.post('/auth/logout', verifyToken, controller.logout);
	authRouter.delete('/auth/delete', verifyToken, controller.deleteUser);

	return authRouter;
}
