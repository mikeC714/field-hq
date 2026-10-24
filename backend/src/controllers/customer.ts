import { catchAsync } from "../lib/lib.ts";
import { QuoteService } from "../service/quote.ts";
import { JobService } from "../service/job.ts";
import { CustomerService } from "../service/customer.ts";
import { TokenService } from "../auth/service/token.ts";
import { AppError, AuthError } from "../error/error.handler.js";
import { cache } from "../config/redis.config.js";
import type { Request, Response } from "express";


export class CustomerController{
	private tokenService:TokenService;
	private quoteService:QuoteService;
	private customerService:CustomerService;
	private jobService:JobService;

	constructor(customerService:CustomerService, jobService:JobService, tokenService:TokenService, quoteService:QuoteService){
		this.customerService = customerService;
		this.jobService = jobService;
		this.quoteService = quoteService;
		this.tokenService = tokenService;
	}

	getCustomerInfo = catchAsync(async(req:Request,res:Response) => {
		const userId = req.user;
		if(!userId) throw new AppError("User not found", 404);

		const customerIds = await this.customerService.getAllCustomerIds(userId);
		if(customerIds.length === 0 || !customerIds) return res.status(200).json({ customerDetails: [] });

		const cusDetails = await this.customerService.getCustomerDetails(customerIds, userId)

		return res.status(200).json({ customerDetails: cusDetails });
    });

    getAllUserCustomers = catchAsync(async(req:Request<{}, {}, {}, { filter:string, page:string, limit:string }>, res:Response) => {
		const userId = req.user;
		const filter = req.query.filter
		const page  = parseInt(req.query.page)  || 1;
		const limit = parseInt(req.query.limit) || 15;
		const offset = (page - 1) * limit;

		// check cache
		let cached = await cache.get(`${userId}`);
		//if there is cache data return that immediately
		if(cached && cached !== null){
			cached = JSON.parse(cached);

			return res.status(200).json({
				success: true,
				customerData: cached.customerData,
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

		const customerIds = await this.customerService.getAllCustomerIds(userId);
		const customers = await this.customerService.getAllCustomerInfo(userId);
		//no customers just return
		if(!customers || customers.length === 0){
			return{
				cusData: {
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

		const { quoteDetails, total } = await this.quoteService.getQuoteInfo(customerIds, userId, filter, limit, offset);
		const  data = await this.jobService.getJobInfo(quoteDetails); 

		// HANDLE THIS LOGIC STRICTLY WITHIN PSQL
		const customerData = customers.map((cus:any) => {
			return{
				...cus,
				quote: quoteDetails.filter((qt:any) => qt.customer_id === cus.id).map((qts:any) => {
					return{
						...qts,
						job: data.filter((job:any) => job.quote_id === qts.id)
					}
				})
			};
		});

		const totalPages = Math.ceil(total / limit);      

		// set cache value
		await cache.set(`${userId}`, JSON.stringify({customerData, total, totalPages}), 'EX', 10_000);

		// this return is strictly assuming that the cache is null since the check statement has not been executed 
		return res.status(200).json({
			success: true,
			cusData: customerData,
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
 
	getCustomerQuoteInfo = catchAsync(async(req:Request, res:Response) => {
		const user = req.user;

		const customerIds = await this.customerService.getAllCustomerIds(user);
		if(customerIds.length === 0 || !customerIds) return res.status(200).json({ customerQuoteDetails: [] });	

		const quotes = await this.quoteService.getQuoteInfo(customerIds, user);
		const customerQuoteDetails = await this.customerService.customerQuoteInfo(quotes, user)

		return res.status(200).json({ customerQuoteDetails });
	});

	getCustomerStatus = catchAsync(async(req:Request, res:Response) => {
		const userId = req.user;

		const customerIds = await this.customerService.getAllCustomerIds(userId);
		if(!customerIds || customerIds.length === 0) return res.status(200).json({ success: true }); 

		const quoteStatus = await this.quoteService.getAllStatuses(customerIds);

		return res.status(200).json({ quoteStatus });
	});

	createCustomerQuote = catchAsync(async(req:Request, res:Response) =>{
		const user = req.user;
		const { customer, labor, materials, quote } = req.body;

		for(const [_, val] of Object.entries(customer)){
			if(val.length === 0) throw new AppError("Missing Customer Input. Please fill all input fields.", 400);
		};
		const { quoteData, customerId } = await thi.squoteService.createQuote(user, customer, quote, labor, materials);

		const emailToken = this.auth.signEmail({ id: user, quoteId: quoteData.id, customerId }, "1d")
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


};





