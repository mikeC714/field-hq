import { AppError } from "../error/error.handler.ts";
import type User from "../types/user.ts";

export class QuoteService{
	constructor(private db:any){
		this.db = db
	}
    async getQuoteInfo(customers:Array<>, user_id:User["user_id"], filter, limit, offset){
        if(!userId) throw new AppError("User not found.", 404);
        const cusIds = customers.map(c => c.id);
        try{
            const results = filter !== "ALL" ? 
            (
                await this.db.query(
                `SELECT
                    id,
                    customer_id,
                    status,
                    total,
                    markup,
                    created_at,
                COUNT(*) OVER() AS total_count
                FROM quotes
                WHERE user_id = $1
                AND status = $2
                AND customer_id = ANY ($3::uuid[])
                ORDER BY created_at ASC
                LIMIT $4 OFFSET $5
                `, [userId, filter, cusIds, limit, offset]
            )
            ):(
                await this.db.query(
                    `SELECT
                        id,
                        customer_id, 
                        status,
                        total,
                        markup,
                        created_at,
                    COUNT(*) OVER() AS total_count
                    FROM quotes
                    WHERE user_id = $1
                    AND customer_id = ANY ($2::uuid[])
                    ORDER BY created_at ASC
                    LIMIT $3 OFFSET $4
                    `, [userId, cusIds, limit, offset]
                ) 
            )
            return {
                quoteDetails: results?.rows,
                total: results?.rows[0].total_count ? parseInt(results.rows[0].total_count): 0
            }
        }catch(err){
        	throw err;
		}
    }

    async changeQuoteStatus(quoteId, status){
        if(!quoteId) throw new AppError("Quote not found.", 404);
        try{    
            await this.db.query(
                `UPDATE quotes 
                SET status = $1::quote_status_type
                WHERE id = $2
                `, [status, quoteId]
            )
        }catch(err){
        	throw err;
		}
    }

    async createQuote(user, customer, quote, labor, materials){
        try{
            const customerData = await this.db.query(
                `INSERT INTO customers 
                    (user_id, first_name, last_name, phone, email, address)
                VALUES($1, $2, $3, $4, $5, $6)
                RETURNING id`, 
                [user, customer.firstName, customer.lastName, customer.phone, customer.email, customer.address]
            );
            const quoteData = await this.db.query(
                `INSERT INTO quotes
                    (user_id, customer_id, status, markup, total)
                VALUES($1, $2, $3, $4, $5)    
                RETURNING id, created_at::date::text`, 
                [user, customerData?.rows[0]?.id, quote.status, quote.markup, quote.total]
            );

            await Promise.all([
                    labor.map(labVals => 
                        this.db.query(
                        `INSERT INTO labor
                            (quote_id, description, hours, hourly_rate, total)
                        VALUES($1, $2, $3, $4, $5)
                        `, [quoteData?.rows[0]?.id, labVals.description, labVals.hours, labVals.hourlyRate, labVals.total]
                    )),
                    materials.map(matVals =>
                       this.db.query( 
                        `INSERT INTO materials
                            (quote_id, description, quantity, unit_cost, total)
                        VALUES($1, $2, $3, $4, $5)
                        `, [quoteData?.rows[0]?.id, matVals.description, matVals.quantity, matVals.unitCost, matVals.total]
                    ))
            ]);
			
			return{
				quoteData: {id: quoteData.rows[0].id, created_at: quoteData.rows[0].created_at },
				customerId: customerData.rows[0].id
			}

        }catch(err){
        	throw err;
		}
    }

    async deleteQuote(quoteId, userId){
		if(!userId) throw new AppError("User not found.", 404);
        try{
            return await this.db.query(
                `DELETE FROM quotes WHERE user_id = $1 AND id = $2`,
                [userId, quoteId]
            );
        }catch(err){
        	throw err;
		}
        
    }

    async monitorQuotes(userId){
        if(!userId) throw new AppError("User not found.", 404);
        try{
            const results  = await this.db.query(
                `SELECT 
                    id,
                    status,
                    created_at
                    FROM quotes
                    WHERE user_id = $1
                    AND status = 'APPROVED'
                    AND created_at <= NOW() - INTERVAL '6 days'
                `, [userId]
            );

			const quotes = results.rows;

            // IF NO OVERDUE QUOTES RETURN

            if(!quotes.length) return;	

            const qtIds = quotes.map(qt => qt.id); 

            await this.db.query(
                `UPDATE quotes
                    SET status = 'UNPAID'
                    WHERE id = ANY($1::uuid[])
                `, [qtIds]
            );

        }catch(err){
        	throw err;
		}
    }
}

