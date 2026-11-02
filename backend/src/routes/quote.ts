import { Router } from 'express';
import { QuoteService } from "../service/quote.ts";
import { QuoteController } from "../controllers/quote.ts";
import { CustomerService } from "../service/customer.ts";
import { Auth } from "../auth/auth.ts";
import { TokenService } from "../auth/service/token.ts";
import { limiter } from '../middleware/ratelimiter.ts';
import { verifyToken } from "../auth/auth.middleware.ts";
import { monitorQuotes } from '../middleware/quote.ts';
import cors from "cors";



export function QuoteRoutes(quoteService:QuoteService, customerService:CustomerService, auth:Auth, tokenService:TokenService){
	const router = Router();

	const quote = new QuoteController(customerService, quoteService, tokenService, auth);

	router.get('/quote/acceptance', cors({ origin: process.env.FRONTEND_URL, credentials:false }), quote.quoteAccept);
	router.post('/quote/acceptance', cors({ origin: process.env.FRONTEND_URL, credentials:false }), quote.quoteAcceptConfirm);

	router.get('/quote', monitorQuotes,  verifyToken, quote.getAllQuoteInfo);
	router.get('/quote/monthly', verifyToken, quote.monthlyQuoteInfo);
	router.get('/quote/info/:id', verifyToken, quote.getQuoteInfo);
	router.post('/quote/create', limiter, verifyToken, quote.createQuote);
	router.delete('/quote/delete', verifyToken, quote.deleteQuote);

	return router;
};
