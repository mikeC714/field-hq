import { catchAsync, crypt } from "../lib/lib.ts";
import { CustomerService } from "../service/customer.ts";
import { QuoteService } from "../service/quote.ts";
import { TokenService } from "../auth/service/token.ts";
import { Auth } from "../auth/auth.ts";
import { AppError, AuthError } from "../error/error.ts";
import { Redis } from "ioredis";
import type { Request, Response } from "express";
import type { CUSTOMER } from "../types/customer.d.ts";



export class QuoteController{
	private customerService:CustomerService;
	private quoteService:QuoteService;
	private tokenService:TokenService;
	private auth:Auth;
	private cache:typeof Redis | any;

	constructor(customerService:CustomerService, quoteService:QuoteService, tokenService:TokenService, auth:Auth, cache:typeof Redis){
		this.customerService = customerService;
		this.quoteService = quoteService;
		this.tokenService = tokenService;
		this.auth = auth;
		this.cache = cache;
	};

	getQuoteInfo = catchAsync(async(req:Request | any, res:Response) => {
		const userId = req.user;
		const quoteId = req.params.id;
	
		const quoteInfo = await this.quoteService.getQuoteById(quoteId, userId);

		return res.status(200).json({ quoteInfo });
	});


    getAllQuotes = catchAsync(async(req:Request<{}, {}, {}, { filter:string, page:string, limit:string }> | any, res:Response) => {
		const userId = req.user;
		const filter = req.query.filter
		const page  = parseInt(req.query.page)  || 1;
		const limit = parseInt(req.query.limit) || 15;
		const offset = (page - 1) * limit;

		// check cache
		let cached = await this.cache.get(`${userId}`);

		//if there is cache data return that immediately
		if(cached && cached !== null){
			cached = JSON.parse(cached);

			return res.status(200).json({
				success: true,
				customer: cached.customerData,
				paginated:{
					total: cached.total,
					page,
					limit,
					totalPages: cached.totalPages,
					nextPage: page < Math.ceil(cached.total / limit),
					prevPage: page > 1 
				}
			});
		};

		const [customerIds, customers] = await Promise.all([
			this.customerService.getAllCustomerIds(userId), 
			this.customerService.getAllCustomerInfo(userId)
		]);

		//no customers just return
		if(!customers || customers.length === 0){
			return{
				customer: {
					quote:{
						job:{}		
					},
				},
				paginated:{
					total:0,
					page:1,
					limit,
					totalPages:1,
					nextPage: false,
					prevPage: false
				}
			};
		};

		const { quote, total } = await this.quoteService.getQuotes(customerIds, userId, filter, limit, offset);

		// HANDLE THIS LOGIC STRICTLY WITHIN PSQL
		const customerData = customers.map((cus:any) => {
			return{
				...cus,
				quote: quote.filter((qt:any) => qt.customer_id === cus.id).map((qts:any) => {
					return{
						...qts,
						job: data.filter((job:any) => job.quote_id === qts.id)
					}
				})
			};
		});

		const totalPages = Math.ceil(total / limit);      
		// set cache value
		await this.cache.set(`${userId}`, JSON.stringify({customerData, total, totalPages}), 'EX', 10_000);

		// this return is strictly assuming that the cache is null since the check statement has not been executed 
		return res.status(200).json({
			success: true,
			customer: customerData,
			paginated: {
				total,
				page,
				limit,
				totalPages,
				nextPage: page < Math.ceil(total / limit),
				prevPage: page > 1
			}
		});
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
