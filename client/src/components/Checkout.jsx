import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiSmartphone, FiTruck } from 'react-icons/fi';
import { PaymentService } from '../services/paymentService';
import { useCart } from '../context/CartContext';

const Checkout = ({ shippingDetails, onBack }) => {
    const navigate = useNavigate();
    const { cartItems, clearCart, getCartTotals } = useCart();
    const [selectedPayment, setSelectedPayment] = useState('');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardHolderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [upiPaymentData, setUpiPaymentData] = useState(null);

    const cartTotals = getCartTotals();

    const paymentMethods = [
        { id: 'CARD', label: 'Credit/Debit Card', icon: <FiCreditCard size={24} /> },
        { id: 'UPI', label: 'UPI Payment', icon: <FiSmartphone size={24} /> },
        { id: 'COD', label: 'Cash on Delivery', icon: <FiTruck size={24} /> }
    ];

    const handlePaymentMethodSelect = (method) => {
        setSelectedPayment(method);
        setError('');
        setUpiPaymentData(null);
    };

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const processPayment = async () => {
        setLoading(true);
        setError('');

        try {
            // Create order details
            const orderDetails = {
                items: cartItems,
                shippingAddress: shippingDetails,
                paymentMethod: selectedPayment,
                totalAmount: cartTotals.total
            };

            // Process checkout based on payment method
            const result = await PaymentService.completeCheckout(
                orderDetails,
                selectedPayment,
                selectedPayment === 'CARD' ? cardDetails : {}
            );

            if (result.success) {
                if (selectedPayment === 'UPI') {
                    setUpiPaymentData(result.payment.paymentData);
                } else {
                    // Clear cart and redirect to success page
                    await clearCart();
                    navigate('/order-success', { 
                        state: { 
                            orderId: result.orders[0].id,
                            paymentMethod: selectedPayment 
                        }
                    });
                }
            } else {
                setError(result.error || 'Payment failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred during payment processing.');
        } finally {
            setLoading(false);
        }
    };

    const validatePayment = () => {
        if (selectedPayment === 'CARD') {
            if (!cardDetails.cardNumber || !cardDetails.cardHolderName || 
                !cardDetails.expiryMonth || !cardDetails.expiryYear || !cardDetails.cvv) {
                setError('Please fill in all card details');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePayment()) return;
        await processPayment();
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>

            <div className="grid gap-4 mb-6">
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        className={`p-4 border rounded-lg cursor-pointer flex items-center ${
                            selectedPayment === method.id ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/5' : 'border-gray-200'
                        }`}
                        onClick={() => handlePaymentMethodSelect(method.id)}
                    >
                        <div className="mr-4 text-[var(--primary-color)]">{method.icon}</div>
                        <span className="font-medium">{method.label}</span>
                    </div>
                ))}
            </div>

            {selectedPayment === 'CARD' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                        </label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-3 py-2 border rounded-md"
                            maxLength="16"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Holder Name
                        </label>
                        <input
                            type="text"
                            name="cardHolderName"
                            value={cardDetails.cardHolderName}
                            onChange={handleInputChange}
                            placeholder="Name on card"
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    name="expiryMonth"
                                    value={cardDetails.expiryMonth}
                                    onChange={handleInputChange}
                                    placeholder="MM"
                                    className="px-3 py-2 border rounded-md"
                                    maxLength="2"
                                    required
                                />
                                <input
                                    type="text"
                                    name="expiryYear"
                                    value={cardDetails.expiryYear}
                                    onChange={handleInputChange}
                                    placeholder="YY"
                                    className="px-3 py-2 border rounded-md"
                                    maxLength="2"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                CVV
                            </label>
                            <input
                                type="text"
                                name="cvv"
                                value={cardDetails.cvv}
                                onChange={handleInputChange}
                                placeholder="123"
                                className="w-full px-3 py-2 border rounded-md"
                                maxLength="3"
                                required
                            />
                        </div>
                    </div>
                </form>
            )}

            {selectedPayment === 'UPI' && upiPaymentData && (
                <div className="text-center p-6 border rounded-lg">
                    <img 
                        src={upiPaymentData.qrCode} 
                        alt="UPI QR Code"
                        className="mx-auto mb-4 w-48 h-48"
                    />
                    <p className="text-gray-600 mb-2">Scan QR code with any UPI app</p>
                    <a 
                        href={upiPaymentData.upiLink}
                        className="text-[var(--primary-color)] underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Or click here to pay via UPI app
                    </a>
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                    {error}
                </div>
            )}

            <div className="mt-8 flex justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                >
                    Back
                </button>

                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!selectedPayment || loading}
                    className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : `Pay ${cartTotals.total.toFixed(2)}`}
                </button>
            </div>
        </div>
    );
};

export default Checkout;