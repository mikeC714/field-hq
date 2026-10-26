export const passwordResetEmailTemplate = (resetUrl) => (
  `
  <!DOCTYPE html>
  <html lang="en" style="margin: 0; padding: 0; box-sizing: border-box;">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password – Field HQ</title>
  </head>
  <body style="margin: 0; box-sizing: border-box; background-color: #EBEBEB; font-family: Arial, sans-serif; padding: 40px 16px;">
    <div style="max-width: 520px; margin: 0 auto;">

      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background-color: #F97316; border-radius: 8px;"></div>
          <span style="font-size: 18px; font-weight: 700; color: #1A1A1A; letter-spacing: -0.3px;">Field <span style="color: #F97316;">HQ</span></span>
        </div>
      </div>

      <div style="background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06);">
        <div style="height: 4px; background: linear-gradient(90deg, #F97316 0%, #FB923C 100%);"></div>
        <div style="padding: 44px 48px 48px;">

          <h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #111111; letter-spacing: -0.4px; line-height: 1.2;">Reset your password</h1>
          <p style="margin: 0 0 32px; font-size: 15px; color: #555555; line-height: 1.65;">
            We received a request to reset the password for your Field HQ account. Click the button below to choose a new one.
          </p>

          <div style="margin-bottom: 32px;">
            <a href="${resetUrl}" style="display: inline-block; background: #F97316; color: #FFFFFF; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 10px; letter-spacing: 0.1px;">Reset Password</a>
          </div>

          <hr style="border: none; border-top: 1px solid #EBEBEB; margin: 0 0 28px;">

          <div style="display: flex; align-items: flex-start; gap: 10px; background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 10px; padding: 14px 16px;">
            <p style="margin: 0; font-size: 13px; color: #92400E; line-height: 1.5;">⏱ This link expires in <strong>5 minutes</strong>. If it has expired, you can request a new one from the login page.</p>
          </div>

        </div>
      </div>

      <div style="text-align: center; margin-top: 28px;">
        <p style="margin: 0; font-size: 12px; color: #999999; line-height: 1.6;">
          © 2026 Field HQ. All rights reserved.<br>
          You're receiving this because a password reset was requested for your account.
        </p>
      </div>

    </div>
  </body>
  </html>
  `
)
