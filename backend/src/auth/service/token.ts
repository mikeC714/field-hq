import { crypt } from "../../lib/lib.ts";
import { AppError, AuthError } from "../../error/error.handler.ts";
import { Auth } from "../auth.ts";
import type { Response } from "express";

export class TokenService{
	db:any;
	private auth:Auth;

	constructor(db:any, auth:Auth){ 
		this.db = db
		this.auth = auth;
	};

	genCookies = async(res:Response, userId:string):Promise<void> => {
		if(!userId) throw new AppError("Failed to provide userId"); 
		try{
			const token = this.auth.sign({ id:userId });	
			const rToken = this.auth.signRefresh({ id:userId });	
			const safeRToken = crypt.encrypt(rToken);
			await this.storeRefreshToken(userId, safeRToken);

			res.cookie("access_token", token, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				maxAge: 900000 // 15M
			});

			res.cookie("refresh_token", safeRToken, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 604800000 // 7D
			});

		}catch(e){
			throw e;
		};

	};

	storeRefreshToken = async(id:string, token:string):Promise<string> => {
		if(!token) throw new AppError("Failed to provide valid token.", 401);
		if(!id) throw new AppError("User not found.", 404);
		try{
			 await this.db.query(
				`INSERT INTO tokens(user_id, token) 
				VALUES($1, $2)
				RETURNING token`
				, [id, token]
			);

			return token;
		}catch(err){
			throw err;
		}
	};

	deleteRefreshToken = async(userId:string, token:string) => {
		if(!userId) throw new AppError("User not found.", 404);
		if(!token) throw new AppError("Failed to provide valid token.", 401);
		try{
			await this.db.query( "DELETE FROM tokens WHERE user_id = $1 AND token = $2",[userId, token] );
		}catch(err){
			throw err;
		};
	};

	getRefreshToken = async(id:string):Promise<string> => {
		if(!id) throw new AppError("User not found.", 404);
		try{
			const { rows } = await this.db.query( "SELECT token FROM tokens WHERE user_id = $1", [id] );
			const decrypted = crypt.decrypt(rows[0].token);
			return decrypted;
		}catch(err){
			throw err;
		};
	};

	verifyRefreshToken = async(token:string):Promise<string> => {
		if(!token) throw new AuthError("Failed to provide valid token.");
		try{
			const decryptedRefresh = crypt.decrypt(token);

			const verified = this.auth.verifyRefresh(decryptedRefresh);
			if(!verified) throw new AuthError("Failed to provide valid token.");	

			const { id } = this.auth.decode(decryptedRefresh) as { id:string, iat:number, exp:number };

			return id;
		}catch(e:Error | any){
			throw e;
		};
	};

	storeQuoteToken = async(quoteId:string, token:string) => {
		if(!quoteId) throw new AppError("Failed to provide quote id.", 400);
		if(!token) throw new AppError("Failed to provide valid token.", 400);
		try{
			const encrypted = crypt.encrypt(token);
			const results = await this.db.query(
			    `INSERT INTO quote_tokens (quote_id, token) 
			    VALUES($1, $2) 
			    RETURNING expires_at::date::text, token
			    `, [quoteId, encrypted]
			);

		return {
			expiry:results.rows[0].expires_at,
			token:results.rows[0].token
		};
		}catch(err){
			throw err;
		}
	};

	getQuoteToken = async(id:string, quoteId:string) => {
		if(!id) throw new AppError("User not found.", 404);
		if(!quoteId) throw new AppError("Quote not found.", 404);
		try{
			const results = await this.db.query(
			    `SELECT token FROM quote_tokens
			    WHERE user_id = $1
			    AND quote_id = $2
			    `, [id, quoteId]
			);

			const decrypted = crypt.decrypt(results.rows[0].token);
			return decrypted;
		}catch(err){
			throw err;
		}
    };
};


