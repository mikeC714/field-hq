import express from 'express';
import { getCustomerQuoteInfo, createCustomerQuote, deleteCustomerQuote } from "../controllers/customer.controllers.js";
import { handleSending, handleAcceptance } from "../controllers/email.controller.js";
import { authLimiter } from '../middleware/ratelimiter.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import cors from "cors";

const quoteRouter = express.Router();
quoteRouter.get('/quote/acceptance', cors({ origin: process.env.FRONTEND_URL, credentials:false }), handleAcceptance);


quoteRouter.use(verifyToken);
quoteRouter.get('/quote/customer', getCustomerQuoteInfo);
quoteRouter.post('/quote/send', authLimiter, handleSending);
quoteRouter.get('/quote/customer', getCustomerQuoteInfo);
quoteRouter.post('/quote/create', createCustomerQuote);
quoteRouter.delete('/quote/delete', deleteCustomerQuote);
export default quoteRouter;





