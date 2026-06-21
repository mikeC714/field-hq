import express from 'express';
import { getCustomerQuoteInfo, createCustomerQuote, deleteCustomerQuote } from "../controllers/customer.controllers.js";
import { handleSending, handleAcceptance } from "../controllers/email.controller.js";
import { authLimiter } from '../middleware/ratelimiter.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const quoteRouter = express.Router();

quoteRouter.put('/quote/acceptance', handleAcceptance);

quoteRouter.use(verifyToken);
quoteRouter.get('/customer-quote', getCustomerQuoteInfo);
quoteRouter.post('/quote/send', authLimiter, handleSending);
quoteRouter.post('/create-quote', createCustomerQuote);
quoteRouter.delete('/delete-quote', deleteCustomerQuote);

export default quoteRouter;
