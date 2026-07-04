import { startOfMonth, endOfMonth } from "../utils/date.js";
import { db } from "../config/postgresql.config.js";
import { AppError } from "../error/error.handler.js";

export default {    
	async getJobInfo(quotes){
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

    async allCompletedJobs(id){
        if(!id) throw new AppError("User not found.", 404);
        try{
            const results = await db.query(
                `SELECT status, created_at
                    FROM quotes
                    WHERE user_id = $1
                    AND status = 'COMPLETED'::quote_status_type
                    AND created_at >= $2
                    AND created_at < $3
                `, [id, startOfMonth, endOfMonth]
            );

            return results.rows
        }catch(err){
        	throw err;
		}
    },

    async allUnpaidJobs(id){
        if(!id) throw new AppError("User not found.", 404);
        try{
            const results = await db.query(
                `SELECT status, created_at
                    FROM quotes
                    WHERE user_id = $1 
                    AND created_at >= $2
                    AND created_at < $3
                    AND status = 'UNPAID'::quote_status_type
                `, [id, startOfMonth, endOfMonth]
            );

            return results.rows;
        }catch(err){
        	throw err;
		}
    },	

    async allActiveJobs(id){
        if(!id) throw new AppError("User not found.", 404);
        try{
            const results = await db.query(
                `SELECT status, created_at
                    FROM quotes
                    WHERE user_id = $1
                    AND status = 'APPROVED'::quote_status_type
                    AND created_at >= $2
                    AND created_at < $3
                `,[id, startOfMonth, endOfMonth] 
            );

            return results.rows;
        }catch(err){
        	throw err;
		}
    },

    async getMonthlyTotal(id){
        if(!id) throw new AppError("User not found.", 404);
        try{
            const results = await db.query(
                  `SELECT SUM(total) AS total_value
                     FROM quotes
                     WHERE user_id = $1
                     AND created_at >= $2
                     AND created_at < $3
                     AND status = 'COMPLETED'`,
                    [id, startOfMonth, endOfMonth]
            );
			

            return results.rows[0]?.total_value ?? 0 
        }catch(err){
        	throw err;
		}    
    }

}

