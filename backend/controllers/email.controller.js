import Auth from "../auth/auth.js";
import { db, test_db } from "../config/postgresql.config.js";
import { TokenService } from "../service/db/token.service.js";
import { sendPassReset, sendQuoteEmail } from "../service/email.service.js";
import { UserService } from "../service/db/user.service.js";
import { QuoteService } from "../service/quote.service.js";
import { AppError, AuthenticationError } from "../error/error.handler.js";
import { catchAsync } from "../utils/catchAsync.js";
import { encrypt, decrypt } from "../utils/encrypt.js";
const quoteService = new QuoteService(db)
const userService = new UserService(db);
const tokenService = new TokenService(db);

	export const handleSending = catchAsync(async(req, res) => { 
		const id = req.user;
        const { customer, labor, materials, quote } = req.body;
		const { quoteData, customerId } = await quoteService.createQuote(id, customer, quote, labor, materials);

		const emailToken = Auth.signEmail({ id, quoteId: quoteData.id, customerId, purpose: "quote_acceptance" }, "2d")
		const { expiry, token } = await tokenService.storeQuoteToken(quoteData.id, emailToken);
		const link = `${process.env.FRONTEND_URL}/quote/acceptance?token=${token}`;

		const user = await userService.getUserById(id);
			
        await sendQuoteEmail({ 
			userInfo: user, 
			quote:{ 
				data: quote, 
				created_at: quoteData.created_at
			}, 
			materials, 
			labor, 
			customer, 
			link, 
			expiry 
		});

		return res.status(200).json({ success: true });
    })

    export const handleQuoteAcceptance = catchAsync(async(req, res) => {
		const token = req.query.token;
		if(!token) return res.status(400).json({ error:"Link has expired. Get in contact with sender inorder to send link again" });
		const decrypted = decrypt(token);
		const valid = Auth.verifyEmail(decrypted);
		if(valid.payload.purpose !== "quote_acceptance") return res.redirect(302, `${process.env.FRONTEND_URL}/404`);

		const quote = await quoteService.getQuoteById(valid.payload.quoteId)
		if(!quote || quote.length === 0) return res.status(400).json({ error:"Failed to find valid quote." });

		return res.status(200).json({ success:true });
	})
	
	export const handleQuoteAcceptanceConfirm = catchAsync(async(req,res) => {
		const token = req.query.token;
		if(!token) return res.redirect(302, `${process.env.FRONTEND_URL}/404`);
		const decrypted = decrypt(token);
		const valid = Auth.verifyEmail(decrypted);
		if(valid.payload.purpose !== "quote_acceptance") return res.redirect(302, `${process.env.FRONTEND_URL}/404`);

		const quote = await quoteService.getQuoteById(valid.payload.quoteId)
		if(!quote || quote.length === 0) return res.status(400).json({ error:"Failed to find valid quote." });
		if(quote.status === "APPROVED") return res.status(200);

		await quoteService.changeQuoteStatus(valid.payload.quoteId, "APPROVED");
		return res.status(200).json({ success:true });
	})

	export const sendPasswordReset = catchAsync(async(req, res) => {
		const { email } = req.body;
		if(!email) throw new AppError("Failed to provide email.", 400);
		const user = await userService.getUser(email);
		if(!user) throw new AuthenticationError("Invalid credentials.");

		const token = Auth.signEmail({ id: user.id, purpose: "password_reset" }, "5m");
		const safe = encrypt(token);
		await sendPassReset(user.email, safe);

		return res.status(200).json({ 
			success: true,
			message: "Successfully sent password reset." 
		});
	})


	export const handlePasswordReset = catchAsync(async(req,res) => {
		const token = req.query.token;
		if(!token) return res.redirect(302, `${process.env.FRONTEND_URL}/404`);

		const decrypted = decrypt(token);
		const valid = Auth.verifyEmail(decrypted);
		if(valid.payload.purpose !== "password_reset") return res.redirect(302, `${process.env.FRONTEND_URL}/404`);
		console.log(valid);

		const user = await userService.getUserById(valid.payload.id);
		if(!user) return res.status(401).json({ error:"Unauthorized user" });
		return res.status(200).json({ success:true });
	}) 

	export const handlePasswordResetAcceptance = catchAsync(async(req,res) => {
		const { newPass,token } = req.body;
		if(!newPass) return res.status(400).json({ message: "Failed to provide input requirements.Please try again." });
		if(!token) return res.redirect(302, `${process.env.FRONTEND_URL}/404`);

		const decrypted = decrypt(token);
		const valid = Auth.verifyEmail(decrypted);
		console.log(valid);
		
		await userService.updatePassword(valid.payload.id, newPass);	
		return res.status(200);
	}) 









