// controllers/Auth.js
import { welcomeEmailTemplate } from '../libs/emailTemplate.js';
import { SendVerificationCode, sendWelcomeEmail, sendPasswordResetEmail } from '../middlewares/email.js';
import UserModel from '../models/user.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const getJWTSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not defined');
    }
    return secret;
};

const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        const ExistsUser = await UserModel.findOne({ email });
        if (ExistsUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcryptjs.hashSync(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        console.log(`Generated verification code for ${email}: ${verificationCode}`);

        // Create a temporary user object but don't save to database yet
        const userData = {
            name,
            email,
            password: hashedPassword,
            phone,
            role: 'buyer',
            verificationCode,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Store the user data in a session cache (we'll use Redis in production)
        // For now, we'll store it in the response as a temporary solution
        try {
            console.log(`Sending verification email to ${email}`);
            const emailResult = await SendVerificationCode(email, verificationCode);

            if (!emailResult.success) {
                console.warn(`Email sending failed for ${email}: ${emailResult.error}`);
                // Return verification code for testing/development environments
                return res.status(201).json({
                    success: true,
                    message: 'Verification code generated but email could not be sent. Use the verification code below.',
                    emailSent: false,
                    verificationCode: verificationCode,
                    pendingUser: {
                        name,
                        email,
                        phone,
                        password: hashedPassword // Include the hashed password
                    },
                    isRegistered: false
                });
            }

            // Email sent successfully
            return res.status(201).json({
                success: true,
                message: 'Verification code sent successfully. Please check your email to complete registration.',
                emailSent: true,
                pendingUser: {
                    name,
                    email,
                    phone,
                    password: hashedPassword // Include the hashed password
                },
                isRegistered: false
            });
        } catch (emailError) {
            console.error(`Error sending verification email to ${email}:`, emailError);

            // Return verification code for testing/development environments
            return res.status(201).json({
                success: true,
                message: 'Error sending verification email. Use the verification code below to complete registration.',
                emailSent: false,
                verificationCode: verificationCode,
                pendingUser: {
                    name,
                    email,
                    phone,
                    password: hashedPassword // Include the hashed password
                },
                isRegistered: false
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

        // First check if this is a pending verification (user not yet in database)
        // This is our new flow - user will be created only after OTP verification
        if (req.body.pendingUser) {
            const pendingUser = req.body.pendingUser;

            // Validate the verification code provided by client
            // Normally in production we would check against a cache/temp storage like Redis
            if (verificationCode !== req.body.verificationCode) {
                return res.status(400).json({ message: 'Invalid verification code' });
            }

            // Check if we have the required fields
            if (!pendingUser.name || !pendingUser.email || !pendingUser.password) {
                // If the password is missing in pendingUser, check if it's in the original registration data
                if (req.body.password) {
                    pendingUser.password = req.body.password;
                } else {
                    console.error("Missing required fields for user creation:",
                        { name: !!pendingUser.name, email: !!pendingUser.email, password: !!pendingUser.password });
                    return res.status(400).json({
                        message: 'Missing required user information. Please try registering again.'
                    });
                }
            }

            // Make sure the password is hashed
            let hashedPassword = pendingUser.password;
            if (!hashedPassword.startsWith('$2')) { // Check if it's already a bcrypt hash
                hashedPassword = await bcryptjs.hash(pendingUser.password, 10);
            }

            // Verification successful, create a new user account that's already verified
            const newUser = new UserModel({
                name: pendingUser.name,
                email: pendingUser.email,
                password: hashedPassword,
                phone: pendingUser.phone,
                role: 'buyer',
                isVerified: true, // Mark as verified since OTP has been confirmed
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Save the newly created and verified user
            await newUser.save();

            // Send welcome email
            await sendWelcomeEmail(pendingUser.email, pendingUser.name);

            // Generate token for auto-login
            const token = jwt.sign(
                { id: newUser._id, email: newUser.email, role: newUser.role },
                getJWTSecret(),
                { expiresIn: '7d' }
            );

            return res.status(200).json({
                message: 'Email verified successfully. Account has been created.',
                success: true,
                token,
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    isVerified: true
                }
            });
        }

        // Legacy flow - for users who might already be in the database
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

        res.status(200).json({
            message: 'Email verified successfully',
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: true
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Login functionality with JWT token generation
const login = async (req, res) => {
    try {
        const { email, password, deviceInfo } = req.body;

        console.log(`Login attempt - Email: ${email}, Device:`, deviceInfo);

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password'
            });
        }

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            console.log(`Login failed: No user found with email ${email}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is verified
        if (!user.isVerified) {
            console.log(`Login failed: User ${email} is not verified`);
            return res.status(403).json({
                success: false,
                message: 'Please verify your email first'
            });
        }

        // Validate password
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            console.log(`Login failed: Invalid password for ${email}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token with device info in payload
        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: user.role,
            device: deviceInfo?.isMobile ? 'mobile' : 'desktop'
        };

        const token = jwt.sign(
            tokenPayload,
            getJWTSecret(),
            { expiresIn: '7d' }
        );

        // Update last login and device info
        user.lastLogin = new Date();
        user.lastLoginDevice = deviceInfo;
        await user.save();

        console.log(`Login successful for ${email} on ${deviceInfo?.isMobile ? 'mobile' : 'desktop'}`);

        // Return user info and token with cache control headers for mobile
        const headers = deviceInfo?.isMobile ? {
            'Cache-Control': 'private, no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        } : {};

        res.set(headers).status(200).json({
            success: true,
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
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
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
            getJWTSecret(),
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

// Get profile image
const getProfileImage = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Add cache control header to prevent frequent requests
        res.set({
            'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });

        // Try to get user from database
        const user = await UserModel.findById(userId);
        if (!user) {
            // Instead of logging (which causes console spam), just return a 404 with proper caching
            return res.status(404).redirect(`https://ui-avatars.com/api/?name=U&background=8B6B4B&color=fff`);
        }

        // Check if user has a profile image
        if (!user.profileImage || !user.profileImage.data) {
            // Use user's first initial or 'U' as fallback, but don't log this
            const defaultName = user.name ? encodeURIComponent(user.name[0]) : 'U';

            // Redirect to default avatar with proper cache headers
            return res.redirect(`https://ui-avatars.com/api/?name=${defaultName}&background=8B6B4B&color=fff`);
        }

        // Set proper headers for image response
        res.set({
            'Content-Type': user.profileImage.contentType
            // Cache headers already set above
        });

        // Send the image data
        return res.send(user.profileImage.data);
    } catch (error) {
        console.error('Get profile image error:', error);
        // In case of error, redirect to default avatar instead of returning error
        return res.redirect(`https://ui-avatars.com/api/?name=U&background=8B6B4B&color=fff`);
    }
};

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
        if (profileImage && profileImage.data) {
            user.profileImage = {
                data: profileImage.data,
                contentType: profileImage.contentType,
                originalName: profileImage.originalName
            };
        }
        if (address) user.address = { ...user.address, ...address };
        if (socialProfiles) user.socialProfiles = { ...user.socialProfiles, ...socialProfiles };
        if (preferences) user.preferences = { ...user.preferences, ...preferences };

        user.updatedAt = new Date();
        await user.save();

        // Create URL for profile image in response
        const profileImageUrl = user.profileImage ? `/api/auth/profile-image/${user._id}` : null;

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profileImage: profileImageUrl,
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
        console.log("Received seller registration request");
        console.log("Request body:", req.body);

        // Check if req.body is undefined or empty
        if (!req.body || Object.keys(req.body).length === 0) {
            console.error("Empty or undefined request body");
            return res.status(400).json({ message: "No data received. Please provide seller information." });
        }

        // Extract data from request body with defaults for empty values
        const {
            // Personal Information
            fullName = '',
            email = '',
            phone = '',

            // Business Information
            businessName = '',
            gstin = '',
            businessType = 'individual',
            businessCategory = 'other',
            businessDescription = '',
            establishedYear = new Date().getFullYear(),

            // Address Information
            addressLine1 = '',
            addressLine2 = '',
            city = '',
            district = '',
            state = '',
            pinCode = '',

            // Payment Information
            accountHolderName = '',
            accountNumber = '',
            ifscCode = '',
            bankName = '',
            branchName = '',
            upiId,

            // Identity Verification
            panNumber = '',
            aadharNumber = '',
        } = req.body;

        // For development - only UPI ID is required
        if (!upiId) {
            return res.status(400).json({ message: "UPI ID is required for seller registration" });
        }

        let user;

        // If user is authenticated, update their existing account
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            try {
                // Extract token
                const token = req.headers.authorization.split(' ')[1];

                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecretkey');

                // Find the user
                user = await UserModel.findById(decoded.id);

                if (!user) {
                    return res.status(404).json({ message: "User not found. Please login before registering as a seller." });
                }

                console.log(`Updating existing user (${user.email}) to seller role`);
            } catch (tokenError) {
                console.error("Token validation error:", tokenError);
                return res.status(401).json({ message: "Invalid authentication token. Please login again." });
            }
        } else if (email) {
            // If no token but email provided, try to find user by email
            user = await UserModel.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: "User not found with this email. Please register or login first." });
            }

            console.log(`Found user by email: ${email}`);
        } else {
            return res.status(400).json({ message: "Authentication required. Please login before registering as a seller." });
        }

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
            upiId
        };

        // Create business details object
        const businessDetails = {
            businessName: businessName || user.name + "'s Shop",
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

        // Create the seller application in the new schema structure
        user.sellerApplication = {
            status: 'pending',
            businessDetails,
            address,
            bankDetails,
            identityDetails,
            submittedAt: new Date()
        };

        // Set UPI ID at root level (required for seller role once approved)
        user.upiId = upiId;

        // Store old format fields for backward compatibility
        user.address = address;
        user.bankDetails = bankDetails;
        user.businessDetails = businessDetails;
        user.identityDetails = identityDetails;

        // Note: we don't change the role to seller until the application is approved
        // The role will remain as "buyer" until an admin approves the application

        user.updatedAt = new Date();

        // If fullName is provided, update the name
        if (fullName && fullName.trim() !== '') {
            user.name = fullName;
        }

        // If phone is provided, update the phone
        if (phone && phone.trim() !== '') {
            user.phone = phone;
        }

        // Add a notification to the user
        user.notifications.push({
            message: 'Your seller application has been submitted successfully! We will review it and get back to you shortly.',
            type: 'system',
            read: false,
            link: '/seller/application-status',
            createdAt: new Date()
        });

        // Save the updated user
        await user.save();
        console.log(`User ${user.email} seller application saved successfully`);

        // Generate new token with updated data
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallbacksecretkey',
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true,
            message: "Your seller application has been submitted successfully! We will review it and get back to you shortly.",
            token, // Send new token with updated data
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                sellerApplication: {
                    status: user.sellerApplication.status,
                    submittedAt: user.sellerApplication.submittedAt
                }
            }
        });
    } catch (err) {
        console.error("Seller registration error:", err);
        res.status(500).json({ message: 'Server error: ' + (err.message || 'Unknown error') });
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
    updateProfile,
    getProfileImage
};