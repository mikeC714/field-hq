import { Auth } from "../auth/auth.ts";
import { TokenService } from "../auth/service/token.ts";
import { EmailService } from "../service/email.ts";
import { AuthService } from "../auth/service/auth.ts";
import { QuoteService } from "../service/quote.ts";
import { AppError, AuthError } from "../error/error.ts";
import { catchAsync, crypt } from "../lib/lib.ts";
import type { VALIDATED_REQUEST } from "../types/param.d.ts";
import type { Request, Response } from "express";

export class EmailController{
	private quoteService:QuoteService;
	private emailService:EmailService;
	private authService:AuthService;
	private tokenService:TokenService;
	private auth:Auth;
	constructor(quoteService:QuoteService, emailService:EmailService, tokenService:TokenService, authService:AuthService, auth:Auth){
		this.quoteService = quoteService;
		this.emailService = emailService;
		this.tokenService = tokenService;
		this.authService = authService;
		this.auth = auth;
	};

	sendPasswordReset = catchAsync(async(req:Request<{ email:string }>, res:Response) => {
		const { email } = req.body;
		if(!email) throw new AppError("Failed to provide email.", 400);

		const user = await this.authService.getUser(email);
		if(!user) throw new AuthError("Invalid credentials.");

		const token = this.auth.signEmail({ id: user.id, purpose: "password_reset" }, "5m");
		const safe = crypt.encrypt(token);

		await this.emailService.sendPassReset(user.email!, safe);

		return res.status(200).json({ success:true });
	});
	
	sendQuote = catchAsync(async(req:VALIDATED_REQUEST | any, res:Response) => { 
		const userId = req.user;
		const { quote, customerId } = await this.quoteService.createQuote({ userId, ...req.body });

		const emailToken = this.auth.signEmail({ userId, quoteId:quote.id, customerId, purpose: "quote_acceptance" }, "2d")
		const { expiry, token } = await this.tokenService.storeQuoteToken(quote.id, emailToken);
		const link = `${process.env.FRONTEND_URL}/quote/acceptance?token=${token}`;

		const user = await this.authService.getUserById(userId);
			
		await this.emailService.sendQuote({ 
			...req.body, 
			user, 
			quote:{ 
				data:quote, 
				createdAt:quote.createdAt 
			}}, 
			link, 
			expiry 
		);

		return res.status(200).json({ success: true });
    });


};
