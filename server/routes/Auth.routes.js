import express from 'express';
import {
    register,
    verifyEmail,
    registerSeller,
    login,
    forgotPassword,
    resetPassword,
    getCurrentUser,
    updateProfile,
    getProfileImage
} from '../controllers/Auth.js';
import { authMiddleware } from '../middlewares/auth.js';
import { sendTestEmail } from '../middlewares/email.js';
import { uploadProfileImage } from '../middlewares/imageUpload.js';

const AuthRoutes = express.Router();

// Public routes
AuthRoutes.post('/register', register);
AuthRoutes.post('/verify-email', verifyEmail);
AuthRoutes.post('/seller/register', registerSeller);
AuthRoutes.post('/login', login);
AuthRoutes.post('/forgot-password', forgotPassword);
AuthRoutes.post('/reset-password', resetPassword);
AuthRoutes.get('/profile-image/:userId', getProfileImage);

// Test email route
AuthRoutes.post('/test-email', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        console.log(`Request received to send test email to: ${email}`);
        const result = await sendTestEmail(email);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: `Test email successfully sent to ${email}`,
                messageId: result.messageId
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send test email',
                error: result.error
            });
        }
    } catch (error) {
        console.error("Test email error:", error);
        res.status(500).json({
            success: false,
            message: 'Error sending test email',
            error: error.message
        });
    }
});

// Protected routes
AuthRoutes.get('/me', authMiddleware, getCurrentUser);
AuthRoutes.put('/update-profile', authMiddleware, uploadProfileImage, updateProfile);

export default AuthRoutes;