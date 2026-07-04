import Auth from "../auth/auth.js";
import { db, test_db } from "../config/postgresql.config.js";
import { TokenService } from "../service/db/token.service.js";
import { sendPassReset, sendQuoteEmail } from "../service/email.service.js";
import { UserService } from "../service/db/user.service.js";
import quoteService from "../service/quote.service.js";
import { AppError, AuthenticationError } from "../error/error.handler.js";
import { catchAsync } from "../utils/catchAsync.js";
import { encrypt, decrypt } from "../utils/encrypt.js";
const userService = new UserService(test_db);
const tokenService = new TokenService(test_db);

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
        const status = "APPROVED";
		console.log("fired");
		const token = req.query.token;
		if(!token) return res.redirect(302, `${process.env.FRONTEND_URL}/404`);

		const decrypted = decrypt(token);
		const valid = Auth.verifyEmail(decrypted);
		if(!Object.hasOwn(valid.payload.purpose,"quote_acceptance")) return res.redirect(302, `${process.env.FRONTEND_URL}/404`);
	
		await quoteService.changeQuoteStatus(valid.payload.quoteId, status);
		return res.status(200);
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


	export const handlePasswordResetAcceptance = catchAsync(async(req,res) => {
		const { newPass } = req.body;
		if(!newPass) return res.status(400).json({ message: "Failed to provide input requirements.Please try again." });
		const token = req.query.token;
		if(!token) return res.redirect(302, `${process.env.FRONTEND_URL}/404`);

		const decrypted = decrypt(token);
		const valid = Auth.verifyEmail(decrypted);
		if(!Object.hasOwn(valid.payload.purpose,"password_reset")) return res.redirect(302, `${process.env.FRONTEND_URL}/404`);

		await userService.updatePassword(valid.payload.userId, newPass);	
		return res.status(200);
	}) 










