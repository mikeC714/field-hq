import express from 'express';
import { Auth } from "./auth/auth.ts";
import { AuthService } from "./auth/service/auth.ts";
import { TokenService } from "./auth/service/token.ts";
import { QuoteService } from "./service/quote.ts";
import { CustomerService } from "./service/customer.ts";
import { EmailService } from "./service/email.ts";
import { AuthRoutes } from "./auth/auth.routes.ts";
import { QuoteRoutes } from "./routes/quote.ts";
import { CustomerRoutes } from "./routes/customer.ts";
import { EmailRoutes } from "./routes/email.ts";
import { AppError, AuthError } from "./error/error.ts";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from "helmet";
import type { Request, Response, NextFunction } from "express";

export async function build(db:any, resend:any){
	const app = express();

	const auth = new Auth();
	const authService = new AuthService(db);
	const tokenService = new TokenService(db, auth);
	const quoteService = new QuoteService(db);
	const customerService = new CustomerService(db);
	const emailService = new EmailService(resend)

	app.use(express.json());
	app.use(cookieParser());
	app.use(helmet());
	app.use(cors({
	    origin: process.env.FRONTEND_URL,
	    credentials: true
	}));

	app.use('/api', AuthRoutes(auth, authService, tokenService));
	app.use('/api', CustomerRoutes(customerService, quoteService));
	app.use('/api', QuoteRoutes(quoteService, customerService, auth, tokenService));
	app.use('/api', EmailRoutes(emailService, tokenService, quoteService, authService, auth));


	app.use((req:Request, res:Response) => {
		res.redirect(302, `${process.env.FRONTEND_URL}/404`);
	})
	app.use((err:Error | any, req:Request, res:Response, next:NextFunction) => {
		let status = 500;
		if(err instanceof AppError){
			return res.status(err.statusCode).json({ error: err.message })
		}else if(err instanceof AuthError){
			return res.status(err.statusCode).json({ error:err.message })
		}
		return res.status(err.statusCode || status).json({ error: err.message })
	})

	
	return app
};

