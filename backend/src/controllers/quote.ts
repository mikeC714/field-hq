import { catchAsync } from "../lib/lib.ts";
import { CustomerService } from "../service/customer.ts";
import { QuoteService } from "../service/quote.ts";
import { TokenService } from "../auth/service/token.ts";
import { Auth } from "../auth/auth.ts";
import { AppError } from "../error/error.handler.ts";
import type { Request, Response } from "express";


export class QuoteController{
	private customerService:CustomerService;
	private quoteService:QuoteService;
	private tokenService:TokenService;
	private auth:Auth

	constructor(customerService:CustomerService, quoteService:QuoteService, tokenService:TokenService, auth:Auth){
		this.customerService = customerService;
		this.quoteService = quoteService;
		this.tokenService = tokenService;
		this.auth = auth;
	};

	getCustomerStatus = catchAsync(async(req:Request, res:Response) => {
		const userId = req.user;

		const customerIds = await this.customerService.getAllCustomerIds(userId);
		if(!customerIds || customerIds.length === 0) return res.status(200).json({ success: true }); 

		const quoteStatus = await this.quoteService.getAllStatuses(customerIds);

		return res.status(200).json({ quoteStatus });
	});

	getCustomerQuoteInfo = catchAsync(async(req:Request, res:Response) => {
		const userId = req.user;

		const customerIds = await this.customerService.getAllCustomerIds(userId);
		if(customerIds.length === 0 || !customerIds) return res.status(200).json({ customerQuoteDetails: [] });	

		const quotes = await this.quoteService.getQuoteInfo(customerIds, userId);
		const customerQuoteDetails = await this.customerService.customerQuoteInfo(quotes, userId)

		return res.status(200).json({ customerQuoteDetails });
	});

	createCustomerQuote = catchAsync(async(req:Request, res:Response) =>{
		const userId = req.user;
		const { customer, labor, materials, quote } = req.body;

		for(const [_, val] of Object.entries(customer)){
			if(val.length === 0) throw new AppError("Missing Customer Input. Please fill all input fields.", 400);
		};
		const { quoteData, customerId } = await this.quoteService.createQuote(userId, customer, quote, labor, materials);

		const emailToken = this.auth.signEmail({ id: userId, quoteId: quoteData.id, customerId }, "1d")
		await this.tokenService.storeQuoteToken(quoteData.id, emailToken);

		return res.status(200).json({
			success: true,
			id: quoteData.id,
		});
	});

	deleteCustomerQuote = catchAsync(async(req:Request,res:Response) => {
		const user = req.user;
		const { quoteId } = req.body;
		await this.quoteService.deleteQuote(quoteId, user);

		return res.status(200).json({ message: `Quote ${quoteId} was successfully deleted.` });
	});
}
