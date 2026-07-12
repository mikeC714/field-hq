import { decrypt, encrypt } from "../../utils/encrypt.js";
import { AppError } from "../../error/error.handler.js";
import type ServiceRequire from "../../types/servicerequire.ts";


export class TokenService{
	constructor(private db:any){
		this.db = db;
	}
    async storeRefreshToken({user:{user_id} = {}, token}:ServiceRequire):Promise<string>{
        if(!token) throw new AppError("Failed to provide valid token.", 401);
        if(!user_id) throw new AppError("User not found.", 404);
		try{
			const encrypted = encrypt(token);
         	await this.db.query(
            `	INSERT INTO tokens(user_id, token) 
            	VALUES($1, $2)
				RETURNING token
				`,
            	[user_id, encrypted]
        	)
			return encrypted;
		}catch(err){
			throw err;
		}
	};
    async deleteRefreshToken({user:{user_id}={}, token}:ServiceRequire){
        if(!user_id) throw new AppError("User not found.", 404);
        if(!token) throw new AppError("Failed to provide valid token.", 401);
		try{
            await this.db.query(
                "DELETE FROM tokens WHERE user_id = $1 AND token = $2",
                [user_id, token]
            );
        }catch(err){
            throw err;
        }
    };
    async getRefreshToken({user:{user_id}={}}:ServiceRequire):Promise<string>{
        if(!user_id) throw new AppError("User not found.", 404);
        try{
            const results = await this.db.query(
                "SELECT token FROM tokens WHERE user_id = $1",
                [user_id]
            );
			const decrypted = decrypt(results.rows[0].token);
			const token = decrypted;
			return token;
        }catch(err){
            throw err;
        }
    };

    async storeQuoteToken({quote:{quote_id}={}, token}:ServiceRequire):Promise<{expiry: string, token: string}>{
        if(!quote_id) throw new AppError("Failed to provide quote id.", 400);
        if(!token) throw new AppError("Failed to provide valid token.", 400);
        try{
			const encrypted = encrypt(token);
            const results = await this.db.query(
                "INSERT INTO quote_tokens (quote_id, token) VALUES($1, $2) RETURNING expires_at::date::text,token",
                [quote_id, encrypted]
            );

		return {
			expiry:results.rows[0].expires_at,
			token:results.rows[0].token
		};
        }catch(err){
            throw err;
        }
    };
    async getQuoteToken({user:{user_id}={}, quote:{quote_id}={}}:ServiceRequire):Promise<string>{
        if(!user_id) throw new AppError("User not found.", 404);
        if(!quote_id) throw new AppError("Quote not found.", 404);
        try{
            const results = await this.db.query(
                `SELECT token FROM quote_tokens
                WHERE user_id = $1
                AND quote_id = $2
                `, [user_id, quote_id]
            )
			const decrypted = decrypt(results.rows[0].token);
            const token = decrypted;
			return token;
        }catch(err){
            throw err;
        }
    };
}


