// models/user.js
import mongoose from "mongoose";

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
        profileImage: { type: String },
        phone: {
            type: String,
            unique: true,
            required: true
        },
        role: {
            type: String,
            default: "buyer",
            enum: ["buyer", "seller"]
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
        createdAt: Date,
        updatedAt: Date,
        isVerified: {
            type: Boolean,
            default: false
        },
        verificationCode: String,
    },
    {
        timestamps: true
    });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;