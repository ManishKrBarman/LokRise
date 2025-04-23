import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import CartItemList from '../components/CartItemList';
import CartSummary from '../components/CartSummary';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, updateProfile } = useAuth();
    const { cartItems, removeFromCart, updateCartItemQuantity, getCartTotals } = useCart();
    const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'shipping'
    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pinCode: '',
        saveAddress: true // New field to track if user wants to save this address
    });
    const [addressSaving, setAddressSaving] = useState(false);
    const [addressError, setAddressError] = useState('');
    const [addressSuccess, setAddressSuccess] = useState('');
    const totals = getCartTotals();

    // Pre-populate shipping details from user data when available
    useEffect(() => {
        if (user) {
            setShippingDetails(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                addressLine1: user.address?.addressLine1 || '',
                addressLine2: user.address?.addressLine2 || '',
                city: user.address?.city || '',
                state: user.address?.state || '',
                pinCode: user.address?.pinCode || ''
            }));
        }
    }, [user]);

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

    const handleShippingSubmit = async (e) => {
        e.preventDefault();

        // If user checked to save address, update their profile
        if (isAuthenticated && shippingDetails.saveAddress) {
            try {
                setAddressSaving(true);
                setAddressError('');
                setAddressSuccess('');

                // Create address object in format expected by the API
                const addressData = {
                    address: {
                        addressLine1: shippingDetails.addressLine1,
                        addressLine2: shippingDetails.addressLine2,
                        city: shippingDetails.city,
                        state: shippingDetails.state,
                        pinCode: shippingDetails.pinCode
                    }
                };

                // Update user profile with new address
                const result = await updateProfile(addressData);

                if (result.success) {
                    setAddressSuccess('Shipping address saved to your profile');

                    // Navigate to payment page with shipping details
                    navigate('/payment', {
                        state: {
                            shippingDetails,
                            cartTotal: getCartTotals().total
                        }
                    });
                } else {
                    setAddressError(result.error || 'Failed to save address');
                }
            } catch (error) {
                console.error('Error saving address:', error);
                setAddressError('An unexpected error occurred while saving your address');
            } finally {
                setAddressSaving(false);
            }
        } else {
            // Navigate to payment page without saving address
            navigate('/payment', {
                state: {
                    shippingDetails,
                    cartTotal: getCartTotals().total
                }
            });
        }
    };

    const handleShippingInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveAddressChange = (e) => {
        setShippingDetails(prev => ({
            ...prev,
            saveAddress: e.target.checked
        }));
    };

    const renderShippingForm = () => (
        <form onSubmit={handleShippingSubmit} className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Shipping Details</h2>

            {addressSuccess && (
                <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
                    <p className="text-green-700">{addressSuccess}</p>
                </div>
            )}

            {addressError && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                    <p className="text-red-700">{addressError}</p>
                </div>
            )}

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

                {isAuthenticated && (
                    <div className="flex items-start mt-2">
                        <div className="flex items-center h-5">
                            <input
                                id="saveAddress"
                                name="saveAddress"
                                type="checkbox"
                                checked={shippingDetails.saveAddress}
                                onChange={handleSaveAddressChange}
                                className="h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="saveAddress" className="font-medium text-gray-700">
                                Save this address to my profile
                            </label>
                        </div>
                    </div>
                )}
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
                    disabled={addressSaving}
                >
                    {addressSaving ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : 'Continue to Payment'}
                </button>
            </div>
        </form>
    );

    const renderContent = () => {
        switch (checkoutStep) {
            case 'shipping':
                return renderShippingForm();
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
                    {checkoutStep === 'cart' ? 'Shopping Cart' : 'Shipping Information'}
                </h1>
                {renderContent()}
            </main>
        </div>
    );
};

export default Cart;