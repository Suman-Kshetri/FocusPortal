const BRAND_PRIMARY = "#4CAF50";
const BRAND_SECONDARY = "#45a049";
const BRAND_NAME = "Focus Portal";
const BRAND_LOGO = "https://res.cloudinary.com/dhhoe8u50/image/upload/f_png/v1754997321/focusportal";


const emailHeader = (title) => `
  <div style="background: linear-gradient(to right, ${BRAND_PRIMARY}, ${BRAND_SECONDARY}); padding: 20px; text-align: center;">
    ${BRAND_LOGO ? `<img src="${BRAND_LOGO}" alt="${BRAND_NAME} Logo" style="max-width: 120px; margin-bottom: 10px;" />` : ""}
    <h1 style="color: white; margin: 0;">${title}</h1>
  </div>
`;


const emailFooter = `
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
`;

export const verificationEmailTemplate = (verificationCode) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${emailHeader("Verify Your Email")}
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: ${BRAND_PRIMARY};">${verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>${BRAND_NAME}</p>
  </div>
  ${emailFooter}
</body>
</html>
`;


export const passwordResetRequestTemplate = (resetURL) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${emailHeader("Password Reset")}
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetURL}" style="background-color: ${BRAND_PRIMARY}; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>If the button above doesn’t work, copy and paste this link into your browser:</p>
    <p style="word-break: break-word; color: ${BRAND_PRIMARY};">${resetURL}</p>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>${BRAND_NAME}</p>
  </div>
  ${emailFooter}
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
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${emailHeader("Password Reset Successful")}
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: ${BRAND_PRIMARY}; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>${BRAND_NAME}</p>
  </div>
  ${emailFooter}
</body>
</html>
`;
