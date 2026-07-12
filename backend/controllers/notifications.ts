import notiService from '../service/notifications.service.js';
import customerService from '../service/customer.service.js';
import { catchAsync } from "../utils/catchAsync.js";

export const allNotifications = catchAsync(async(req,res) => {
    const user = req.user;
    const page = parseInt(req.query.notiPage);
    const limit = parseInt(req.query.notiLimit);
    const clear = req.query.clear;
    const offset = (page - 1) * limit;

    const customerIds = await customerService.getAllCustomerIds(user);
    const customerDetails = await customerService.customerDetails(customerIds, user);
    const { quotes, notis, total } = await notiService.getNotis(user, customerDetails, limit, offset);
	if(clear === "true") await notiService.softClearNotis(user, quotes);

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
    })
})

