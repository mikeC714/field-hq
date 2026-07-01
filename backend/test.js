import { test, mock }from "node:test";
import assert from "node:assert";
import jwt from "jsonwebtoken";

    export const handleAcceptance = catchAsync(async(req, res) => {
		console.log("fired");
        const token = req.query.token;
        if(!token) return res.redirect(302, `${process.env.FRONTEND_URL}/not-found`);
		console.log(token);

        const valid = Auth.verifyEmail(token);
		console.log("valid")
        const status = "APPROVED";
        await quoteService.changeQuoteStatus(valid.payload.quoteId, status);
	
		res.redirect(302,`${process.env.FRONTEND_URL}/thank-you`);
	})

test("Quote Acceptance", async (t) => {
	mock.method(jwt, 'verify', () => ({ id:123, quoteId: 456, customerId: 789 }));
	
	const req = {query: { token }};
	let statusCalled = null;
	let res = { status: (code) => { statusCalled = code; return { end: () => {}}; }};

	handleAcceptance(req, res);
})


