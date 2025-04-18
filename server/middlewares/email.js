import { transporter } from "./email.config.js";
import { verificationEmailTemplate, welcomeEmailTemplate } from '../libs/emailTemplate.js';

export const SendVerificationCode = async (email, verificationCode, tempPassword = null) => {
    try {
        // Customize subject and template based on whether this is a regular user or seller
        const isSellerRegistration = tempPassword !== null;
        const subject = isSellerRegistration
            ? "Seller Account Verification - LokRise"
            : "Verify Your Email - LokRise";

        const textContent = isSellerRegistration
            ? `Your LokRise verification code is: ${verificationCode}. Your temporary password is: ${tempPassword}`
            : `Your LokRise verification code is: ${verificationCode}`;

        const htmlContent = isSellerRegistration
            ? verificationEmailTemplate(verificationCode, tempPassword)
            : verificationEmailTemplate(verificationCode);

        console.log(`Attempting to send verification email to: ${email}`);

        const response = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"LokRise" <thecreons@gmail.com>',
            to: email,
            subject: subject,
            text: textContent,
            html: htmlContent
        });

        console.log(`Email successfully sent to ${email}. Message ID: ${response.messageId}`);
        return { success: true, messageId: response.messageId };
    } catch (error) {
        console.error("Error sending verification email:", error);
        console.error("Email configuration:", {
            host: transporter.options.host,
            port: transporter.options.port,
            secure: transporter.options.secure,
            auth: { user: transporter.options.auth.user }
        });
        return { success: false, error: error.message };
    }
};

export const sendWelcomeEmail = async (email, name) => {
    try {
        console.log(`Sending welcome email to: ${email}`);

        const response = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"LokRise" <thecreons@gmail.com>',
            to: email,
            subject: "Welcome to LokRise!",
            text: `Hello, ${name}! Thank you for joining LokRise! Your email has been successfully verified, and your account is now active.`,
            html: welcomeEmailTemplate(name)
        });

        console.log(`Welcome email sent to ${email}. Message ID: ${response.messageId}`);
        return { success: true, messageId: response.messageId };
    } catch (error) {
        console.error("Error sending welcome email:", error);
        return { success: false, error: error.message };
    }
};