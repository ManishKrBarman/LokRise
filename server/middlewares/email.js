import { transporter } from "./email.config.js";
import { verificationEmailTemplate, welcomeEmailTemplate } from '../libs/emailTemplate.js';

export const SendVerificationCode = async (email, verificationCode, tempPassword = null) => {
    try {
        // Customize subject and template based on whether this is a regular user or seller
        const isSellerRegistration = tempPassword !== null;
        const subject = isSellerRegistration
            ? "Seller Account Verification - LokRise"
            : "Verify Your Email - LokRise";

        // The simple HTML content that will work more reliably (similar to test email)
        const simpleHtmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3b82f6;">Verify Your Email - LokRise</h2>
                <p>Thanks for signing up! Please use the verification code below to complete your registration:</p>
                <div style="background-color: #f0f4ff; padding: 15px; border-radius: 8px; font-size: 28px; 
                    text-align: center; letter-spacing: 5px; font-weight: bold; color: #3b82f6; margin: 20px 0;">
                    ${verificationCode}
                </div>
                <p>This code will expire in <strong>30 minutes</strong>.</p>
                ${isSellerRegistration ?
                `<p>Your temporary password is: <strong>${tempPassword}</strong></p>` :
                ''}
                <p>If you didn't request this verification, you can safely ignore this email.</p>
                <p style="margin-top: 20px;">– The LokRise Team</p>
            </div>
        `;

        console.log(`[EMAIL] Attempting to send verification email to: ${email} with code: ${verificationCode}`);

        // Use the same structure as the test email which works
        const response = await transporter.sendMail({
            from: {
                name: 'LokRise Team',
                address: process.env.EMAIL_FROM || 'thecreons@gmail.com'
            },
            to: email,
            subject: subject,
            text: isSellerRegistration
                ? `Your LokRise verification code is: ${verificationCode}. Your temporary password is: ${tempPassword}`
                : `Your LokRise verification code is: ${verificationCode}`,
            html: simpleHtmlContent
        });

        console.log(`[EMAIL] Successfully sent to ${email}. Message ID: ${response.messageId}`);
        return { success: true, messageId: response.messageId };
    } catch (error) {
        console.error("[EMAIL] Error sending verification email:", error);
        console.error("[EMAIL] Email configuration:", {
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
        console.log(`[EMAIL] Sending welcome email to: ${email}`);
        const response = await transporter.sendMail({
            from: {
                name: 'LokRise Team',
                address: process.env.EMAIL_FROM || 'thecreons@gmail.com'
            },
            to: email,
            subject: "Welcome to LokRise!",
            text: `Hello, ${name}! Thank you for joining LokRise! Your email has been successfully verified, and your account is now active.`,
            html: welcomeEmailTemplate(name)
        });

        console.log(`[EMAIL] Welcome email sent to ${email}. Message ID: ${response.messageId}`);
        return { success: true, messageId: response.messageId };
    } catch (error) {
        console.error("[EMAIL] Error sending welcome email:", error);
        return { success: false, error: error.message };
    }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        console.log(`[EMAIL] Sending password reset email to: ${email}`);

        // Create simple HTML content for reset password email
        const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3b82f6;">Reset Your Password - LokRise</h2>
                <p>You requested to reset your password. Please click the button below to set a new password:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                
                <p>If you didn't request a password reset, you can safely ignore this email.</p>
                <p>This link will expire in <strong>1 hour</strong>.</p>
                <p style="margin-top: 20px;">– The LokRise Team</p>
                
                <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
                    <p>If the button above doesn't work, copy and paste this URL into your browser:</p>
                    <p style="word-break: break-all;">${resetUrl}</p>
                </div>
            </div>
        `;

        const response = await transporter.sendMail({
            from: {
                name: 'LokRise Team',
                address: process.env.EMAIL_FROM || 'thecreons@gmail.com'
            },
            to: email,
            subject: "Password Reset Request - LokRise",
            text: `Reset your password by clicking this link: ${resetUrl}. This link will expire in 1 hour.`,
            html: htmlContent
        });

        console.log(`[EMAIL] Password reset email sent to ${email}. Message ID: ${response.messageId}`);
        return { success: true, messageId: response.messageId };
    } catch (error) {
        console.error("[EMAIL] Error sending password reset email:", error);
        return { success: false, error: error.message };
    }
};

// Function to directly test email sending
export const sendTestEmail = async (email) => {
    try {
        console.log(`[EMAIL] Sending test email to: ${email}`);

        const response = await transporter.sendMail({
            from: {
                name: 'LokRise Test',
                address: process.env.EMAIL_FROM || 'thecreons@gmail.com'
            },
            to: email,
            subject: "Test Email from LokRise",
            text: "This is a test email to verify that the email sending functionality is working correctly.",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #9B7653;">Email System Test</h2>
                    <p>This is a test email to verify that the LokRise email system is working correctly.</p>
                    <p>If you're receiving this, it means our email configuration is functioning properly!</p>
                    <p>Time sent: ${new Date().toLocaleString()}</p>
                </div>
            `
        });

        console.log(`[EMAIL] Test email sent to ${email}. Message ID: ${response.messageId}`);
        return { success: true, messageId: response.messageId };
    } catch (error) {
        console.error("[EMAIL] Error sending test email:", error);
        return { success: false, error: error.message };
    }
};