import {db} from "../config/postgresql.config.ts";
import type User from "../types/user.d.ts";
import type {Quote} from "../types/quote.d.ts";

type Notifications = {
	type:string;
	message:string;
	quoteId:string;
	total:number;
}

export default {
	async getNotis(user:User, customerDetails:Array<{id:string}>, limit:number, offset:number):Promise<{quotes:Array<Quote>, notis:Array<Notifications>}| any>{
        try{ 
            const customerMap = new Map();
            customerDetails.forEach(cus => customerMap.set(cus.id, cus));
            const customers = customerDetails.map(cus => cus.id);

            let notis:any[] = [];
            const results = await db.query(
                `SELECT 
                    id,
                    status,
                    created_at,
                    customer_id,
                    total,
                    COUNT(*) OVER() AS total_count
                    FROM quotes
                    WHERE user_id = $1
                    AND customer_id = ANY($2::uuid[])
                    AND seen = $3
					AND status IN ('APPROVED', 'PENDING', 'UNPAID')
                    ORDER BY created_at ASC
                    LIMIT $4 OFFSET $5
                `,[user, customers, false, limit, offset]
            )

            if(results.rows.length === 0) return notis as any[] 

            const quotes:Array<Quote> = results.rows;

            quotes.forEach(qt => {
                const customer = customerMap.get(qt.customer_id);

                if(qt.status === 'APPROVED'){
                    notis.push({
                        type: "Approved",
                        message: `${customer.first_name}, ${customer.last_name} has approved their quote.`,
                        quoteId: qt.id,
                        total:qt.total,
                    })
                }

                if((qt.status === 'PENDING')){
                    notis.push({
                        type: "Follow Up",
                        message: `${customer.first_name} hasn't accepted thier quote.`,
                        quoteId: qt.id,
                        total:qt.total,
                    })
                }

                if((qt.status === 'UNPAID')){
                    notis.push({
                        type: "Unpaid",
                        message: `${customer.first_name} hasn't paid their quote.`,
                        quoteId: qt.id,
                        total:qt.total,
                    })
                }
            })

            return {
				quotes,
                notis,
                total: results.rows[0].total_count ? parseInt(results.rows[0].total_count) : 0
            };

        }catch(err){
            throw err;
        }
    },

	async softClearNotis(user_id:string, quotes:Array<{id:string}>){
		const qtIds = quotes.map(qt => qt.id);
		try{
			await db.query(
				`UPDATE quotes
				SET seen = $1
				WHERE id = ANY($2::uuid[])
				AND user_id = $3
				`, [true, qtIds, user_id]
			)
		}catch(err){
			throw err
		}
	}
}

