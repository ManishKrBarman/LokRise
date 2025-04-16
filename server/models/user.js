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
        role: {
            type: String,
            default: "buyer",
            enum: ["buyer", "seller"]
        },
        upiId: {
            type: String,
            required: function () { return this.role === 'seller'; }
        },
        phone: String,
        address: {
            village: String,
            district: String,
            state: String,
            pinCode: String
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