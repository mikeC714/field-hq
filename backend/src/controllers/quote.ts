import { catchAsync, crypt } from "../lib/lib.ts";
import { CustomerService } from "../service/customer.ts";
import { QuoteService } from "../service/quote.ts";
import { TokenService } from "../auth/service/token.ts";
import { Auth } from "../auth/auth.ts";
import { AppError, AuthError } from "../error/error.ts";
import type { Request, Response } from "express";
import type { CUSTOMER } from "../types/customer.d.ts";



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

	getQuoteInfo = catchAsync(async(req:Request | any, res:Response) => {
		const userId = req.user;
		const quoteId = req.params.id;
	
		const quoteInfo = await this.quoteService.getQuoteById(quoteId, userId);

		return res.status(200).json({ quoteInfo });
	});

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
		const { quote , customerId } = await this.quoteService.createQuote({ ...req.body, userId });

		const emailToken = this.auth.signEmail({ userId, quoteId:quote.id, customerId }, "1d");
		await this.tokenService.storeQuoteToken(quote.id , emailToken);

		return res.status(201).json({
			success: true,
			quoteId: quote.id,
		});
	});

	deleteQuote = catchAsync(async(req:Request | any, res:Response) => {
		const userId = req.user;
		const { quoteId } = req.body;

		await this.quoteService.deleteQuote(quoteId, userId);

		return res.sendStatus(200);
	});

	monthlyQuoteInfo = catchAsync(async(req:Request | any, res:Response) => {
		const user = req.user;
		if(!user) throw new AuthError("User not found.", 404);

		const [ quotes, monthlyTotal ] = await Promise.all([
			this.quoteService.getQuoteCountByStatus(user, ["completed", "approved", "unpaid"]),
			this.quoteService.getMonthlyTotal(user)
		]);

		const [ completed, approved, unpaid ] = quotes; 

		return res.status(200).json({ 
			quote:{ 
				completed,
				approved,
				unpaid
			},
			monthlyTotal });
	});


	quoteAccept = catchAsync(async(req:Request<{}, {}, {}, { token:string }>, res:Response) => {
		const token = req.query.token;
		if(!token) return res.status(400).json({ error:"Link has expired. Get in contact with sender inorder to send link again" });

		const decrypted = crypt.decrypt(token);

		const valid:any = this.auth.verifyEmail(decrypted);
		if(valid.payload.purpose !== "quote_acceptance") return res.redirect(302, `${process.env.FRONTEND_URL}/404`);

		const quote = await this.quoteService.getQuoteById(valid.payload.quoteId)
		if(!quote || quote.length === 0) return res.status(400).json({ error:"Failed to find valid quote." });

		return res.sendStatus(200);
	});

	quoteAcceptConfirm = catchAsync(async(req:Request<{}, {}, {}, { token:string }>,res:Response) => {
		const token = req.query.token;
		if(!token) return res.redirect(302, `${process.env.FRONTEND_URL}/404`);

		const decrypted = crypt.decrypt(token);
		const valid:any = this.auth.verifyEmail(decrypted);
		if(valid.payload.purpose !== "quote_acceptance") return res.redirect(302, `${process.env.FRONTEND_URL}/404`);


		const quote = await this.quoteService.getQuoteById(valid.payload.quoteId)
		if(!quote || quote.length === 0) return res.status(400).json({ error:"Failed to find valid quote." });
		if(quote.status === "APPROVED") return res.status(200);

		await this.quoteService.changeQuoteStatus(valid.payload.quoteId, "APPROVED");
		return res.sendStatus(200);
	});
}
