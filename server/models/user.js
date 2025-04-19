import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Notification schema for user notifications
const notificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['order', 'payment', 'system', 'product', 'course', 'forum'],
        required: true
    },
    read: { type: Boolean, default: false },
    link: { type: String },  // Optional link to redirect when clicked
    createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        profileImage: {
            data: Buffer,
            contentType: String,
            originalName: String
        },
        phone: {
            type: String,
            unique: true,
            required: true
        },
        role: {
            type: String,
            default: "buyer",
            enum: ["buyer", "seller", "admin"]
        },
        upiId: {
            type: String,
            required: function () { return this.role === 'seller'; }
        },
        address: {
            addressLine1: String,
            addressLine2: String,
            city: String,
            district: String,
            state: String,
            pinCode: String
        },
        // Additional addresses (for shipping options)
        additionalAddresses: [{
            name: String,
            addressLine1: String,
            addressLine2: String,
            city: String,
            district: String,
            state: String,
            pinCode: String,
            isDefault: Boolean
        }],
        // Additional seller-specific fields
        sellerStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: function () { return this.role === 'seller' ? 'pending' : undefined; }
        },
        businessDetails: {
            businessName: String,
            gstin: String,
            businessType: String,
            businessCategory: String,
            businessDescription: String,
            establishedYear: Number
        },
        bankDetails: {
            accountHolderName: String,
            accountNumber: String,
            ifscCode: String,
            bankName: String,
            branchName: String
        },
        identityDetails: {
            panNumber: String,
            aadharNumber: String
        },
        // Instructor fields
        instructorProfile: {
            bio: String,
            specialty: String,
            quote: String,
            experience: String,
            education: String,
            certifications: [String],
            coursesCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
            studentsCount: { type: Number, default: 0 },
            rating: { type: Number, default: 0 }
        },
        // Social profiles
        socialProfiles: {
            website: String,
            github: String,
            twitter: String,
            linkedin: String,
            instagram: String,
            facebook: String
        },
        // User preferences
        preferences: {
            language: { type: String, default: 'en' },
            currency: { type: String, default: 'INR' },
            emailNotifications: { type: Boolean, default: true },
            pushNotifications: { type: Boolean, default: true },
            newsletter: { type: Boolean, default: false }
        },
        // User metrics and activity
        metrics: {
            productsListed: { type: Number, default: 0 },
            totalSales: { type: Number, default: 0 },
            totalRevenue: { type: Number, default: 0 },
            totalPurchases: { type: Number, default: 0 },
            totalSpent: { type: Number, default: 0 },
            lastActive: { type: Date },
            joinDate: { type: Date, default: Date.now }
        },
        notifications: [notificationSchema],
        // Security and verification
        createdAt: Date,
        updatedAt: Date,
        isVerified: {
            type: Boolean,
            default: false
        },
        verificationCode: String,
        passwordResetToken: String,
        passwordResetExpires: Date,
        lastLogin: Date,
        lastLoginDevice: {
            isMobile: Boolean,
            userAgent: String,
            platform: String,
            loginTime: Date
        },
        devices: [{
            isMobile: Boolean,
            userAgent: String,
            platform: String,
            lastUsed: Date
        }]
    },
    {
        timestamps: true
    }
);

// Add method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Add method to generate JWT token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;