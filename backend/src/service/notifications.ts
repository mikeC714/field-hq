import type { CUSTOMER } from "../types/customer.d.ts";


export class NotificationService{
	db:any;
	constructor(db:any){
		this.db = db;
	}

	async getNotis(userId:string, customerIds:Array<string>, customerDetails:Array<CUSTOMER>, limit:number, offset:number){
		try{ 
			const customerMap = new Map();
			customerDetails.forEach(cus => customerMap.set(cus.id, cus));
			const customers = customerDetails.map(cus => cus.id);

			let notis = []
			const results = await db.query(
			    `SELECT id, status, created_at, customer_id, total,
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

			if(results.rows.length === 0) return { notis: [] };

			const quotes = results.rows;

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
	};

	softClearNotis = async(userId:string, quoteIds:Array<string>) => {
		try{
			await this.db.query(
				`UPDATE quotes
				SET seen = $1
				WHERE id = ANY($2::uuid[])
				AND user_id = $3
				`, [true, quoteIds, userId]
			)
		}catch(err){
			throw err
		};
	};
}

