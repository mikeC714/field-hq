import { db } from "../config/postgresql.ts";
import { AuthError } from "../error/error.ts";
import { QuoteService } from "../service/quote.ts";

const quoteService = new QuoteService(db)

export async function monitorQuotes(req, res, next){
	const user = req.user;
	if(!user) throw new AuthError("Unauthorized user. Failed to provide user ID");
    try{
        await quoteService.monitorQuotes(user);
        next();
    }catch(err){
        next(err);
    }
}
