import { Resend } from 'resend';
import { AppError } from '../error/error.handler.js';
import { pdf } from "../public/pdfTemplate.js";
import { quoteEmailTemplate } from "../public/emailTemplate.js";
import { passwordResetEmailTemplate } from '../public/passwordResetTemplate.js';
const resend = new Resend(process.env.RESEND_KEY)

	export async function sendQuoteEmail({ userInfo, quote, materials, labor, customer, link, expiry }){
		const senderName = `${userInfo.first_name} ${userInfo.last_name} `;
		try{
        	if(!quote) throw new AppError("Failed to provide quote info. Cannot send empty quote.", 400);
			const pdfBuffer = await pdf({ quote, materials, labor, user: userInfo, customer, expiry });
			const { error } = await resend.emails.send({
                from: `${senderName}  <noreply@field-hq.com>`,
                to: customer.email,
                subject: 'Quote',
				html: quoteEmailTemplate({ userInfo, customer, link, senderName, expiry }) ,
				attachments: [
					{
						filename: `quote.pdf`,
						content: pdfBuffer.toString("base64"),
						contentType:"application/pdf"
					}
				]
            });
            if(error) throw error;
		}catch(err){
			throw err;
		}
	};

	export async function sendPassReset(userEmail, token){
		const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
		try{
			const { error } = await resend.emails.send({
				from:`noreply@field-hq.com`,
				to: userEmail,
				subject: 'Password Reset',
				html:  passwordResetEmailTemplate(link),
			});
			if(error) throw error;
		}catch(err){
			throw err
		}
	}

