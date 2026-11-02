import { Router } from 'express';
import { QuoteService } from "../service/quote.ts";
import { CustomerService } from "../service/customer.ts";
import { CustomerController } from "../controllers/customer.ts";
import { verifyToken } from '../auth/auth.middleware.ts';

export function CustomerRoutes(customer:CustomerService, quote:QuoteService){
	const customerRouter = Router();

	const controller = new CustomerController(customer, quote);

	customerRouter.get('/customers', verifyToken, quote.monitorQuotes, controller.getAllCustomers);
	customerRouter.get('/customer/info/:id', verifyToken, controller.getCustomerInfo);

	return customerRouter;
}
