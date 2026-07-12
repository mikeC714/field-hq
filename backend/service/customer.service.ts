import JobService from "./job.service.js";
import { db } from "../config/postgresql.config.js";
import { AppError } from "../error/error.handler.js";


export default{
    async getAllCustomerIds(user_id:string){
        if(!user_id) throw new AppError("User not found.", 404);
        try{
            const results = await db.query(
                `SELECT id FROM customers WHERE user_id = $1`,
                [user_id]
            );
            return results.rows;
        }catch(err){
    		throw err;
		}
    },

    async getAllCustomerInfo(user_id:string){
        if(!user_id) throw new AppError("User not found.", 404);
        try{
            const results = await db.query(
                `SELECT * FROM customers 
                WHERE user_id = $1
                `,[user_id]
            ); 
            return results.rows 
        }catch(err){
        	throw err;
		}
    },

    async customerDetails(customerIds:Array<{id:string}>, user_id:string){
        if(!user_id) throw new AppError("User not found.", 404);
        const cusIds = customerIds.map(customer => customer.id);
        try{
            const results = await db.query(
                `SELECT 
                    id,
                    first_name,
                    last_name,
                    phone,
                    email,
                    address,
                    created_at
                FROM customers
                WHERE user_id = $1
                AND id = ANY($2)
                `, [user_id, cusIds]
            );
            return results.rows;
        }catch(err){
        	throw err;
		}
    },

    async customerQuoteInfo(quotes:Array<{}>){
        if(!quotes || quotes.length === 0){
            return {
                quotes: [], jobs: []
            }
        }
        try{
            const quotedJobs = await Promise.all(
                quotes.map(async quote => {
                    const jobInfo = await JobService.getJobInfo([quote]);
                    return {
                        ...quote,
                        job: jobInfo
                    }
                })
            );
            return quotedJobs
        }catch(err){
        	throw err;
		}
    }
}


