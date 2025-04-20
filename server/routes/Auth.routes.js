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
import UserModel from '../models/user.js';

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

// Notifications routes
AuthRoutes.get("/notifications", authMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Sort notifications by date in descending order (newest first)
        const sortedNotifications = user.notifications.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        res.json({ notifications: sortedNotifications });
    } catch (error) {
        console.error("Get notifications error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

AuthRoutes.post("/notifications/:id/read", authMiddleware, async (req, res) => {
    try {
        const notificationId = req.params.id;
        const user = await UserModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the notification
        const notification = user.notifications.id(notificationId);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // Mark as read
        notification.read = true;
        await user.save();

        res.json({ success: true, message: "Notification marked as read" });
    } catch (error) {
        console.error("Mark notification as read error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

AuthRoutes.post("/notifications/mark-all-read", authMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Mark all notifications as read
        user.notifications.forEach(notification => {
            notification.read = true;
        });

        await user.save();

        res.json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        console.error("Mark all notifications as read error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get seller application status
AuthRoutes.get("/seller/application-status", authMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.sellerApplication) {
            return res.status(404).json({
                message: "No seller application found",
                hasApplication: false
            });
        }

        res.json({
            success: true,
            hasApplication: true,
            applicationStatus: user.sellerApplication.status,
            application: user.sellerApplication
        });
    } catch (error) {
        console.error("Get seller application status error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default AuthRoutes;