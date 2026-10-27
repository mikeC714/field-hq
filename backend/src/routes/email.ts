import { Router } from 'express';
import { authLimiter } from '../middleware/ratelimiter.ts';
import { verifyToken } from "../auth/auth.middleware.ts";
import { EmailService } from "../service/email.ts";
import { Auth } from "../auth/auth.js";
import { EmailController } from "../controllers/email.ts";
import { TokenService } from "../auth/service/token.ts";
import { AuthService } from "../auth/service/auth.ts";
import { QuoteService } from "../service/quote.ts";

export function EmailRoutes(emailService:EmailService, tokenService:TokenService, quoteService:QuoteService, authService:AuthService, auth:Auth){
	const router = Router();

	const email = new EmailController(quoteService, emailService, tokenService, authService, auth);

	router.post("/quote/send", verifyToken, authLimiter, email.sendQuote)	
	router.post("/password/forgot", verifyToken, authLimiter, email.sendPasswordReset)	

	return router;
};
