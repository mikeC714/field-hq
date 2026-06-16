import Auth from "../auth/auth.js";
import tokenService from "../service/db/token.service.js";
import { sendPassReset, sendQuoteEmail } from "../service/email.service.js";
import userService from "../service/db/user.service.js";
import quoteService from "../service/quote.service.js";
import { AppError, AuthenticationError } from "../error/error.handler.js";
import { catchAsync } from "../utils/catchAsync.js";

	export const handleSending = catchAsync(async(req, res) => { 
        const user = req.user;
        const { customer, labor, materials, quote } = req.body;

		const { quoteId, customerId } = await quoteService.createQuote(user, customer, quote, labor, materials);

		const emailToken = Auth.signEmail({ id: user, quoteId, customerId }, "2d")
		const expiry = await tokenService.storeQuoteToken(quoteId, emailToken);
		const link = `${process.env.FRONTEND_URL}/quote/acceptance?token=${emailToken}`;


        const userInfo = await userService.getUserById(user);
        await sendQuoteEmail({ userInfo, quoteInfo: quote, materials, labor, customer, link, expiry });

		return res.status(200).json({ success: true });
    })

    export const handleAcceptance = catchAsync(async(req, res) => {
        const token = req.query.token;
        if(!token) return res.redirect(302, `${process.env.FRONTEND_URL}/not-found`);

        const valid = Auth.verifyEmail(token);
        const status = "APPROVED";
        await quoteService.changeQuoteStatus(valid.payload.quoteId, status);
	
		res.redirect(302,`${process.env.FRONTEND_URL}/thank-you`);
	})

	export const sendPasswordReset = catchAsync(async(req, res) => {
		const { email } = req.body;
		if(!email) throw new AppError("Failed to provide email.", 400);
		const user = await userService.getUser(email);
		if(!user) throw new AuthenticationError("Invalid credentials.");

		const token = Auth.signEmail({ id: user.id }, "5m");
		await sendPassReset(user.email, token);

		return res.status(200).json({ 
			success: true,
			message: "Successfully sent password reset." 
		});
	})

