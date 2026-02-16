const BRAND_PRIMARY = "#4CAF50";
const BRAND_SECONDARY = "#45a049";
const BRAND_NAME = "Focus Portal";
const BRAND_LOGO =
   "https://res.cloudinary.com/dhhoe8u50/image/upload/f_png/v1754997321/focusportal";

const emailHeader = (title: string) => `
  <div style="background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, ${BRAND_SECONDARY} 100%); padding: 32px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    ${BRAND_LOGO ? `<img src="${BRAND_LOGO}" alt="${BRAND_NAME} Logo" style="max-width: 140px; margin-bottom: 16px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));" />` : ""}
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${title}</h1>
  </div>
`;

const emailFooter = `
  <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 13px; line-height: 1.6;">
    <p style="margin: 0;">This is an automated message, please do not reply to this email.</p>
    <p style="margin: 8px 0 0 0;">© ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
  </div>
`;

export const verificationEmailTemplate = (verificationCode: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1);">
    ${emailHeader("Verify Your Email")}
    <div style="padding: 40px 32px;">
      <p style="margin: 0 0 16px 0; font-size: 16px;">Hello,</p>
      <p style="margin: 0 0 24px 0; font-size: 16px; color: #4b5563;">Thank you for signing up! Your verification code is:</p>
      <div style="text-align: center; margin: 40px 0; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 32px; border-radius: 12px; border: 2px dashed ${BRAND_PRIMARY};">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: ${BRAND_PRIMARY}; font-family: 'Courier New', monospace;">${verificationCode}</span>
      </div>
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #4b5563;">Enter this code on the verification page to complete your registration.</p>
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px; margin: 24px 0;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">⏱️ <strong>Important:</strong> This code will expire in 15 minutes for security reasons.</p>
      </div>
      <p style="margin: 24px 0 0 0; font-size: 14px; color: #6b7280;">If you didn't create an account with us, please ignore this email.</p>
      <p style="margin: 32px 0 0 0; font-size: 15px; color: #4b5563;">Best regards,<br><strong style="color: ${BRAND_PRIMARY};">${BRAND_NAME} Team</strong></p>
    </div>
    ${emailFooter}
  </div>
</body>
</html>
`;

export const welcomeEmailTemplate = (fullname: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${BRAND_NAME}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1);">
    ${emailHeader("Welcome to Focus Portal!")}
    <div style="padding: 40px 32px;">
      <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #111827;">Hello ${fullname},</p>
      <p style="margin: 0 0 24px 0; font-size: 16px; color: #4b5563;">Welcome to Focus Portal! We're thrilled to have you on board. 🎉</p>
      <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563;">You're all set to start using our platform and unlock your full potential. Here's what you can do next:</p>
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%); padding: 24px; border-radius: 8px; margin: 28px 0; border: 1px solid #d1fae5;">
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="padding: 14px 0; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; font-size: 15px;">
            <span style="background-color: ${BRAND_PRIMARY}; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 14px; flex-shrink: 0;">✓</span>
            <span style="color: #374151;">Complete your profile</span>
          </li>
          <li style="padding: 14px 0; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; font-size: 15px;">
            <span style="background-color: ${BRAND_PRIMARY}; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 14px; flex-shrink: 0;">✓</span>
            <span style="color: #374151;">Explore our features</span>
          </li>
          <li style="padding: 14px 0; display: flex; align-items: center; font-size: 15px;">
            <span style="background-color: ${BRAND_PRIMARY}; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 14px; flex-shrink: 0;">✓</span>
            <span style="color: #374151;">Start your first project</span>
          </li>
        </ul>
      </div>
      <p style="margin: 24px 0 16px 0; font-size: 15px; color: #4b5563;">If you have any questions or need assistance, our support team is always here to help.</p>
      <p style="margin: 0 0 32px 0; font-size: 15px; color: #4b5563;">Thank you for choosing Focus Portal. Let's make great things happen together!</p>
      <p style="margin: 0; font-size: 15px; color: #4b5563;">Best regards,<br><strong style="color: ${BRAND_PRIMARY};">${BRAND_NAME} Team</strong></p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 36px 0;">
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px;">
        <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.8;">
          <strong style="color: #374151; font-size: 14px;">${BRAND_NAME}</strong><br>
          Pokhara-5 malepatan<br>
          Pokhara, 696969<br>
          Nepal
        </p>
      </div>
    </div>
    ${emailFooter}
  </div>
</body>
</html>
`;

export const passwordResetRequestTemplate = (resetURL: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1);">
    ${emailHeader("Password Reset")}
    <div style="padding: 40px 32px;">
      <p style="margin: 0 0 16px 0; font-size: 16px;">Hello,</p>
      <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563;">We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
      <p style="margin: 0 0 32px 0; font-size: 15px; color: #4b5563;">To reset your password, click the button below:</p>
      <div style="text-align: center; margin: 36px 0;">
        <a href="${resetURL}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, ${BRAND_SECONDARY} 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(76, 175, 80, 0.3); transition: transform 0.2s;">Reset Password</a>
      </div>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 32px 0;">
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; font-weight: 600;">If the button above doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: ${BRAND_PRIMARY}; font-size: 13px; margin: 0; font-family: 'Courier New', monospace;">${resetURL}</p>
      </div>
      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 6px; margin: 24px 0;">
        <p style="margin: 0; font-size: 14px; color: #991b1b;">🔒 <strong>Security Notice:</strong> This link will expire in 1 hour for security reasons.</p>
      </div>
      <p style="margin: 24px 0 0 0; font-size: 15px; color: #4b5563;">Best regards,<br><strong style="color: ${BRAND_PRIMARY};">${BRAND_NAME} Team</strong></p>
    </div>
    ${emailFooter}
  </div>
</body>
</html>
`;

export const passwordResetSuccessTemplate = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1);">
    ${emailHeader("Password Reset Successful")}
    <div style="padding: 40px 32px;">
      <p style="margin: 0 0 16px 0; font-size: 16px;">Hello,</p>
      <p style="margin: 0 0 32px 0; font-size: 15px; color: #4b5563;">We're writing to confirm that your password has been successfully reset.</p>
      <div style="text-align: center; margin: 36px 0;">
        <div style="background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, ${BRAND_SECONDARY} 100%); color: white; width: 80px; height: 80px; line-height: 80px; border-radius: 50%; display: inline-block; font-size: 40px; box-shadow: 0 8px 16px rgba(76, 175, 80, 0.3);">
          ✓
        </div>
      </div>
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px; margin: 32px 0;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">⚠️ <strong>Important:</strong> If you did not initiate this password reset, please contact our support team immediately.</p>
      </div>
      <p style="margin: 24px 0 12px 0; font-size: 15px; color: #4b5563; font-weight: 600;">For security reasons, we recommend that you:</p>
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin: 16px 0 32px 0;">
        <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
          <li style="margin: 8px 0; font-size: 14px;">Use a strong, unique password</li>
          <li style="margin: 8px 0; font-size: 14px;">Enable two-factor authentication if available</li>
          <li style="margin: 8px 0; font-size: 14px;">Avoid using the same password across multiple sites</li>
        </ul>
      </div>
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #4b5563;">Thank you for helping us keep your account secure.</p>
      <p style="margin: 24px 0 0 0; font-size: 15px; color: #4b5563;">Best regards,<br><strong style="color: ${BRAND_PRIMARY};">${BRAND_NAME} Team</strong></p>
    </div>
    ${emailFooter}
  </div>
</body>
</html>
`;
