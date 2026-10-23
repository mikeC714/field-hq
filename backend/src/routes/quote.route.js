import express from 'express';
import { getCustomerQuoteInfo, createCustomerQuote, deleteCustomerQuote } from "../controllers/customer.controllers.js";
import { handleSending, handleQuoteAcceptance, handleQuoteAcceptanceConfirm } from "../controllers/email.controller.js";
import { authLimiter } from '../middleware/ratelimiter.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { monitorQuotes } from '../middleware/quote.middleware.js';
import cors from "cors";

const quoteRouter = express.Router();

quoteRouter.get('/quote/acceptance', cors({ origin: process.env.FRONTEND_URL, credentials:false }), handleQuoteAcceptance);
quoteRouter.post('/quote/acceptance', cors({ origin: process.env.FRONTEND_URL, credentials:false }), handleQuoteAcceptanceConfirm);
quoteRouter.get('/quote/customer', monitorQuotes,  verifyToken, getCustomerQuoteInfo);
quoteRouter.post('/quote/send', authLimiter, verifyToken, handleSending);
quoteRouter.post('/quote/create', authLimiter, verifyToken, createCustomerQuote);
quoteRouter.delete('/quote/delete', verifyToken, deleteCustomerQuote);
export default quoteRouter;





