import { transporter } from "./email.config.js";
import { verificationEmailTemplate, welcomeEmailTemplate } from '../libs/emailTemplate.js';


export const SendVerificationCode = async (email, verificationCode) => {

    try {
        const response = await transporter.sendMail({
            from: '"LokRise" <thecreons@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify Your Email - LokRise",
            text: `Your LokRise verification code is: ${verificationCode}`,
            html: verificationEmailTemplate(verificationCode)
        });
        console.log("Email sent:", response.messageId);
        return response;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

export const sendWelcomeEmail = async (email, name) => {
    try {
        const response = await transporter.sendMail({
            from: '"LokRise" <thecreons@gmail.com>',
            to: email,
            subject: "Welcome to LokRise!",
            text: `Hello, ${name}! Thank you for joining LokRise! Your email has been successfully verified, and your account is now active.`,
            html: welcomeEmailTemplate(email)
        });

        return response;
    } catch (error) {
        console.error("Error sending welcome email:", error);
        throw error;
    }
};