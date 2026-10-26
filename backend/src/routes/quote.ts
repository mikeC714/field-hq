import { Router } from 'express';
import { QuoteService } from "../service/quote.ts";
import { QuoteController } from "../controllers/quote.ts";
import { CustomerService } from "../service/customer.ts";
import { Auth } from "../auth/auth.ts";
import { TokenService } from "../auth/service/token.ts";
import { authLimiter } from '../middleware/ratelimiter.ts';
import { verifyToken } from "../auth/auth.middleware.ts";
import { monitorQuotes } from '../middleware/quote.ts';
import cors from "cors";



export function QuoteRoutes(quoteService:QuoteService, customerService:CustomerService, auth:Auth, tokenService:TokenService){
	const quoteRouter = Router();

	const quote = new QuoteController(customerService, quoteService, tokenService, auth);

	quoteRouter.get('/quote/acceptance', cors({ origin: process.env.FRONTEND_URL, credentials:false }), quote.handleQuoteAcceptance);
	quoteRouter.post('/quote/acceptance', cors({ origin: process.env.FRONTEND_URL, credentials:false }), quote.handleQuoteAcceptanceConfirm);

	quoteRouter.get('/quote', monitorQuotes,  verifyToken, quote.getAllQuoteInfo);
	quoteRouter.post('/quote/send', authLimiter, verifyToken, quote.handleSending);
	quoteRouter.post('/quote/create', authLimiter, verifyToken, quote.createQuote);
	quoteRouter.delete('/quote/delete', verifyToken, quote.deleteQuote);

	return quoteRouter;
};
