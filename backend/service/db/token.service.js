import { decrypt, encrypt } from "../../utils/encrypt.js";
import db from "../../config/postgresql.config.js";
import { AppError } from "../../error/error.handler.js";

export default {
    async storeRefreshToken(id, token){
        if(!token) throw new AppError("Failed to provide valid token.", 401);
        if(!id) throw new AppError("User not found.", 404);
		try{
			const encrypted = encrypt(token);
         	await db.query(
            `	INSERT INTO tokens(user_id, token) 
            	VALUES($1, $2)
				RETURNING token
				`,
            	[id, encrypted]
        	)
			return encrypted;
		}catch(err){
			throw err;
		}
	},

    async deleteRefreshToken(userId, token){
        if(!userId) throw new AppError("User not found.", 404);
        if(!token) throw new AppError("Failed to provide valid token.", 401);
		try{
            await db.query(
                "DELETE FROM tokens WHERE user_id = $1 AND token = $2",
                [userId, token]
            );
        }catch(err){
            throw err;
        }
    },

    async getRefreshToken(id){
        if(!id) throw new AppError("User not found.", 404);
        try{
            const results = await db.query(
                "SELECT token FROM tokens WHERE user_id = $1",
                [id]
            );
			const decrypted = decrypt(results.rows[0].token);
			return token = decrypted;
        }catch(err){
            throw err;
        }
    },

    async storeQuoteToken(quoteId, token){
        if(!quoteId) throw new AppError("Failed to provide quote id.", 400);
        if(!token) throw new AppError("Failed to provide valid token.", 401);
        try{
			const encrypted = encrypt(token);
            const results = await db.query(
                "INSERT INTO quote_tokens (quote_id, token) VALUES($1, $2) RETURNING expires_at::date::text",
                [quoteId, encrypted]
            );

		return results.rows[0].expires_at;
        }catch(err){
            throw err;
        }
    },

    async getQuoteToken(id, quoteId){
        if(!id) throw new AppError("User not found.", 404);
        if(!quoteId) throw new AppError("Quote not found.", 404);
        try{
            const results = await db.query(
                `SELECT token FROM quote_tokens
                WHERE user_id = $1
                AND quote_id = $2
                `, [id, quoteId]
            )
			const decrypted = decrypt(results.rows[0].token);
            return token = decrypted;
        }catch(err){
            throw err;
        }
    }
}


