import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import {
    FiUsers,
    FiShoppingBag,
    FiShoppingCart,
    FiUserCheck,
    FiAlertCircle,
    FiRefreshCw
} from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);

    // Fetch dashboard stats
    useEffect(() => {
        const fetchDashboardStats = async () => {
            setLoading(true);
            try {
                const response = await adminAPI.getDashboardAnalytics();
                setStats(response.data);
                setError(null);

                // Also fetch recent orders
                const ordersResponse = await adminAPI.getAllOrders({
                    limit: 5,
                    page: 1,
                    sort: '-createdAt'  // Sort by most recent first
                });

                setRecentOrders(ordersResponse.data.orders || []);
            } catch (err) {
                setError('Failed to load dashboard statistics');
                console.error('Dashboard data fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    // If no data is available yet, show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center">
                    <FiRefreshCw className="animate-spin text-primary h-12 w-12 mb-4" />
                    <p className="text-lg">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center text-red-600">
                    <FiAlertCircle className="h-12 w-12 mb-4" />
                    <p className="text-lg">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center text-red-600">
                    <FiAlertCircle className="h-12 w-12 mb-4" />
                    <p className="text-lg">No data available</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        );
    }

    // Calculate growth percentage for users
    const userGrowth = stats.users && stats.users.total > 0
        ? ((stats.users.today / stats.users.total) * 100).toFixed(1)
        : 0;

    // Generate sales chart data from real data
    const salesChartData = {
        labels: stats.salesData?.labels || [],
        datasets: [
            {
                label: 'Revenue',
                data: stats.salesData?.data || [],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                tension: 0.4
            }
        ]
    };

    // Generate category chart data from real data
    const categoryChartData = {
        labels: stats.categoryData?.labels || [],
        datasets: [
            {
                data: stats.categoryData?.data || [],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(201, 203, 207, 0.6)'
                ],
                borderWidth: 1
            }
        ]
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="admin-card flex items-center">
                    <div className="bg-blue-100 p-4 rounded-full mr-4">
                        <FiUsers className="text-blue-600 h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Users</h3>
                        <p className="text-3xl font-bold">{stats.users.total}</p>
                        <p className="text-sm text-green-600">
                            +{stats.users.today} new ({userGrowth}%)
                        </p>
                    </div>
                </div>

                <div className="admin-card flex items-center">
                    <div className="bg-purple-100 p-4 rounded-full mr-4">
                        <FiShoppingBag className="text-purple-600 h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Products</h3>
                        <p className="text-3xl font-bold">{stats.products.total}</p>
                        <p className="text-sm">
                            {stats.products.today} new today
                        </p>
                    </div>
                </div>

                <div className="admin-card flex items-center">
                    <div className="bg-green-100 p-4 rounded-full mr-4">
                        <FiShoppingCart className="text-green-600 h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Orders</h3>
                        <p className="text-3xl font-bold">{stats.orders.total}</p>
                        <p className="text-sm">
                            {stats.orders.today} new today
                        </p>
                    </div>
                </div>

                <div className="admin-card flex items-center">
                    <div className="bg-orange-100 p-4 rounded-full mr-4">
                        <FiUserCheck className="text-orange-600 h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Revenue</h3>
                        <p className="text-3xl font-bold">${stats.revenue.total.toLocaleString()}</p>
                        <p className="text-sm text-orange-600">
                            ${stats.revenue.daily.toLocaleString()} today
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Trend */}
                <div className="admin-card lg:col-span-2">
                    <h3 className="text-xl font-semibold mb-4">Revenue Trends</h3>
                    <div className="h-80">
                        <Line
                            data={salesChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            callback: value => `$${value}`
                                        }
                                    }
                                },
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: context => `$${context.parsed.y}`
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="admin-card">
                    <h3 className="text-xl font-semibold mb-4">Category Distribution</h3>
                    <div className="h-80 flex items-center justify-center">
                        <Doughnut
                            data={categoryChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom'
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="admin-card">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Recent Orders</h3>
                    <button
                        onClick={() => window.location.href = '/orders'}
                        className="text-primary hover:text-primary-dark">
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length > 0 ? (
                                recentOrders.map(order => (
                                    <tr key={order._id}>
                                        <td className="font-medium">{order._id}</td>
                                        <td>{order.buyer?.name || 'Unknown'}</td>
                                        <td>${order.totalAmount.toFixed(2)}</td>
                                        <td>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                                                ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'
                                                }
                                            `}>
                                                {(order.status && typeof order.status === 'string') ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : 'Unknown'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">No recent orders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;