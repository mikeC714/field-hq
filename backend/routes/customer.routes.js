import express from 'express';
import {getAllUserCustomers, getCustomerInfo, getCustomerStatus, }  from "../controllers/customer.controllers.js";
import { verifyToken } from '../middleware/auth.middleware.js';
import { monitorQuotes } from "../middleware/quote.middleware.js";

const customerRouter = express.Router();

customerRouter.use(verifyToken);
customerRouter.get('/customers', monitorQuotes, getAllUserCustomers);
customerRouter.get('/customer/info', getCustomerInfo);
customerRouter.get('/customer/status', getCustomerStatus);

export default customerRouter;
