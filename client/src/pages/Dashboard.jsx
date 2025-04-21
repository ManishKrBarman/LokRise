import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, sellerAPI } from '../services/api';
import { FiPackage, FiHeart, FiShoppingCart, FiDollarSign, FiCreditCard, FiStar, FiPlus, FiTrendingUp, FiUsers, FiBarChart2, FiAlertCircle } from 'react-icons/fi';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import ProductForm from '../components/ProductForm';

const MetricCard = ({ icon, title, value, footer }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
            <div className="p-3 rounded-full bg-[var(--primary-color)] bg-opacity-10 text-[var(--primary-color)]">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
            </div>
        </div>
        {footer && (
            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">{footer}</p>
            </div>
        )}
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [recentOrders, setRecentOrders] = useState([]);
    const [metrics, setMetrics] = useState({
        totalPurchases: 0,
        totalSpent: 0,
        totalSales: 0,
        totalRevenue: 0,
        reviewCount: 0,
        rating: 0,
        // Additional seller metrics
        productCount: 0,
        viewCount: 0,
        conversionRate: 0
    });
    const [loading, setLoading] = useState(true);
    const [showProductForm, setShowProductForm] = useState(false);
    const [sellerProducts, setSellerProducts] = useState([]);
    // Initialize seller status as null
    const [sellerStatus, setSellerStatus] = useState(null);
    // Only set isSeller if user exists and has role property set to 'seller'
    const isSeller = user && user.role === 'seller';
    
    // Safe console log that won't throw errors
    useEffect(() => {
        if (user) {
            console.log("User data:", user);
            console.log("User role:", user.role);
        } else {
            console.log("User data not loaded yet");
        }
    }, [user]);

    // Effect to immediately update seller status when user data changes - only if user is a seller
    useEffect(() => {
        if (user && isSeller && user.sellerApplication && user.sellerApplication.status) {
            setSellerStatus(user.sellerApplication.status);
        }
    }, [user, isSeller]);

    useEffect(() => {
        const loadDashboardData = async () => {
            if (user) {
                try {
                    // In a real app, these would be API calls
                    // For now, using metrics from user object
                    setMetrics({
                        totalPurchases: user.metrics?.totalPurchases || 0,
                        totalSpent: user.metrics?.totalSpent || 0,
                        totalSales: user.metrics?.totalSales || 0,
                        totalRevenue: user.metrics?.totalRevenue || 0,
                        reviewCount: user.metrics?.reviewCount || 0,
                        rating: user.metrics?.rating || 0,
                        // Additional seller metrics
                        productCount: user.metrics?.productCount || 0,
                        viewCount: user.metrics?.viewCount || 0,
                        conversionRate: user.metrics?.conversionRate || 0
                    });

                    // Load recent orders
                    setRecentOrders([]); // Would be populated from API

                    // Only load seller's products if user is a seller
                    if (isSeller) {
                        try {
                            // Check seller approval status from API
                            const statusResponse = await authAPI.getSellerApplicationStatus();

                            if (statusResponse.data && statusResponse.data.status) {
                                setSellerStatus(statusResponse.data.status);

                                // Only fetch products if seller is approved
                                if (statusResponse.data.status === 'approved') {
                                    // This would be an API call in a real app
                                    setSellerProducts([]); // Would be populated from API
                                }
                            } else if (!sellerStatus && user.sellerApplication) {
                                // Fallback to user object if API doesn't return status
                                setSellerStatus(user.sellerApplication.status || 'pending');
                            }
                        } catch (error) {
                            console.error('Error checking seller status:', error);
                            // If API call fails, use data from user object as fallback
                            if (!sellerStatus && user.sellerApplication) {
                                setSellerStatus(user.sellerApplication.status || 'pending');
                            } else if (!sellerStatus) {
                                setSellerStatus('pending');
                            }
                        }
                    } else {
                        // User is not a seller, so we don't need seller status - explicitly set to null
                        setSellerStatus(null);
                    }
                } catch (error) {
                    console.error('Error loading dashboard data:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                // If user data isn't available yet, keep loading
                // We don't set loading to false here because we're still waiting for user data
            }
        };

        if (user) {
            loadDashboardData();
        }
    }, [user, isSeller, sellerStatus]);

    // Display actual status in console for debugging
    useEffect(() => {
        if (user) {
            console.log("Final Seller Status:", sellerStatus);
            console.log("User has role:", user.role);
            console.log("Is user a seller?", isSeller);
            if (isSeller) {
                console.log("User sellerApplication status:", user?.sellerApplication?.status);
            }
        }
    }, [sellerStatus, user, isSeller]);

    const handleProductCreationSuccess = (newProduct) => {
        setSellerProducts([newProduct, ...sellerProducts]);
        setShowProductForm(false);
        // Update metrics
        setMetrics(prev => ({
            ...prev,
            productCount: prev.productCount + 1
        }));
    };

    const renderSellerApprovalMessage = () => {
        // Only show seller approval message if user is actually a seller
        if (!isSeller || sellerStatus === 'approved') return null;

        return (
            <div className={`mb-8 p-4 rounded-lg ${sellerStatus === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                }`}>
                <div className="flex items-center">
                    <FiAlertCircle className="mr-3 h-5 w-5" />
                    <h3 className="font-medium">
                        {sellerStatus === 'rejected'
                            ? 'Your seller application has been rejected.'
                            : 'Your seller account is awaiting approval.'}
                    </h3>
                </div>
                <p className="mt-2 text-sm">
                    {sellerStatus === 'rejected'
                        ? 'Please contact support for more information.'
                        : 'You will be able to create and list products once your account is approved.'}
                </p>
            </div>
        );
    };

    // Show loading state while waiting for user data
    if (!user || loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <NavBar />
                <div className="flex-grow bg-gray-50 flex items-center justify-center">
                    <div className="text-center">Loading dashboard...</div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <div className="flex-grow bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Here's what's happening with your {isSeller ? "business" : "account"} today.
                            </p>
                        </div>
                        {/* Only show Add Product button for approved sellers */}
                        {isSeller && sellerStatus === 'approved' && (
                            <button
                                onClick={() => setShowProductForm(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--primary-color)] hover:bg-opacity-90"
                            >
                                <FiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Add New Product
                            </button>
                        )}
                    </div>

                    {/* Seller Approval Status Message - only shown to sellers */}
                    {renderSellerApprovalMessage()}

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Common metrics for all users */}
                        <MetricCard
                            icon={<FiShoppingCart size={24} />}
                            title="Total Purchases"
                            value={metrics.totalPurchases}
                            footer={`₹${metrics.totalSpent.toFixed(2)} total spent`}
                        />
                        <MetricCard
                            icon={<FiStar size={24} />}
                            title="Reviews"
                            value={metrics.reviewCount}
                            footer={`${metrics.rating.toFixed(1)} average rating`}
                        />

                        {/* Seller-specific metrics - only shown to approved sellers */}
                        {isSeller && sellerStatus === 'approved' && (
                            <>
                                <MetricCard
                                    icon={<FiDollarSign size={24} />}
                                    title="Total Sales"
                                    value={metrics.totalSales}
                                    footer={`₹${metrics.totalRevenue.toFixed(2)} total revenue`}
                                />
                                <MetricCard
                                    icon={<FiPackage size={24} />}
                                    title="Products"
                                    value={metrics.productCount}
                                    footer="Active listings"
                                />
                                <MetricCard
                                    icon={<FiUsers size={24} />}
                                    title="Total Views"
                                    value={metrics.viewCount}
                                    footer="Product impressions"
                                />
                                <MetricCard
                                    icon={<FiBarChart2 size={24} />}
                                    title="Conversion Rate"
                                    value={`${metrics.conversionRate.toFixed(1)}%`}
                                    footer="Views to purchases"
                                />
                            </>
                        )}
                    </div>

                    {/* Product Form Modal for Sellers - only shown to approved sellers */}
                    {showProductForm && isSeller && sellerStatus === 'approved' && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Create New Product</h2>
                                    <button
                                        onClick={() => setShowProductForm(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        &times;
                                    </button>
                                </div>
                                <ProductForm
                                    onSuccess={handleProductCreationSuccess}
                                    onCancel={() => setShowProductForm(false)}
                                    initialSellerStatus={sellerStatus} // Pass the seller status from Dashboard
                                />
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow mb-8">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                <Link
                                    to="/orders"
                                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                                >
                                    <FiPackage className="text-[var(--primary-color)]" size={24} />
                                    <span className="ml-3 font-medium text-gray-900">View Orders</span>
                                </Link>
                                <Link
                                    to="/wishlist"
                                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                                >
                                    <FiHeart className="text-[var(--primary-color)]" size={24} />
                                    <span className="ml-3 font-medium text-gray-900">My Wishlist</span>
                                </Link>
                                <Link
                                    to="/cart"
                                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                                >
                                    <FiShoppingCart className="text-[var(--primary-color)]" size={24} />
                                    <span className="ml-3 font-medium text-gray-900">Shopping Cart</span>
                                </Link>
                                <Link
                                    to="/payment-methods"
                                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                                >
                                    <FiCreditCard className="text-[var(--primary-color)]" size={24} />
                                    <span className="ml-3 font-medium text-gray-900">Payment Methods</span>
                                </Link>
                                
                                {/* Analytics link - only shown to approved sellers */}
                                {isSeller && sellerStatus === 'approved' && (
                                    <Link
                                        to="/analytics"
                                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                                    >
                                        <FiTrendingUp className="text-[var(--primary-color)]" size={24} />
                                        <span className="ml-3 font-medium text-gray-900">Advanced Analytics</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Seller Products Section - only shown to approved sellers */}
                    {isSeller && sellerStatus === 'approved' && (
                        <div className="bg-white rounded-lg shadow mb-8">
                            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">Your Products</h3>
                                <button
                                    onClick={() => setShowProductForm(true)}
                                    className="text-sm text-[var(--primary-color)] hover:underline"
                                >
                                    + Add New
                                </button>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {sellerProducts.length > 0 ? (
                                    sellerProducts.map((product) => (
                                        <div key={product.id} className="p-6 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-gray-200 rounded-md mr-4">
                                                    {product.images && product.images.length > 0 && (
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover rounded-md"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                                    <p className="text-sm text-gray-600">₹{product.price} • {product.quantityAvailable} in stock</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded">Edit</button>
                                                <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded">View</button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-gray-500">
                                        You haven't added any products yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                {isSeller && sellerStatus === 'approved' ? "Recent Customer Orders" : "Your Recent Orders"}
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <div key={order.id} className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    Order #{order.orderNumber}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">
                                                    ₹{order.totalAmount.toFixed(2)}
                                                </p>
                                                <p className={`text-sm ${order.status === 'delivered' ? 'text-green-600' :
                                                    order.status === 'cancelled' ? 'text-red-600' :
                                                        'text-yellow-600'
                                                    }`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-gray-500">
                                    No recent orders found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;