import { Auth } from "../auth/auth.js";
import { TokenService } from "../auth/service/token.ts";
import { sendPassReset, sendQuoteEmail } from "../service/email.ts";
import { AuthService } from "../auth/service/auth.ts";
import { QuoteService } from "../service/quote.ts";
import { AppError, AuthError } from "../error/error.handler.js";
import { catchAsync, crypt } from "../lib/lib.ts";
import type { VALIDATED_REQUEST } from "../types/param.d.ts";
import type { Request, Response } from "express";

export class EmailController{
	private quoteService:QuoteService;
	private authService:AuthService;
	private auth:Auth;
	private tokenService:TokenService;
	constructor(quoteService:QuoteService, authService:AuthService, auth:Auth, tokenService:TokenService){
		this.quoteService = quoteService;
		this.authService = authService;
		this.auth = auth;
		this.tokenService = tokenService;
	};
	
	handleSending = catchAsync(async(req:VALIDATED_REQUEST | any, res:Response) => { 
		const userId = req.user;
		const { quote, customerId } = await this.quoteService.createQuote({ userId, ...req.body });

		const emailToken = this.auth.signEmail({ userId, quoteId:quote.id, customerId, purpose: "quote_acceptance" }, "2d")
		const { expiry, token } = await this.tokenService.storeQuoteToken(quote.id, emailToken);
		const link = `${process.env.FRONTEND_URL}/quote/acceptance?token=${token}`;

		const user = await this.authService.getUserById(userId);
			
		await sendQuoteEmail({ 
			...req.body,
			user, 
			quote:{ 
				data: quote, 
				createdAt: quote.createdAt
			}, 
			link, 
			expiry 
		});

		return res.status(200).json({ success: true });
    });

   handleQuoteAcceptance = catchAsync(async(req:Request<{}, {}, {}, { token:string }>, res:Response) => {
		const token = req.query.token;
		if(!token) return res.status(400).json({ error:"Link has expired. Get in contact with sender inorder to send link again" });

		const decrypted = crypt.decrypt(token);

		const valid:any = this.auth.verifyEmail(decrypted);
		if(valid.payload.purpose !== "quote_acceptance") return res.redirect(302, `${process.env.FRONTEND_URL}/404`);

		const quote = await this.quoteService.getQuoteById(valid.payload.quoteId)
		if(!quote || quote.length === 0) return res.status(400).json({ error:"Failed to find valid quote." });

		return res.status(200).json({ success:true });
	});
	
	handleQuoteAcceptanceConfirm = catchAsync(async(req:Request<{}, {}, {}, { token:string }>,res:Response) => {
		const token = req.query.token;
		if(!token) return res.redirect(302, `${process.env.FRONTEND_URL}/404`);

		const decrypted = crypt.decrypt(token);
		const valid:any = this.auth.verifyEmail(decrypted);
		if(valid.payload.purpose !== "quote_acceptance") return res.redirect(302, `${process.env.FRONTEND_URL}/404`);


		const quote = await this.quoteService.getQuoteById(valid.payload.quoteId)
		if(!quote || quote.length === 0) return res.status(400).json({ error:"Failed to find valid quote." });
		if(quote.status === "APPROVED") return res.status(200);

		await this.quoteService.changeQuoteStatus(valid.payload.quoteId, "APPROVED");
		return res.status(200).json({ success:true });
	});

	sendPasswordReset = catchAsync(async(req:Request<{ email:string }>, res:Response) => {
		const { email } = req.body;
		if(!email) throw new AppError("Failed to provide email.", 400);

		const user = await this.authService.getUser(email);
		if(!user) throw new AuthError("Invalid credentials.");

		const token = this.auth.signEmail({ id: user.id, purpose: "password_reset" }, "5m");
		const safe = crypt.encrypt(token);

		await sendPassReset(user.email, safe);

		return res.status(200).json({ 
			success: true,
			message: "Successfully sent password reset." 
		});
	});

	 handlePasswordReset = catchAsync(async(req:Request, res:Response) => {
		const token = req.query.token;
		if(!token) return res.redirect(302, `${process.env.FRONTEND_URL}/404`);

		const decrypted = crypt.decrypt(token);
		const valid:any = this.auth.verifyEmail(decrypted);
		if(valid.payload.purpose !== "password_reset") return res.redirect(302, `${process.env.FRONTEND_URL}/404`);

		const user = await this.authService.getUserById(valid.payload.id);
		if(!user) return res.status(401).json({ error:"Unauthorized user" });

		return res.status(200).json({ success:true });
	}); 

	handlePasswordResetAcceptance = catchAsync(async(req:Request, res:Response) => {
		const { newPass,token } = req.body;
		if(!newPass) return res.status(400).json({ message: "Failed to provide input requirements.Please try again." });
		if(!token) return res.redirect(302, `${process.env.FRONTEND_URL}/404`);

		const decrypted = crypt.decrypt(token);
		const valid:any = this.auth.verifyEmail(decrypted);
		
		await this.authService.updatePassword(valid.payload.id, newPass);	

		return res.status(200);
	}); 
};
