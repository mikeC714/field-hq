import express from 'express';
import { AuthController } from "./auth.controllers.ts";
import { AuthService } from "./service/auth.service.ts";
import { TokenService } from "./service/token.service.ts";
import { Auth } from "./auth.ts";
import { handlePasswordReset, handlePasswordResetAcceptance, sendPasswordReset } from '../controllers/email.controller.js';
import { authLimiter } from '../middleware/ratelimiter.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import cors from "cors";



export function AuthRoutes(db:any){
	const authRouter = express.Router();

	const auth = new Auth();
	const service = new AuthService(db);
	const tService = new TokenService(db, auth);
	const controller = new AuthController(service, tService);

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
