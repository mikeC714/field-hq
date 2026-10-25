import { catchAsync } from "../lib/lib.ts";
import { QuoteService } from "../service/quote.ts";
import { JobService } from "../service/job.ts";
import { CustomerService } from "../service/customer.ts";
import { AppError } from "../error/error.handler.js";
import { cache } from "../config/redis.config.js";
import type { Request, Response } from "express";


export class CustomerController{
	private quoteService:QuoteService;
	private customerService:CustomerService;
	private jobService:JobService;

	constructor(customerService:CustomerService, jobService:JobService, quoteService:QuoteService){
		this.customerService = customerService;
		this.jobService = jobService;
		this.quoteService = quoteService;
	}

	getCustomerInfo = catchAsync(async(req:Request | any, res:Response) => {
		const userId = req.user;
		if(!userId) throw new AppError("User not found", 404);

		const customerIds = await this.customerService.getAllCustomerIds(userId);
		if(customerIds.length === 0 || !customerIds) return res.status(200).json({ customerDetails: [] });

		const customerDetails = await this.customerService.getCustomerDetails(customerIds, userId)

		return res.status(200).json({ customerDetails });
    });

    getAllUserCustomers = catchAsync(async(req:Request<{}, {}, {}, { filter:string, page:string, limit:string }> | any, res:Response) => {
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

		const { quoteDetails, total } = await this.quoteService.getQuotes(customerIds, userId, filter, limit, offset);
		const  data = await this.quoteService.getQuoteInfo(quoteDetails); 

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
 


};





