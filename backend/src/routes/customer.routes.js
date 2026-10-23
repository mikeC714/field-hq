import express from 'express';
import {getAllUserCustomers, getCustomerInfo, getCustomerStatus, }  from "../controllers/customer.controllers.js";
import { verifyToken } from '../middleware/auth.middleware.js';
import { monitorQuotes } from "../middleware/quote.middleware.js";

const customerRouter = express.Router();

customerRouter.get('/customers', verifyToken, monitorQuotes, getAllUserCustomers);
customerRouter.get('/customer/info', verifyToken, getCustomerInfo);
customerRouter.get('/customer/status', verifyToken, getCustomerStatus);

export default customerRouter;
