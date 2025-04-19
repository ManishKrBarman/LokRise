// controllers/Auth.js
import { welcomeEmailTemplate } from '../libs/emailTemplate.js';
import { SendVerificationCode, sendWelcomeEmail, sendPasswordResetEmail } from '../middlewares/email.js';
import UserModel from '../models/user.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const register = async (req, res) => {
    try {
        const { name, email, password, phone, role, upiId } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        if (role === 'seller' && !upiId) {
            return res.status(400).json({ message: 'UPI ID is required for sellers' });
        }

        const ExistsUser = await UserModel.findOne({ email });
        if (ExistsUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcryptjs.hashSync(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        console.log(`Generated verification code for ${email}: ${verificationCode}`);

        const user = new UserModel({
            name,
            email,
            password: hashedPassword,
            phone,
            role: role || 'buyer',
            upiId: role === "seller" ? upiId : undefined,
            verificationCode,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Try to send verification email before saving the user
        try {
            console.log(`Sending verification email to ${email}`);
            const emailResult = await SendVerificationCode(email, verificationCode);

            // Save the user regardless of email success
            await user.save();

            if (!emailResult.success) {
                console.warn(`Email sending failed for ${email}: ${emailResult.error}`);
                // Return verification code for testing/development environments
                return res.status(201).json({
                    success: true,
                    message: 'User registered successfully but email could not be sent. Use the verification code below.',
                    emailSent: false,
                    verificationCode: verificationCode,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                });
            }

            // Email sent successfully
            return res.status(201).json({
                success: true,
                message: 'User registered successfully. Please check your email for verification code.',
                emailSent: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (emailError) {
            // Email sending failed, but still create the account
            console.error(`Error sending verification email to ${email}:`, emailError);

            // Save user anyway
            await user.save();

            // Return verification code for testing/development environments
            return res.status(201).json({
                success: true,
                message: 'User registered, but email sending failed. Use the verification code below.',
                emailSent: false,
                verificationCode: verificationCode,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        }
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }
        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.name);
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Login functionality with JWT token generation
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email first' });
        }

        // Validate password
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallbacksecretkey',
            { expiresIn: '7d' }
        );

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Return user info and token
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                sellerStatus: user.role === 'seller' ? user.sellerStatus : undefined
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Request password reset
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No user found with that email' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token and save to database
        user.passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set token expiry (1 hour)
        user.passwordResetExpires = Date.now() + 3600000;
        await user.save();

        // Send reset email with token
        const emailResult = await sendPasswordResetEmail(email, resetToken);

        if (!emailResult.success) {
            console.warn(`Failed to send password reset email to ${email}: ${emailResult.error}`);
            // Just for development purposes, return the token - remove in production
            return res.status(200).json({
                message: 'Password reset email could not be sent, but token was generated',
                resetToken // Only for testing - remove in production
            });
        }

        res.status(200).json({
            message: 'Password reset email sent successfully',
            email: email
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Reset password with token
const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Hash token for comparison
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Find user with valid token
        const user = await UserModel.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired' });
        }

        // Update password
        user.password = await bcryptjs.hash(newPassword, 10);

        // Clear reset fields
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        // Generate new token for auto-login
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallbacksecretkey',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Password reset successful',
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Get current user profile
const getCurrentUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            profileImage,
            address,
            socialProfiles,
            preferences
        } = req.body;

        const user = await UserModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (profileImage) user.profileImage = profileImage;
        if (address) user.address = { ...user.address, ...address };
        if (socialProfiles) user.socialProfiles = { ...user.socialProfiles, ...socialProfiles };
        if (preferences) user.preferences = { ...user.preferences, ...preferences };

        user.updatedAt = new Date();

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profileImage: user.profileImage,
                address: user.address,
                socialProfiles: user.socialProfiles,
                preferences: user.preferences
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Register a new seller
const registerSeller = async (req, res, next) => {
    try {
        const {
            // Personal Information
            fullName,
            email,
            phone,

            // Business Information
            businessName,
            gstin,
            businessType,
            businessCategory,
            businessDescription,
            establishedYear,

            // Address Information
            addressLine1,
            addressLine2,
            city,
            district,
            state,
            pinCode,

            // Payment Information
            accountHolderName,
            accountNumber,
            ifscCode,
            bankName,
            branchName,
            upiId,

            // Identity Verification
            panNumber,
            aadharNumber,
        } = req.body;

        // Check if user with the email already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        // Create a temporary password for the seller (can be changed later)
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcryptjs.hash(tempPassword, 10);

        // Create address object
        const address = {
            addressLine1,
            addressLine2,
            city,
            district,
            state,
            pinCode
        };

        // Create bank details object
        const bankDetails = {
            accountHolderName,
            accountNumber,
            ifscCode,
            bankName,
            branchName,
        };

        // Create business details object
        const businessDetails = {
            businessName,
            gstin,
            businessType,
            businessCategory,
            businessDescription,
            establishedYear,
        };

        // Create identity details object
        const identityDetails = {
            panNumber,
            aadharNumber,
        };

        // Generate verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Generated seller verification code for ${email}: ${verificationCode}`);

        // Create seller user
        const newSeller = new UserModel({
            name: fullName,
            email,
            password: hashedPassword,
            phone,
            role: "seller",
            upiId,
            address,
            bankDetails,
            businessDetails,
            identityDetails,
            verificationCode,
            sellerStatus: "pending", // pending, approved, rejected
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Save the seller first to ensure they're in the system
        await newSeller.save();

        // Try to send verification email with temporary password
        try {
            console.log(`Sending seller verification email to ${email}`);
            const emailResult = await SendVerificationCode(email, verificationCode, tempPassword);

            if (!emailResult.success) {
                console.warn(`Seller email sending failed for ${email}: ${emailResult.error}`);
                // Return verification code and temp password for testing environments
                return res.status(201).json({
                    success: true,
                    message: 'Seller registered successfully but email could not be sent. Use the verification code and temporary password below.',
                    emailSent: false,
                    verificationCode: verificationCode,
                    tempPassword: tempPassword,
                    user: {
                        id: newSeller._id,
                        name: newSeller.name,
                        email: newSeller.email,
                        role: newSeller.role,
                        sellerStatus: newSeller.sellerStatus
                    }
                });
            }

            // Email sent successfully
            return res.status(201).json({
                success: true,
                message: "Seller registration successful! Please check your email to verify your account.",
                emailSent: true,
                user: {
                    id: newSeller._id,
                    name: newSeller.name,
                    email: newSeller.email,
                    role: newSeller.role,
                    sellerStatus: newSeller.sellerStatus
                }
            });
        } catch (emailError) {
            // Email sending failed but seller account is created
            console.error(`Error sending verification email to seller ${email}:`, emailError);

            // Return verification info for testing environments
            return res.status(201).json({
                success: true,
                message: 'Seller registered, but email sending failed. Use the verification code and temporary password below.',
                emailSent: false,
                verificationCode: verificationCode,
                tempPassword: tempPassword,
                user: {
                    id: newSeller._id,
                    name: newSeller.name,
                    email: newSeller.email,
                    role: newSeller.role,
                    sellerStatus: newSeller.sellerStatus
                }
            });
        }
    } catch (err) {
        next(err);
    }
};

export {
    register,
    verifyEmail,
    registerSeller,
    login,
    forgotPassword,
    resetPassword,
    getCurrentUser,
    updateProfile
};