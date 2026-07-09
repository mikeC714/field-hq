import { db, test_db } from "../config/postgresql.config.js";
import { QuoteService } from "../service/quote.service.js";
import jobService from "../service/job.service.js";
import customerService from "../service/customer.service.js";
import Auth from "../auth/auth.js";
import { TokenService } from "../service/db/token.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../error/error.handler.js";
import { cache } from "../config/redis.config.js";
const quoteService = new QuoteService(db);
const tokenService = new TokenService(db);

	export const getCustomerInfo = catchAsync(async(req,res) => {
        const user = req.user;
        if(!user) throw new AppError("User not found", 404);

		const customerIds = await customerService.getAllCustomerIds(user);
    	if(customerIds.length === 0 || !customerIds){
			return res.status(200).json({ customerDetails: [] });
		};
		const cusDetails = await customerService.customerDetails(customerIds)
		
        return res.status(200).json({
            cusDetails
        })
    });

    export const getAllUserCustomers = catchAsync(async(req, res) => {
        const user = req.user;
		if(!user) throw new AppError("User not found.", 404);

        const filter = req.query.filter
        const page  = parseInt(req.query.page)  || 1;
        const limit = parseInt(req.query.limit) || 15;
        const offset = (page - 1) * limit;
		
	    const customers = await customerService.getAllCustomerInfo(user);
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
			}
		}

	    const { quoteDetails, total } = await quoteService.getQuoteInfo(customers, user, filter, limit, offset);
        const  data = await jobService.getJobInfo(quoteDetails); 
		const customerData = customers.map(cus => {
			return{
		    	...cus,
		    	quote: quoteDetails.filter(qt => qt.customer_id === cus.id).map(qts => {
				return{
			    	...qts,
			    	job: data.filter(job => job.quote_id === qts.id)
				}
		    	})
			}
		});
		
		const totalPages = Math.ceil(total / limit);      

		await cache.set(`${user}`, JSON.stringify(customerData), 'EX', 1800)

		let cached = await cache.get(`${user}`);
		if(cached && cached !== null){
			cached = JSON.parse(cached);
		};

        return res.status(200).json({
            success: true,
            cusData: cached !== null && cached.length !== 0 ? cached : customerData,
            paginated: {
    	       total,
                page,
                limit,
                totalPages,
                nextPage: page < Math.ceil(total / limit),
				prevPage: page > 1
			}
		})
	});
 
    export const getCustomerQuoteInfo = catchAsync(async(req, res) => {
        const user = req.user;
		if(!user) throw new AppError("User not found.", 404);

		const customerIds = await customerService.getAllCustomerIds(user);
        if(customerIds.length === 0 || !customerIds){
			return res.status(200).json({ customerQuoteDetails: [] })
		}	
		const quotes = await quoteService.getQuoteInfo(customerIds, user);
        const customerQuoteDetails = await customerService.customerQuoteInfo(quotes, user)

        return res.status(200).json({
            customerQuoteDetails
        });
    })

    export const getCustomerStatus = catchAsync(async(req, res) => {
        const user = req.user;
        if(!user) throw new AppError("User not found.", 404);

		const customerIds = await customerService.getAllCustomerIds(user);
		if(!customerIds || customerIds.length === 0){
			return res.status(200).json({ success: true })
		}
        const quotes = await quoteService.getQuoteInfo(customerIds, user)
        const customerStatus = await customerService.customerStatus(quotes);

        return res.status(200).json({
            customerStatus
        });
    })

    export const createCustomerQuote = catchAsync(async(req, res) =>{
		const user = req.user;
		if(!user) throw new AppError("User not found.", 404);
        const { customer, labor, materials, quote } = req.body;
		for(const [_, val] of Object.entries(customer)){
			if(val.length === 0) throw new AppError("Missing Customer Input. Please fill all input fields.", 400);
		}
        const { quoteData, customerId } = await quoteService.createQuote(user, customer, quote, labor, materials);

        const emailToken = Auth.signEmail({ id: user, quoteId: quoteData.id, customerId }, "1d")
        await tokenService.storeQuoteToken(quoteData.id, emailToken);

        return res.status(200).json({
            success: true,
			      id: quoteData.id,
        });
    })

    export const deleteCustomerQuote = catchAsync(async(req,res) => {
		const user = req.user;
        if(!user) throw new AppError("User not found.", 404);
		const { quoteId } = req.body;
        await quoteService.deleteQuote(quoteId, user);

        return res.status(200).json({ message: `Quote ${quoteId} was successfully deleted.` });
    });



