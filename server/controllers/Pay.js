// controllers/Pay.js
import UserModel from '../models/user.js';
import QRCode from 'qrcode';

const payment = async (req, res) => {
    try {
        const { sellerId, amount } = req.body;

        // Basic validation
        if (!sellerId || !amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid seller ID or amount'
            });
        }

        // Find seller by ID or email
        const seller = await UserModel.findOne({
            $or: [{ _id: sellerId }, { email: sellerId }],
            role: 'seller'
        });

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }

        if (!seller.upiId) {
            return res.status(400).json({
                success: false,
                message: 'Seller UPI ID not found'
            });
        }

        // Basic UPI ID format check
        if (!seller.upiId.includes('@')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid UPI ID format'
            });
        }

        // Generate UPI payment link
        const upiLink = `upi://pay?pa=${seller.upiId}&pn=${encodeURIComponent(seller.name)}&am=${amount}&cu=INR&tn=Payment`;

        // Generate QR code
        const qrCode = await QRCode.toDataURL(upiLink);

        res.status(200).json({
            success: true,
            qrCode,
            upiLink,
            sellerName: seller.name,
            amount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export { payment };