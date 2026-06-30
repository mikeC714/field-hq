export const quoteEmailTemplate = ({ userInfo, customer, link, senderName, expiry }) => (
	`
		<div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 20px;">

  <div style="background-color: #1a1a2e; padding: 28px 40px; border-radius: 8px 8px 0 0; display: flex; align-items: center; gap: 10px;">
    <div style="width: 32px; height: 32px; background-color: #f97316; border-radius: 8px;"></div>
    <span style="color: #ffffff; font-size: 17px; font-weight: 500;">Field HQ</span>
  </div>

  <div style="background-color: #ffffff; border: 1px solid #e5e5e0; border-top: none; padding: 40px; border-radius: 0 0 8px 8px;">
    <h2 style="margin: 0 0 12px; font-size: 22px; font-weight: 500; color: #1a1a1a;">Hi ${customer.firstName}, you've got a quote 📄</h2>
    <p style="margin: 0 0 28px; font-size: 15px; color: #666660; line-height: 1.7;">${senderName} has prepared a quote for your project. The full quote is attached to this email as a PDF — give it a look and follow the steps below when you're ready.</p>

    <p style="margin: 0 0 16px; font-size: 11px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; color: #999993;">How to accept</p>

    <div style="display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px;">
      <div style="width: 28px; height: 28px; min-width: 28px; border-radius: 50%; background-color: #fff4ed; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 500; color: #f97316;">1</div>
      <p style="margin: 0; font-size: 14px; color: #666660; line-height: 1.6; padding-top: 4px;"><strong style="color: #1a1a1a; font-weight: 500;">Open the attached PDF</strong> — it has a full breakdown of the work and pricing.</p>
    </div>

    <div style="display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px;">
      <div style="width: 28px; height: 28px; min-width: 28px; border-radius: 50%; background-color: #fff4ed; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 500; color: #f97316;">2</div>
      <p style="margin: 0; font-size: 14px; color: #666660; line-height: 1.6; padding-top: 4px;"><strong style="color: #1a1a1a; font-weight: 500;">Review the details</strong> — check the scope, start date, and total cost.</p>
    </div>

    <div style="display: flex; align-items: flex-start; gap: 14px; margin-bottom: 28px;">
      <div style="width: 28px; height: 28px; min-width: 28px; border-radius: 50%; background-color: #fff4ed; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 500; color: #f97316;">3</div>
      <p style="margin: 0; font-size: 14px; color: #666660; line-height: 1.6; padding-top: 4px;"><strong style="color: #1a1a1a; font-weight: 500;">Press the button below</strong> — once you're happy, hit accept and ${senderName} will be in touch.</p>
    </div>

    	<a href="${link}" style="display: inline-block; background-color: #f97316; color: #ffffff; font-size: 14px; font-weight: 500; padding: 12px 28px; border-radius: 8px; text-decoration: none; letter-spacing: 0.2px;">Accept quote → </a>
    	<p style="margin: 16px 0 0; font-size: 12px; color: #999993;"> This quote expires on ${expiry}. If you have any questions, contact us at ${userInfo.email}</p>
 	 </div>

  	<div style="padding: 20px 40px; border-top: 1px solid #e5e5e0; display: flex; justify-content: space-between; align-items: center;">
    	<p style="margin: 0; font-size: 12px; color: #999993; line-height: 1.6;">Sent by ${senderName} via Field HQ<br/>Questions? Just contact ${userInfo.first_name} at ${userInfo.email}.</p>
  	</div>

	</div>
	`
)
