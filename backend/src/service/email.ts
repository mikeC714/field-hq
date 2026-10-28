import { pdf } from "../public/pdfTemplate.ts";
import { quoteEmailTemplate } from "../public/quoteTemplate.ts";
import { passwordResetEmailTemplate } from '../public/passwordResetTemplate.ts';
import { AppError } from "../error/error.ts" 
import { Resend } from 'resend';
import type { QUOTE_CONTENT } from "../types/quote.d.ts";



export class EmailService{
	private resend:Resend;
	constructor(resend:Resend){
		this.resend = resend;
	};

	sendQuote = async(content:QUOTE_CONTENT, expiry:string, link:string) => {
		const senderName = `${content.user.firstName} ${content.user.lastName} `;
		try{
			if(!Object.entries(content.quote).length) throw new AppError("Failed to provide quote info. Cannot send empty quote.", 400);

			const pdfBuffer:any = await pdf({ ...content, expiry });
			const { error } = await this.resend.emails.send({
				from: `${senderName}  <noreply@field-hq.com>`,
				to: content.customer.email,
				subject: 'Quote',
				html: quoteEmailTemplate({ 
					user:content.user, 
					customer:content.customer, 
					link, senderName, expiry 
				}),
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

	sendPassReset = async(userEmail:string, token:string) => {
		const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
		try{

			const { error } = await this.resend.emails.send({
				from:`noreply@field-hq.com`,
				to: userEmail,
				subject: 'Password Reset',
				html:  passwordResetEmailTemplate(link),
			});
			if(error) throw error;

		}catch(err){
			throw err
		}
	};
};
