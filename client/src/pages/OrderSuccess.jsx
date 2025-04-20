import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheck, FiPackage, FiClock } from 'react-icons/fi';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { userAPI } from '../services/api';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!location.state?.orderId) {
                navigate('/');
                return;
            }

            try {
                const response = await userAPI.getOrderById(location.state.orderId);
                setOrderDetails(response.data);
            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [location.state, navigate]);

    if (loading) {
        return (
            <>
                <NavBar fixed={true} />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <NavBar fixed={true} />
            <div className="max-w-3xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <FiCheck className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
                    <p className="text-gray-600">
                        Thank you for your order. We'll send you an email confirmation shortly.
                    </p>
                </div>

                {orderDetails && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="border-b pb-4 mb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-600">Order Number</p>
                                    <p className="font-medium">{orderDetails.orderNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Order Date</p>
                                    <p className="font-medium">
                                        {new Date(orderDetails.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <FiPackage className="text-[var(--primary-color)] mr-3" size={20} />
                                <div>
                                    <p className="font-medium">Shipping To</p>
                                    <p className="text-sm text-gray-600">
                                        {orderDetails.shippingAddress.name}<br />
                                        {orderDetails.shippingAddress.addressLine1}<br />
                                        {orderDetails.shippingAddress.addressLine2 && 
                                            <>{orderDetails.shippingAddress.addressLine2}<br /></>
                                        }
                                        {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.pinCode}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <FiClock className="text-[var(--primary-color)] mr-3" size={20} />
                                <div>
                                    <p className="font-medium">Expected Delivery</p>
                                    <p className="text-sm text-gray-600">
                                        Within 5-7 business days
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="font-medium mb-4">Order Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{orderDetails.subtotal?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span>{orderDetails.shippingFee > 0 ? 
                                        `₹${orderDetails.shippingFee.toFixed(2)}` : 'Free'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax</span>
                                    <span>₹{orderDetails.tax?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-medium pt-3 border-t">
                                    <span>Total</span>
                                    <span>₹{orderDetails.totalAmount?.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                onClick={() => navigate('/orders')}
                                className="bg-[var(--primary-color)] text-white py-2 px-6 rounded-lg hover:bg-opacity-90"
                            >
                                View Order History
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default OrderSuccess;