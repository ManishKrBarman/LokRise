import nodemailer from "nodemailer";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    debug: true, // Enable debug logging
});

// Verify transporter configuration on startup
async function verifyTransporter() {
    try {
        console.log("Email configuration:", {
            host: transporter.options.host,
            port: transporter.options.port,
            secure: transporter.options.secure,
            auth: { user: transporter.options.auth.user }
        });
        const verification = await transporter.verify();
        console.log("Email transporter is ready to send emails:", verification);
        return verification;
    } catch (error) {
        console.error("Email configuration error:", error);
        return false;
    }
}

export { transporter, verifyTransporter };