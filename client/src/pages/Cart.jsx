import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import CartItemList from '../components/CartItemList';
import CartSummary from '../components/CartSummary';
import Checkout from '../components/Checkout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { cartItems, removeFromCart, updateCartItemQuantity, getCartTotals } = useCart();
    const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'shipping', 'payment'
    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pinCode: '',
    });

    const handleRemoveItem = async (productId) => {
        await removeFromCart(productId);
    };

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        await updateCartItemQuantity(productId, newQuantity);
    };

    const handleProceedToCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { returnUrl: '/cart' } });
            return;
        }
        setCheckoutStep('shipping');
    };

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setCheckoutStep('payment');
    };

    const handleShippingInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const renderShippingForm = () => (
        <form onSubmit={handleShippingSubmit} className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Shipping Details</h2>

            <div className="grid gap-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={shippingDetails.name}
                            onChange={handleShippingInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={shippingDetails.email}
                            onChange={handleShippingInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={shippingDetails.phone}
                        onChange={handleShippingInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                    <input
                        type="text"
                        name="addressLine1"
                        value={shippingDetails.addressLine1}
                        onChange={handleShippingInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                    <input
                        type="text"
                        name="addressLine2"
                        value={shippingDetails.addressLine2}
                        onChange={handleShippingInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                            type="text"
                            name="city"
                            value={shippingDetails.city}
                            onChange={handleShippingInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <select
                            name="state"
                            value={shippingDetails.state}
                            onChange={handleShippingInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        >
                            <option value="">Select State</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Telangana">Telangana</option>
                            {/* Add other states */}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                        <input
                            type="text"
                            name="pinCode"
                            value={shippingDetails.pinCode}
                            onChange={handleShippingInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            maxLength="6"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                >
                    Back to Cart
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-opacity-90"
                >
                    Continue to Payment
                </button>
            </div>
        </form>
    );

    const renderContent = () => {
        switch (checkoutStep) {
            case 'shipping':
                return renderShippingForm();
            case 'payment':
                return (
                    <Checkout
                        shippingDetails={shippingDetails}
                        onBack={() => setCheckoutStep('shipping')}
                    />
                );
            default:
                return cartItems.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-grow">
                            <CartItemList
                                items={cartItems}
                                removeItem={handleRemoveItem}
                                updateQuantity={handleUpdateQuantity}
                            />
                        </div>
                        <div className="lg:w-1/3">
                            <CartSummary
                                totals={getCartTotals()}
                                onCheckout={handleProceedToCheckout}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
                        <a
                            href="/"
                            className="bg-[var(--primary-color)] text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-300"
                        >
                            Continue Shopping
                        </a>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar fixed={true} cartBtn={true} />
            <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
                <h1 className="text-3xl font-bold mb-8">
                    {checkoutStep === 'cart' ? 'Shopping Cart' :
                        checkoutStep === 'shipping' ? 'Shipping Information' :
                            'Payment'}
                </h1>
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
};

export default Cart;