import { AuthenticationError } from "../error/error.handler.js";
import quoteService from "../service/quote.service.js";

export async function monitorQuotes(req, res, next){
	const user = req.user;
	if(!user) throw new AuthenticationError("Unauthorized user. Failed to provide user ID");
    try{
        await quoteService.monitorQuotes(user);
        next();
    }catch(err){
        next(err);
    }
}
