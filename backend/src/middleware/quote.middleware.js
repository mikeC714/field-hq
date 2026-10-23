import { db } from "../config/postgresql.config.js";
import { AuthenticationError } from "../error/error.handler.js";
import { QuoteService } from "../service/quote.service.js";
const quoteService = new QuoteService(db)

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
