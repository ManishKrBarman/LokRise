// controllers/Auth.js
import { welcomeEmailTemplate } from '../libs/emailTemplate.js';
import { SendVerificationCode, sendWelcomeEmail } from '../middlewares/email.js';
import UserModel from '../models/user.js';
import bcryptjs from 'bcryptjs';

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

        const user = new UserModel({
            name,
            email,
            password: hashedPassword,
            phone,
            role: role || 'buyer',
            upiLink: role === "seller" ? upiLink : undefined,
            upiId,
            verificationCode,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        SendVerificationCode(user.email, verificationCode);
        await user.save();
        res.status(201).json({ success: true, message: 'User registered successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
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

// Register a new seller
export const registerSeller = async (req, res, next) => {
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
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

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

        await newSeller.save();

        // Send verification email with temporary password
        await sendVerificationEmail(email, verificationCode, tempPassword);

        // Return success response without sensitive information
        res.status(201).json({
            message: "Seller registration successful! Please check your email to verify your account.",
            user: {
                id: newSeller._id,
                name: newSeller.name,
                email: newSeller.email,
                role: newSeller.role,
                sellerStatus: newSeller.sellerStatus
            }
        });
    } catch (err) {
        next(err);
    }
};

export { register, verifyEmail };