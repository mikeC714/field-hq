import express from 'express';
import { getCustomerQuoteInfo, createCustomerQuote, deleteCustomerQuote } from "../controllers/customer.controllers.js";
import { handleSending, handleAcceptance } from "../controllers/email.controller.js";
import { authLimiter } from '../middleware/ratelimiter.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import cors from "cors";

const quoteRouter = express.Router();
quoteRouter.use(verifyToken);


quoteRouter.use(verifyToken);
quoteRouter.put('/quote/acceptance', handleAcceptance);
quoteRouter.get('/customer-quote', getCustomerQuoteInfo);
quoteRouter.post('/quote/send', authLimiter, handleSending);
quoteRouter.get('/quote/customer', getCustomerQuoteInfo);
quoteRouter.post('/quote/create', createCustomerQuote);
quoteRouter.delete('/quote/delete', deleteCustomerQuote);
quoteRouter.get('/quote/acceptance', cors({ origin: process.env.FRONTEND_URL, credentials:false }), handleAcceptance);
export default quoteRouter;





