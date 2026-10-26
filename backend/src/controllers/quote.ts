import { catchAsync } from "../lib/lib.ts";
import { CustomerService } from "../service/customer.ts";
import { QuoteService } from "../service/quote.ts";
import { TokenService } from "../auth/service/token.ts";
import { Auth } from "../auth/auth.ts";
import { AppError } from "../error/error.handler.ts";
import type { Request, Response } from "express";
import type { CUSTOMER } from "../types/customer.d.ts";



export class QuoteController{
	private customerService:CustomerService;
	private quoteService:QuoteService;
	private tokenService:TokenService;
	private auth:Auth
	private STATUS = [
		"complete",
		"approved",
		"unpaid",
		"pending",
		"sent",
		"draft",
	];

	constructor(customerService:CustomerService, quoteService:QuoteService, tokenService:TokenService, auth:Auth){
		this.customerService = customerService;
		this.quoteService = quoteService;
		this.tokenService = tokenService;
		this.auth = auth;
	};

	getAllQuoteInfo = catchAsync(async(req:Request | any, res:Response) => {
		const userId = req.user;

		const customerIds = await this.customerService.getAllCustomerIds(userId);
		if(customerIds.length === 0 || !customerIds) return res.status(200).json({ customerQuoteDetails: [] });	

		const quotes = await this.quoteService.getAllQuoteInfo(customerIds);

		return res.status(200).json({ quotes });
	});

	createQuote = catchAsync(async(req:Request | any, res:Response) =>{
		const userId = req.user;
		const { customer } = req.body;

		for(const [_, val] of Object.entries(customer as CUSTOMER)){
			if(val.length === 0) throw new AppError("Missing Customer Input. Please fill all input fields.", 400);
		};
		const { quote , customerId } = await this.quoteService.createQuote(req.body);

		const emailToken = this.auth.signEmail({ id:userId, quoteId:quote.id, customerId }, "1d");
		await this.tokenService.storeQuoteToken(quote.id , emailToken);

		return res.status(200).json({
			success: true,
			quoteId: quote.id,
		});
	});

	deleteQuote = catchAsync(async(req:Request | any, res:Response) => {
		const user = req.user;
		const { quoteId } = req.body;
		await this.quoteService.deleteQuote(quoteId, user);

		return res.status(200).json({ message: `Quote ${quoteId} was successfully deleted.` });
	});

	monthlyQuoteInfo = catchAsync(async(req:Request | any, res:Response) => {
		const user = req.user;
		if(!user) throw new AppError("User not found.", 404);

		const [ quotes, monthlyTotal ] = await Promise.all([
			this.quoteService.getQuoteCountByStatus(user, this.STATUS),
			this.quoteService.getMonthlyTotal(user)
		]);

	    return res.status(200).json({ quotes, monthlyTotal });
	});
}
