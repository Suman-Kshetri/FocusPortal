import { ApiError } from "../utils/apiError.js";
import {
   passwordResetRequestTemplate,
   passwordResetSuccessTemplate,
   verificationEmailTemplate,
   welcomeEmailTemplate,
} from "./emailTemplete.js";
import { resend, sender } from "./resend.config.js";

export const sendVerificationEmail = async (
   email: string,
   verificationToken: string
) => {
   try {
      const { data, error } = await resend.emails.send({
         from: `${sender.name} <${sender.email}>`,
         to: [email],
         subject: "Verify your email",
         html: verificationEmailTemplate(verificationToken),
      });

      if (error) {
         console.error("Resend error:", error);
         throw new ApiError(501, error.message);
      }

      // console.log($&)
   } catch (error) {
      console.error(`Error in sending email verification: ${error}`);
      throw new ApiError(
         501,
         error instanceof Error ? error.message : String(error)
      );
   }
};

export const sendWelcomeEmail = async (email: string, fullname: string) => {
   try {
      const { data, error } = await resend.emails.send({
         from: `${sender.name} <${sender.email}>`,
         to: [email],
         subject: "Welcome to Focus Portal!",
         html: welcomeEmailTemplate(fullname),
      });

      if (error) {
         console.error("Resend error:", error);
         throw new Error(error.message);
      }

      // console.log($&)
   } catch (error) {
      console.error(
         "Error in sending welcome email !!",
         error instanceof Error ? error.message : String(error)
      );
   }
};

export const sendPasswordResetEmail = async (
   email: string,
   resetUrl: string
) => {
   try {
      const { data, error } = await resend.emails.send({
         from: `${sender.name} <${sender.email}>`,
         to: [email],
         subject: "Reset your Password",
         html: passwordResetRequestTemplate(resetUrl),
      });

      if (error) {
         console.error("Resend error:", error);
         throw new ApiError(503, error.message);
      }

      // console.log($&)
   } catch (error) {
      throw new ApiError(
         503,
         error instanceof Error ? error.message : String(error)
      );
   }
};

export const resetPasswordSuccessEmail = async (email: string) => {
   try {
      const { data, error } = await resend.emails.send({
         from: `${sender.name} <${sender.email}>`,
         to: [email],
         subject: "Reset Password Successful.",
         html: passwordResetSuccessTemplate(),
      });

      if (error) {
         console.error("Resend error:", error);
         throw new ApiError(503, error.message);
      }

      // console.log($&)
   } catch (error) {
      throw new ApiError(
         503,
         error instanceof Error ? error.message : String(error)
      );
   }
};
