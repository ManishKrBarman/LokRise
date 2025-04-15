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
        await user.save();
        res.status(201).json({ success: true, message: 'User registered successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { register };