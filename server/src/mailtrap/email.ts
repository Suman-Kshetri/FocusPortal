import { ApiError } from "../utils/apiError.js";
import { passwordResetRequestTemplate, passwordResetSuccessTemplate, verificationEmailTemplate } from "./emailTemplete.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (
   email: string,
   verificationToken: string
) => {
   const recepient = [{ email }];
   try {
      const response = await mailtrapClient.send({
         from: sender,
         to: recepient,
         subject: "Verify your email",
         html: verificationEmailTemplate(verificationToken),
         category: "Email Verfication",
      });
      console.log("Email sent successfully");
   } catch (error) {
      console.error(`Error in sending email verification: ${error}`);
      throw new ApiError(
         501,
         "Error sending verification email !!!",
         error?.message
      );
   }
};

export const sendWelcomeEmail = async (email, fullname) => {
   const recepient = [{ email }];
   try {
      const response = await mailtrapClient.send({
         from: sender,
         to: recepient,
         template_uuid: "14014e74-5b91-436c-b1a2-3569049d2ded",

         template_variables: {
            name: fullname,
            company_info_name: "Focus Portal",
            company_info_address: "Pokhara-5 malepatan",
            company_info_city: "Pokhara",
            company_info_zip_code: "696969",
            company_info_country: "Nepal",
         },

      });
      console.log("Welcome email sent seccessfully ");
   } catch (error) {
    console.error("Error in sending welcome email !!", error?.message);
   }
};

export const sendPsswordResetEmail = async(email, resetUrl) => {
   const recepient = [{email}];
   try {
      const response = await mailtrapClient.send({
         from: sender,
         to: recepient,
         subject: "Reset your Password",
         html: passwordResetRequestTemplate(resetUrl),
         category: "Password Reset"

      })
   } catch (error) {
      throw new ApiError(503,"Error in sending reset password email");
   }
}

export const resetPasswordSuccessEmail = async(email) => {
   const recepient = [{email}];
   try {
      const response = await mailtrapClient.send({
         from: sender,
         to: recepient,
         subject: "Reset Password Successfull.",
         html: passwordResetSuccessTemplate(),
         category: "Reset Password"
      })
   } catch (error) {
      throw new ApiError(503,"Error in sending reset password successfull email !!");
   }
}