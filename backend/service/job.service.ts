import { startOfMonth, endOfMonth } from "../utils/date.ts";
import { db } from "../config/postgresql.config.ts";
import { AppError } from "../error/error.handler.ts";
import type { Quote } from "../types/quote.d.ts";

export default {    
	async getJobInfo(quotes:Array<{id:string}>):Promise<Array<object>>{
        try{
            const quoteIds = quotes.map(qts => qts.id);
            const results = await db.query(
                `SELECT 
                    description, 
                    hours,
                    hourly_rate,
                    quote_id
                FROM labor
                WHERE quote_id = ANY ($1)
                `, [quoteIds]
            );
			
            return results.rows || []
        }catch(err){
        	throw err;
		}
    },

    async allCompletedJobs(quote_id:Quote["quote_id"]):Promise<Array<object>>{
        if(!quote_id) throw new AppError("User not found.", 404);
        try{
            const results = await db.query(
                `SELECT status, created_at
                    FROM quotes
                    WHERE user_id = $1
                    AND status = 'COMPLETED'::quote_status_type
                    AND created_at >= $2
                    AND created_at < $3
                `, [quote_id, startOfMonth, endOfMonth]
            );

            return results.rows
        }catch(err){
        	throw err;
		}
    },

    async allUnpaidJobs(quote_id:Quote["quote_id"]):Promise<Array<object>>{
        if(!quote_id) throw new AppError("User not found.", 404);
        try{
            const results = await db.query(
                `SELECT status, created_at
                    FROM quotes
                    WHERE user_id = $1 
                    AND created_at >= $2
                    AND created_at < $3
                    AND status = 'UNPAID'::quote_status_type
                `, [quote_id, startOfMonth, endOfMonth]
            );

            return results.rows;
        }catch(err){
        	throw err;
		}
    },	

    async allActiveJobs(quote_id:Quote["quote_id"]):Promise<Array<object>>{
        if(!quote_id) throw new AppError("User not found.", 404);
        try{
            const results = await db.query(
                `SELECT status, created_at
                    FROM quotes
                    WHERE user_id = $1
                    AND status = 'APPROVED'::quote_status_type
                    AND created_at >= $2
                    AND created_at < $3
                `,[quote_id, startOfMonth, endOfMonth] 
            );

            return results.rows;
        }catch(err){
        	throw err;
		}
    },

    async getMonthlyTotal(quote_id:Quote["quote_id"]):Promise<number>{
        if(!quote_id) throw new AppError("User not found.", 404);
        try{
            const results = await db.query(
                  `SELECT SUM(total) AS total_value
                     FROM quotes
                     WHERE user_id = $1
                     AND created_at >= $2
                     AND created_at < $3
                     AND status = 'COMPLETED'`,
                    [quote_id, startOfMonth, endOfMonth]
            );
			

            return results.rows[0]?.total_value ?? 0 
        }catch(err){
        	throw err;
		}    
    }

}

