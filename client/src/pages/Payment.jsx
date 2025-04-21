import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaCreditCard, FaMoneyBill, FaQrcode, FaExchangeAlt } from 'react-icons/fa';
import api, { orderAPI } from '../services/api';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();
    const { cartItems, clearCart } = useCart();

    // Get data passed from cart
    const { shippingDetails, cartTotal } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState('');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
    });
    const [upiDetails, setUpiDetails] = useState({
        amount: cartTotal?.toFixed(2) || '0.00',
        upiId: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [transactionRef, setTransactionRef] = useState('');
    const [barterMode, setBarterMode] = useState('');
    const [barterItem, setBarterItem] = useState({
        title: '',
        category: '',
        description: '',
        estimatedValue: cartTotal || 0,
        photos: [],
        topUpAmount: 0
    });
    const [orderId, setOrderId] = useState('');

    // Check if user is authenticated and redirect if necessary
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { returnUrl: '/cart' } });
        }

        if (!shippingDetails || !cartItems || cartItems.length === 0) {
            navigate('/cart');
        }
    }, [isAuthenticated, navigate, shippingDetails, cartItems]);

    // Create an order when a payment method is selected
    useEffect(() => {
        const createOrder = async () => {
            if (paymentMethod && !orderId && cartItems && cartItems.length > 0) {
                try {
                    setIsProcessing(true);
                    setError('');

                    // Calculate subtotal from cart items
                    const subtotal = cartItems.reduce((total, item) =>
                        total + (item.price * item.quantity), 0);

                    // Get the product from first cart item
                    const productItem = cartItems[0];

                    // Extract product ID properly - handle both object and string cases
                    const productId = typeof productItem.product === 'object'
                        ? productItem.product._id
                        : productItem.product;

                    // Fetch product details to get the seller ID
                    try {
                        const productResponse = await api.get(`/products/${productId}`);
                        const sellerId = productResponse.data.seller._id;
                    

                        console.log(cartItems.map(item => ({    
                            product: item.product, // This is the product ID        
                            quantity: item.quantity})));
                        // Use the orderAPI.placeOrder function to maintain consistent API usage
                        const response = await orderAPI.placeOrder({
                            seller: sellerId,
                            products: cartItems.map(item => ({
                                product: item.product._id, // Extract the product ID
                                quantity: item.quantity,
                                price: item.product.price, // Get the price from the full product object
                                name: item.product.name || 'Product', // Get the name from the product object
                                productImage: item.product.images?.[0] || '' // Get the first image if available
                            })),
                            shippingAddress: {
                                name: shippingDetails.name,
                                addressLine1: shippingDetails.addressLine1,
                                addressLine2: shippingDetails.addressLine2 || '',
                                city: shippingDetails.city,
                                state: shippingDetails.state,
                                pinCode: shippingDetails.pinCode,
                                phone: shippingDetails.phone,
                                email: shippingDetails.email
                            },
                            subTotal: subtotal,
                            totalAmount: cartTotal,
                            paymentMethod: paymentMethod,
                            status: 'pending'
                        });

                        if (response.data && response.data.orders && response.data.orders.length > 0) {
                            setOrderId(response.data.orders[0].id);
                        } else if (response.data && response.data.order && response.data.order._id) {
                            setOrderId(response.data.order._id);
                        } else {
                            setError('Failed to create order. Please try again.');
                        }
                    } catch (productErr) {
                        console.error('Error fetching product details:', productErr);
                        setError('Failed to get product information. Please try again.');
                    }
                } catch (err) {
                    console.error('Order creation error:', err);
                    setError('Failed to create order. Please try again.');
                } finally {
                    setIsProcessing(false);
                }
            }
        };

        createOrder();
    }, [paymentMethod, cartItems, shippingDetails, cartTotal, orderId, user]);

    // Handle UPI QR code generation
    useEffect(() => {
        if (paymentMethod === 'upi' && orderId) {
            const fetchQrCode = async () => {
                try {
                    setIsProcessing(true);
                    setError('');

                    // Get product ID from the first cart item - Extract ID properly
                    const productItem = cartItems[0];
                    // Check if product is an object (with _id) or a direct ID string
                    const productId = typeof productItem.product === 'object'
                        ? productItem.product._id
                        : productItem.product;

                    if (!productId) {
                        setError('Product information not found. Please try again.');
                        setIsProcessing(false);
                        return;
                    }

                    // Fetch the product to get its seller
                    try {
                        const productResponse = await api.get(`/products/${productId}`);
                        const sellerId = productResponse.data.product.seller;

                        if (!sellerId) {
                            setError('Seller information not found. Please try again.');
                            setIsProcessing(false);
                            return;
                        }

                        // Call the server API to generate UPI payment QR code with correct seller ID
                        const response = await api.post('/payment/upi/initiate', {
                            sellerId: sellerId,
                            amount: cartTotal,
                            orderId: orderId,
                            description: `Payment for order from ${shippingDetails.name}`
                        });

                        if (response.data && response.data.success) {
                            setQrCode(response.data.qrCode);
                            setTransactionRef(response.data.transactionRef);
                        } else {
                            setError('Failed to generate payment QR code');
                        }
                    } catch (productErr) {
                        console.error('Error fetching product details:', productErr);
                        setError('Failed to get product information for payment.');
                    }
                } catch (err) {
                    setError('Failed to generate QR code');
                    console.error('QR code error:', err);
                } finally {
                    setIsProcessing(false);
                }
            };

            fetchQrCode();
        }
    }, [paymentMethod, orderId, cartTotal, cartItems, shippingDetails]);

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails({ ...cardDetails, [name]: value });
    };

    const handleUpiInputChange = (e) => {
        const { name, value } = e.target;
        // Only allow exact amount for UPI payments
        if (name === 'amount' && value !== cartTotal?.toFixed(2)) {
            setError('Please enter the exact amount');
        } else {
            setError('');
        }
        setUpiDetails({ ...upiDetails, [name]: value });
    };

    const handleBarterItemChange = (e) => {
        const { name, value } = e.target;
        setBarterItem({ ...barterItem, [name]: value });
    };

    const handleBarterPhotoChange = (e) => {
        if (e.target.files) {
            // Limit to 5 photos
            const selectedFiles = Array.from(e.target.files).slice(0, 5);
            setBarterItem({ ...barterItem, photos: selectedFiles });
        }
    };

    const handleTopUpAmountChange = (e) => {
        const value = e.target.value;
        setBarterItem({ ...barterItem, topUpAmount: value });
    };

    const verifyUpiPayment = async () => {
        try {
            setIsProcessing(true);
            setError('');

            // Verify payment with transaction reference
            const response = await api.post('/payment/upi/verify', {
                transactionRef,
                orderId,
                upiId: upiDetails.upiId
            });

            if (response.data && response.data.success) {
                // Clear cart after successful payment
                await clearCart();

                // Redirect to success page
                navigate('/order-success', {
                    state: {
                        orderDetails: response.data.order,
                        paymentMethod: 'upi'
                    }
                });
            } else {
                setError('Payment verification failed. Please try again.');
            }
        } catch (err) {
            setError('Payment verification failed. Please check if payment was completed.');
            console.error('Payment verification error:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const submitCardPayment = async () => {
        try {
            setIsProcessing(true);
            setError('');

            // Extract month and year from expiry date
            const [expiryMonth, expiryYear] = cardDetails.expiryDate.split('/');

            // Process card payment
            const response = await api.post('/payment/card/process', {
                orderId,
                cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),
                cardHolderName: cardDetails.cardHolder,
                expiryMonth: expiryMonth?.trim(),
                expiryYear: `20${expiryYear?.trim()}`,
                cvv: cardDetails.cvv,
                amount: cartTotal
            });

            if (response.data && response.data.success) {
                // Clear cart after successful payment
                await clearCart();

                // Redirect to success page
                navigate('/order-success', {
                    state: {
                        orderDetails: response.data.order,
                        paymentMethod: 'card'
                    }
                });
            } else {
                setError('Card payment processing failed. Please try again.');
            }
        } catch (err) {
            setError('Card payment processing failed. Please check your card details.');
            console.error('Card payment error:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const processCashOnDelivery = async () => {
        try {
            setIsProcessing(true);
            setError('');

            // Process COD payment
            const response = await api.post('/payment/cod/process', {
                orderId
            });

            if (response.data && response.data.success) {
                // Clear cart after successful COD setup
                await clearCart();

                // Redirect to success page
                navigate('/order-success', {
                    state: {
                        orderDetails: response.data.order,
                        paymentMethod: 'cod'
                    }
                });
            } else {
                setError('Cash on Delivery setup failed. Please try again.');
            }
        } catch (err) {
            setError('Cash on Delivery setup failed.');
            console.error('COD setup error:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const processBarterProposal = async () => {
        try {
            setIsProcessing(true);
            setError('');

            // Validate required fields
            if (!barterItem.title || !barterItem.category || !barterItem.description || !barterItem.estimatedValue) {
                setError('Please fill in all required fields for your barter proposal');
                setIsProcessing(false);
                return;
            }

            // Get the product ID from the first cart item - Extract ID properly
            const productItem = cartItems[0];
            // Check if product is an object (with _id) or a direct ID string
            const productId = typeof productItem.product === 'object'
                ? productItem.product._id
                : productItem.product;

            if (!productId) {
                setError('Product information not found. Please try again.');
                setIsProcessing(false);
                return;
            }

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('orderId', orderId);
            formData.append('title', barterItem.title);
            formData.append('category', barterItem.category);
            formData.append('description', barterItem.description);
            formData.append('estimatedValue', barterItem.estimatedValue);
            formData.append('topUpAmount', barterItem.topUpAmount || 0);

            // Append all photo files
            if (barterItem.photos && barterItem.photos.length > 0) {
                for (let i = 0; i < barterItem.photos.length; i++) {
                    formData.append('photos', barterItem.photos[i]);
                }
            }

            // Process barter proposal with proper error handling
            const response = await api.post('/payment/barter', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data && response.data.success) {
                // Clear cart after successful barter proposal
                await clearCart();

                // Redirect to success page
                navigate('/order-success', {
                    state: {
                        orderDetails: response.data.order,
                        paymentMethod: 'barter',
                        barterDetails: response.data.barterProposal
                    }
                });
            } else {
                setError('Barter proposal submission failed. Please try again.');
            }
        } catch (err) {
            setError('Failed to submit barter proposal. ' + (err.response?.data?.message || err.message || ''));
            console.error('Barter proposal error:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmitPayment = async (e) => {
        e.preventDefault();

        switch (paymentMethod) {
            case 'card':
                await submitCardPayment();
                break;
            case 'upi':
                await verifyUpiPayment();
                break;
            case 'cod':
                await processCashOnDelivery();
                break;
            case 'barter':
                if (barterMode === 'review') {
                    await processBarterProposal();
                }
                break;
            default:
                setError('Please select a payment method');
        }
    };

    const renderCardForm = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                    type="text"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Name</label>
                <input
                    type="text"
                    name="cardHolder"
                    value={cardDetails.cardHolder}
                    onChange={handleCardInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="John Doe"
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                        type="text"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={handleCardInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                        type="password"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="123"
                        maxLength="4"
                        required
                    />
                </div>
            </div>
        </div>
    );

    const renderUpiForm = () => (
        <div className="space-y-6">
            <div className="flex flex-col items-center">
                {isProcessing ? (
                    <div className="flex justify-center items-center h-64 w-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-color)]"></div>
                    </div>
                ) : qrCode ? (
                    <>
                        <p className="mb-4 text-center">Scan this QR code to pay ₹{upiDetails.amount}</p>
                        <img src={qrCode} alt="UPI QR Code" className="w-64 h-64 mb-6" />
                        <div className="w-full max-w-md">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                                <input
                                    type="text"
                                    name="amount"
                                    value={upiDetails.amount}
                                    onChange={handleUpiInputChange}
                                    className="w-full px-3 py-2 border rounded-md bg-gray-100"
                                    readOnly
                                    required
                                />
                                {error && error.includes('exact amount') && (
                                    <p className="text-red-500 text-sm mt-1">{error}</p>
                                )}
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your UPI ID (for verification)</label>
                                <input
                                    type="text"
                                    name="upiId"
                                    value={upiDetails.upiId}
                                    onChange={handleUpiInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="your.id@upi"
                                    required
                                />
                            </div>
                            <p className="mt-4 text-sm text-gray-600">
                                After completing the payment through your UPI app, click the "Verify Payment" button to complete your order.
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex justify-center items-center h-64 w-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-color)]"></div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderCODForm = () => (
        <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-800">Cash on Delivery</h3>
            <p className="text-yellow-700 mt-2">
                You will pay ₹{cartTotal?.toFixed(2)} when your order is delivered.
                Please have the exact amount ready to ensure a smooth delivery experience.
            </p>
            <div className="mt-4 bg-white p-4 rounded border border-yellow-200">
                <p className="text-gray-700 text-sm">
                    <strong>Note:</strong> Cash on Delivery may not be available for all locations and products.
                    Some high-value items may require prepayment.
                </p>
            </div>
        </div>
    );

    // Improved Barter System UI with proper state handling
    const renderBarterSystem = () => (
        <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-green-800 mb-4">Barter Exchange System</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded shadow-sm">
                    <h4 className="font-medium text-gray-800 mb-3">Their Item</h4>
                    <div className="bg-gray-100 rounded-lg p-4 h-40 flex items-center justify-center">
                        {cartItems && cartItems.length > 0 && (
                            <div className="text-center">
                                <img
                                    src={cartItems[0].product.images?.[0] || '/placeholder.jpg'}
                                    alt={cartItems[0].product.name}
                                    className="h-20 mx-auto mb-2"
                                    onError={(e) => { e.target.src = '/placeholder.jpg' }}
                                />
                                <p className="text-sm font-medium">{cartItems[0].product.name}</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-3">
                        <p className="text-sm text-gray-600">Value: ₹{cartTotal?.toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow-sm">
                    <h4 className="font-medium text-gray-800 mb-3">Your Offer</h4>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setBarterMode('addItem');
                        }}
                        className="bg-gray-100 rounded-lg p-4 h-40 w-full flex flex-col items-center justify-center hover:bg-gray-200 transition"
                    >
                        <span className="text-3xl mb-2">+</span>
                        <span className="text-gray-600">Add Your Item</span>
                    </button>
                </div>
            </div>

            {barterMode === 'addItem' && (
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <h4 className="font-medium text-gray-800 mb-3">Add Item to Trade</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Item Title</label>
                            <input
                                type="text"
                                name="title"
                                value={barterItem.title}
                                onChange={handleBarterItemChange}
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="Handcrafted pottery set"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="category"
                                value={barterItem.category}
                                onChange={handleBarterItemChange}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="handicrafts">Handicrafts</option>
                                <option value="farmProduce">Farm Produce</option>
                                <option value="apparel">Apparel</option>
                                <option value="jewelry">Jewelry</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photos</label>
                            <div className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    id="item-photos"
                                    onChange={handleBarterPhotoChange}
                                />
                                <label htmlFor="item-photos" className="cursor-pointer text-[var(--primary-color)] hover:text-[#8b6b4b]">
                                    Click to upload photos
                                </label>
                                <p className="text-xs text-gray-500 mt-2">Up to 5 images (JPG, PNG)</p>
                                {barterItem.photos.length > 0 && (
                                    <div className="mt-2 text-sm text-green-600">
                                        {barterItem.photos.length} {barterItem.photos.length === 1 ? 'photo' : 'photos'} selected
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={barterItem.description}
                                onChange={handleBarterItemChange}
                                className="w-full px-3 py-2 border rounded-md"
                                rows="3"
                                placeholder="Describe your item, condition, etc."
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value (₹)</label>
                            <input
                                type="number"
                                name="estimatedValue"
                                value={barterItem.estimatedValue}
                                onChange={handleBarterItemChange}
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="1000"
                                required
                            />
                        </div>

                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={() => setBarterMode('')}
                                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (barterItem.title && barterItem.category && barterItem.description && barterItem.estimatedValue) {
                                        setBarterMode('review');
                                    } else {
                                        setError('Please fill in all required fields');
                                    }
                                }}
                                className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-opacity-90"
                            >
                                Add Item
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {barterMode === 'review' && (
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <h4 className="font-medium text-gray-800 mb-3">Fine-tune Your Offer</h4>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Top-up amount (if needed)</label>
                        <div className="flex items-center">
                            <span className="mr-2">₹</span>
                            <input
                                type="range"
                                min="0"
                                max="5000"
                                step="100"
                                value={barterItem.topUpAmount}
                                onChange={handleTopUpAmountChange}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="ml-2">₹{barterItem.topUpAmount}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>₹0</span>
                            <span>₹5000</span>
                        </div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-md mb-4">
                        <p className="text-blue-700 text-sm">
                            Value Balance:
                            <strong>
                                {parseInt(barterItem.estimatedValue) + parseInt(barterItem.topUpAmount) === parseInt(cartTotal || 0)
                                    ? ' Fair Exchange'
                                    : parseInt(barterItem.estimatedValue) + parseInt(barterItem.topUpAmount) > parseInt(cartTotal || 0)
                                        ? ' You\'re offering more value'
                                        : ' Top-up recommended'}
                            </strong>
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Exchange Method</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="exchange-method" className="mr-2" defaultChecked />
                                <span>In-person meet</span>
                            </label>
                            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="exchange-method" className="mr-2" />
                                <span>Ship items</span>
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Proposed Exchange Date</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border rounded-md"
                            min={new Date().toISOString().split('T')[0]}
                            defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="flex space-x-2">
                        <button
                            type="button"
                            onClick={() => setBarterMode('addItem')}
                            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmitPayment}
                            className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-opacity-90"
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : 'Submit Trade Proposal'}
                        </button>
                    </div>
                </div>
            )}

            {!barterMode && (
                <p className="text-sm text-gray-600">
                    The barter system allows you to exchange your goods for products on our platform.
                    Add your item and propose a fair trade to the seller.
                </p>
            )}
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar fixed={true} />
            <main className="flex-grow max-w-3xl mx-auto px-4 py-8 w-full">
                <h1 className="text-3xl font-bold mb-8">Payment</h1>

                {error && !error.includes('exact amount') && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                    <div className="bg-gray-50 px-4 py-3">
                        <h2 className="text-lg font-medium text-gray-800">Order Summary</h2>
                    </div>
                    <div className="p-4 border-b">
                        <div className="flex justify-between mb-1">
                            <span className="text-gray-700">Subtotal</span>
                            <span>₹{cartTotal?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span className="text-gray-700">Shipping</span>
                            <span>₹0.00</span>
                        </div>
                        <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>₹{cartTotal?.toFixed(2) || '0.00'}</span>
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-medium mb-2">Shipping to:</h3>
                        <p className="text-gray-700">{shippingDetails?.name}</p>
                        <p className="text-gray-700">{shippingDetails?.addressLine1}</p>
                        {shippingDetails?.addressLine2 && <p className="text-gray-700">{shippingDetails?.addressLine2}</p>}
                        <p className="text-gray-700">
                            {shippingDetails?.city}, {shippingDetails?.state}, {shippingDetails?.pinCode}
                        </p>
                        <p className="text-gray-700">{shippingDetails?.phone}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className={`flex flex-col items-center justify-center p-4 border rounded-lg transition ${paymentMethod === 'card' ? 'border-[var(--primary-color)] bg-[rgba(139,107,75,0.05)]' : 'hover:bg-gray-50'
                                }`}
                        >
                            <FaCreditCard size={24} className={paymentMethod === 'card' ? 'text-[var(--primary-color)]' : 'text-gray-600'} />
                            <span className={`mt-2 text-sm ${paymentMethod === 'card' ? 'font-medium text-[var(--primary-color)]' : 'text-gray-700'}`}>Card</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setPaymentMethod('upi')}
                            className={`flex flex-col items-center justify-center p-4 border rounded-lg transition ${paymentMethod === 'upi' ? 'border-[var(--primary-color)] bg-[rgba(139,107,75,0.05)]' : 'hover:bg-gray-50'
                                }`}
                        >
                            <FaQrcode size={24} className={paymentMethod === 'upi' ? 'text-[var(--primary-color)]' : 'text-gray-600'} />
                            <span className={`mt-2 text-sm ${paymentMethod === 'upi' ? 'font-medium text-[var(--primary-color)]' : 'text-gray-700'}`}>UPI</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setPaymentMethod('cod')}
                            className={`flex flex-col items-center justify-center p-4 border rounded-lg transition ${paymentMethod === 'cod' ? 'border-[var(--primary-color)] bg-[rgba(139,107,75,0.05)]' : 'hover:bg-gray-50'
                                }`}
                        >
                            <FaMoneyBill size={24} className={paymentMethod === 'cod' ? 'text-[var(--primary-color)]' : 'text-gray-600'} />
                            <span className={`mt-2 text-sm ${paymentMethod === 'cod' ? 'font-medium text-[var(--primary-color)]' : 'text-gray-700'}`}>Cash on Delivery</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setPaymentMethod('barter')}
                            className={`flex flex-col items-center justify-center p-4 border rounded-lg transition ${paymentMethod === 'barter' ? 'border-[var(--primary-color)] bg-[rgba(139,107,75,0.05)]' : 'hover:bg-gray-50'
                                }`}
                        >
                            <FaExchangeAlt size={24} className={paymentMethod === 'barter' ? 'text-[var(--primary-color)]' : 'text-gray-600'} />
                            <span className={`mt-2 text-sm ${paymentMethod === 'barter' ? 'font-medium text-[var(--primary-color)]' : 'text-gray-700'}`}>Barter</span>
                        </button>
                    </div>

                    {paymentMethod && (
                        <form onSubmit={handleSubmitPayment} className="mt-6">
                            {paymentMethod === 'card' && renderCardForm()}
                            {paymentMethod === 'upi' && renderUpiForm()}
                            {paymentMethod === 'cod' && renderCODForm()}
                            {paymentMethod === 'barter' && renderBarterSystem()}

                            {(paymentMethod === 'card' || paymentMethod === 'cod' || (paymentMethod === 'upi' && qrCode)) && (
                                <div className="flex justify-between mt-8">
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-opacity-90"
                                        disabled={isProcessing ||
                                            (paymentMethod === 'upi' && !upiDetails.upiId)}
                                    >
                                        {isProcessing ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : paymentMethod === 'upi' ? 'Verify Payment' : `Pay ₹${cartTotal?.toFixed(2)}`}
                                    </button>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Payment;