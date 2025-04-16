import { welcomeEmailTemplate } from '../libs/emailTemplate.js';
import { SendVerificationCode, sendWelcomeEmail } from '../middlewares/email.js';
import UserModel from '../models/user.js';
import bcryptjs from 'bcryptjs';

const register = async (req, res) => {
    try {
        const { _id, name, email, password, phone } = req.body; 4

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        const ExistsUser = await UserModel.findOne({ email });
        if (ExistsUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hasepassword = await bcryptjs.hashSync(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit verification code
        const user = new UserModel({
            name,
            email,
            password: hasepassword,
            phone,
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { register, verifyEmail };