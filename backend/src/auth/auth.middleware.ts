import Auth from "../auth/auth.js";
import { db } from "../config/postgresql.config.js";
import { TokenService } from "../service/db/token.service.js";
import { Mutex } from "async-mutex";
import { cache } from "../config/redis.config.js";
import { decrypt } from "../utils/encrypt.js";
import { AuthenticationError } from "../error/error.handler.js";
const tokenService = new TokenService(db);

const mutex = new Mutex();

/**
    @AuthMiddleware
    
    * binds methods verifyToken n handleRefresh since (this) instance is dropped when utilizing verifyToken 
        causing handleRefresh to be undefined
    
    @verifyToken

    * Validates user is sending valid, active access token
    * If access token is invalid but their refresh is active handleRefresh is called
    * If access is valid req.user is set 

    @handleRefresh 
    ** THE BIGGEST PAIN IN THE ASS. TRULY HUMBLING THOUGH SHOWING HOW STUPID I STILL AM
    * Called by verifyToken if access_token is expired but refresh_token is active
    * Token is decrypted and validated
    * Since the main issue when rotating tokens is concurrency a lock (mutex) is put into play
    * lock is initialized using the users id from token payload
    * A validation is ran based on the cached data receieved from the winner condition
    * If token is cached req.user is set to id and return is called stopping other concurrent requests attempting to rotate refresh token
    * Reuse abuse is monitored using the winner conditoins refresh token comparing the value to the currently stored token if they don't match user account is flagged and session is ended
    * Refresh token is deleted successfully rotating and generating new credentials 
    * sets winner condition with expiration of 5s
*/


	export async function verifyToken (req, res, next){
		const accessToken = req.cookies.access_token;
		const refreshToken = req.cookies.refresh_token;
	
		try{
			if(!accessToken && !refreshToken) throw new AuthenticationError("Unauthorized user. Failed to provide valid token.");	
			if(!accessToken && refreshToken) return await handleRefresh(req, res, next, refreshToken);
			
			const decode = Auth.verify(accessToken);

            req.user = decode.payload.id;
            next();
        }catch(err){
			if(err.name === "TokenExpiredError" && refreshToken) return await handleRefresh(req, res, next, refreshToken);
            next(err);
        }
    }
    
	async function handleRefresh (req, res, next, refreshToken){
		try{
        	const rToken = decrypt(refreshToken);
        	const decode = Auth.verifyRefresh(rToken);
        	const id = decode.payload.id;

			const release = await mutex.acquire();
			try{
					const alreadyRotated = await cache.get(`rotated:${id}`);
					if(alreadyRotated){
    					const tokens = JSON.parse(alreadyRotated);
    					res.cookie("access_token", tokens.access, {
                			httpOnly: true,
                			secure: false,
                			sameSite: 'strict',
                			maxAge: 900000 // 15M
						});
    					res.cookie("refresh_token", tokens.refresh, {
                			httpOnly:true,
                			secure: false,
                			sameSite: 'strict',
                			maxAge: 604800000 // 7D
						});
						req.user = id;
						return next();
					}
            		await tokenService.deleteRefreshToken(id, refreshToken);
	
            		const newAccess = Auth.sign({ id });
            		const newRefresh = Auth.signRefresh({ id });
				
					const stored = await tokenService.storeRefreshToken(id, newRefresh);

					await cache.set(
						`rotated:${id}`, 
						JSON.stringify(
							{
								access:	newAccess,
								refresh: stored
							}), 
						'EX', 10);


				res.cookie("access_token", newAccess, {
                		httpOnly: true,
                		secure: false,
                		sameSite: 'strict',
                		maxAge: 900000 // 15M
            		})
            		res.cookie("refresh_token", stored, {
                		httpOnly:true,
                		secure: false,
                		sameSite: 'strict',
                		maxAge: 604800000 // 7D
            		})
			
            		req.user = id;
        			return next();
				}catch(e){
					throw e;
				}finally{
					release();
				}
        	}catch(err){
            	next(err);
        	}
		}




