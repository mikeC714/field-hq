import { CustomerService } from "../service/customer.ts";
import { NotificationService } from "../service/notifications.ts";
import { catchAsync } from "../lib/lib.ts";
import type { Request, Response } from "express";


interface QUERY{
	notificationPage:string;
	notificationLimit:string;
	clear:boolean;
}

export class NotificationController{
	notiService:NotificationService;
	customerService:CustomerService;

	constructor(notiService:NotificationService, customerService:CustomerService){
		this.customerService = customerService;
		this.notiService = notiService;
	}

	allNotifications = catchAsync(async(req:Request<{},{},{},QUERY> | any, res:Response) => {
		const user = req.user;
		const page = parseInt(req.query.notificationPage);
		const limit = parseInt(req.query.notificationLimit);
		const clear = req.query.clear;
		const offset = (page - 1) * limit;

		const [customerIds, customerDetails] = await Promise.all([
			this.customerService.getAllCustomerIds(user),
			this.customerService.getAllCustomerInfo(user)
		]);

		const { quotes, notis, total } = await this.notiService.getNotis(user, customerIds, customerDetails, limit, offset);
		if(clear === "true") await this.notiService.softClearNotis(user, quotes);

		const totalPages = Math.ceil(total/limit);

		return res.status(200).json({
			  success: true,
			  notis,
			  paginated:{
				page,
				total,
				totalPages,
				nextPage: page < Math.ceil(total/limit),
				prevPage: page > 1
			  }
		});
	});
}
