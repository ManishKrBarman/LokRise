import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiPackage, FiHeart, FiShoppingCart, FiDollarSign, FiCreditCard, FiStar } from 'react-icons/fi';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

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
        rating: 0
    });
    const [loading, setLoading] = useState(true);

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
                        rating: user.metrics?.rating || 0
                    });
                    setRecentOrders([]); // Would be populated from API
                } catch (error) {
                    console.error('Error loading dashboard data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadDashboardData();
    }, [user]);

    if (loading) {
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
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Here's what's happening with your account today.
                        </p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
                        <MetricCard
                            icon={<FiShoppingCart size={24} />}
                            title="Total Purchases"
                            value={metrics.totalPurchases}
                            footer={`₹${metrics.totalSpent.toFixed(2)} total spent`}
                        />
                        {user?.role === 'seller' && (
                            <MetricCard
                                icon={<FiDollarSign size={24} />}
                                title="Total Sales"
                                value={metrics.totalSales}
                                footer={`₹${metrics.totalRevenue.toFixed(2)} total revenue`}
                            />
                        )}
                        <MetricCard
                            icon={<FiStar size={24} />}
                            title="Reviews"
                            value={metrics.reviewCount}
                            footer={`${metrics.rating.toFixed(1)} average rating`}
                        />
                    </div>

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
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
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
                                                <p className={`text-sm ${
                                                    order.status === 'delivered' ? 'text-green-600' :
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