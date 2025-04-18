import nodemailer from "nodemailer";

// Create a transporter using environment variables if available, fallback to config values
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true" ? true : false,
    auth: {
        user: process.env.EMAIL_USER || "thecreons@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "vcdt vgqu uitk iqjo", // App password for Gmail
    },
});

// Verify transporter configuration on startup
async function verifyTransporter() {
    try {
        const verification = await transporter.verify();
        console.log("Email transporter is ready to send emails:", verification);
        return verification;
    } catch (error) {
        console.error("Email configuration error:", error);
        return false;
    }
}

export { transporter, verifyTransporter };