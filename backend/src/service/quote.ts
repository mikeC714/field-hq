import { date } from "../lib/lib.ts";
import { AppError, AuthError } from "../error/error.ts";
import type { NEW_QUOTE } from "../types/quote.d.ts";

export class QuoteService{
	db:any;
	constructor(db:any){
		this.db = db
	}

	getQuotes = async(customerIds:Array<string>, userId:string, filter:string, limit:number, offset:number) => {
		if(!userId) throw new AuthError("Invalid user", 404);
		try{
			const results = filter !== "ALL" ? 
			(
				await this.db.query(
					`SELECT id, customer_id, status, total, markup, created_at,
					COUNT(*) OVER() AS total_count
					FROM quotes
					WHERE user_id = $1
					AND status = $2
					AND customer_id = ANY ($3::uuid[])
					ORDER BY created_at ASC
					LIMIT $4 OFFSET $5
					`, [userId, filter, customerIds, limit, offset]
				)
			):(
				await this.db.query(
				  `SELECT id, customer_id, status, total, markup, created_at,
				  COUNT(*) OVER() AS total_count
				  FROM quotes
				  WHERE user_id = $1
				  AND customer_id = ANY ($2::uuid[])
				  ORDER BY created_at ASC
				  LIMIT $3 OFFSET $4
				  `, [userId, customerIds, limit, offset]
				) 
			);

			return {
			    quote: results?.rows,
			    total: results?.rows[0].total_count ? parseInt(results.rows[0].total_count): 0
			}

		}catch(err){
			throw err;
		};
	};

	changeQuoteStatus = async(quoteId:string, status:string) => {
		if(!quoteId) throw new AppError("Quote not found.", 404);
		try{    
			await this.db.query(
			    `UPDATE quotes 
			    SET status = $1::quote_status_type
			    WHERE id = $2
			    `, [status, quoteId]
			);
		}catch(err){
			throw err;
		};
	};

	createQuote = async(newQuote:NEW_QUOTE) => {
		const { userId, customer, quote, labor, materials } = newQuote;
		if(!userId) throw new AuthError("Invalid user.");
		try{

			const { rows } = await this.db.query(
				`WITH c AS(
					INSERT INTO customers
					(user_id, first_name, last_name, phone, email, address)
					VALUES($1, $2, $3, $4, $5, $6)
					RETURNING id
				)
				WITH q AS(
					INSERT INTO quotes
					(user_id, customer_id, status, markup, total)
					VALUES($1, c.id, $7, $8, $9)
					RETURNING id, created_at::date::text
				)

				INSERT INTO labor
				(quote_id, description, hours, hourly_rate, total)
				VALUES(q.id, $10, $11, $12, $13)

				INSERT INTO materials
				(quote_id, description, quantity, unit_cost, total)
				VALUES(q.id, $16, $17, $18, $19)
				
				SELECT id AS customer_id FROM c
				SELECT id AS quote_id, created_at FROM q
				`,[
					userId, 
					customer.firstName, 
					customer.lastName, 
					customer.phone, 
					customer.email, 
					customer.address,
					quote.status,
					quote.markup,
					quote.total,
					labor.description,
					labor.hours,
					labor.hourlyRate,
					labor.total,
					materials.description,
					materials.quantity,
					materials.unitCost,
					materials.total
				]
			);
			return{
				customerId:rows[0].customer_id,
				quote:{
					id:rows[0].quote_id,
					createdAt:rows[0].created_at
				}
			};
			
		}catch(err){
		throw err;
		}
	}

	deleteQuote = async(quoteId:string, userId:string) => {
		if(!userId) throw new AppError("User not found.", 404);
		try{
			await this.db.query(
			    `DELETE FROM quotes WHERE user_id = $1 AND id = $2`,
			    [userId, quoteId]
			);
		}catch(err){
			throw err;
		};
	};

	monitorQuotes = async(userId:string) => {
		if(!userId) throw new AppError("User not found.", 404);
		try{
			const { rows }  = await this.db.query(
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

			// IF NO OVERDUE QUOTES RETURN

			if(!rows.length) return;	

			const qtIds = rows.map(qt => qt.id); 

			await this.db.query(
			    `UPDATE quotes
				  SET status = 'UNPAID'
				  WHERE id = ANY($1::uuid[])
			    `, [qtIds]
			);

		}catch(err){
			throw err;
		};
	};

	getQuoteById = async(id:string) => {
		if(!id) throw new AppError("Failed to provide quote Id. Please provide quote Id inorder to get quote.", 400);
		try{
			const { rows } = await this.db.query(
				`SELECT * FROM quotes
					WHERE id = $1
				`,[id]
			)
			return rows;
		}catch(err){
			throw err;
		}
	}

	getQuoteCountByStatus = async(userId:string, status:Array<string>) => {
		if(!userId) throw new AuthError("Invalid user.", 404);
		if(status.length === 0) throw new AppError("Failed to provide status", 400);

		try{
			const { rows } = await this.db.query(
				`SELECT status, COUNT(*) AS count
				FROM quotes
				GROUP BY status
				ORDER BY count DESC
				WHERE user_id = $1
				AND status = ANY($2)::quote_status_type
				`,[userId, status]
			);

			return rows;
		}catch(e:Error | any){
			throw e;	
		};
	};

	getMonthlyTotal = async(userId:string) => {
		if(!userId) throw new AuthError("Invalid user.", 404);
		try{
			const { rows } = await this.db.query(
				`SELECT SUM(total) AS total_value
				   FROM quotes
				   WHERE user_id = $1
				   AND created_at >= $2
				   AND created_at < $3
				   AND status = 'COMPLETED'
				   `, [userId, date.startOfMonth, date.endOfMonth]
			);
			return rows[0]?.total_value ?? 0;
		}catch(e:Error | any){
			throw e;
		};
	};

	getAllQuoteInfo = async(quoteIds:Array<string>) => {
		try{
			const results = await this.db.query(
			    `SELECT description, hours, hourly_rate, quote_id
			    FROM labor
			    WHERE quote_id = ANY ($1)
			    `, [quoteIds]
			);
			
			return results.rows || []
		}catch(err){
			throw err;
		};
	};
}

