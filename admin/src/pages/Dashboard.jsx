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

    // Fetch dashboard stats
    useEffect(() => {
        const fetchDashboardStats = async () => {
            setLoading(true);
            try {
                const response = await adminAPI.getDashboardStats();
                setStats(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to load dashboard statistics');
                console.error('Dashboard data fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    // For testing/demo purposes - mock data when API doesn't return data
    const mockStats = {
        userStats: { total: 542, new: 48, growth: 12.5 },
        productStats: { total: 879, active: 756, outOfStock: 123 },
        orderStats: { total: 1245, pending: 28, delivered: 1189, cancelled: 28 },
        sellerStats: { total: 89, pending: 12, approved: 77, rejected: 4 },
        salesData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [12500, 15000, 18000, 16500, 21000, 22500]
        },
        categoryData: {
            labels: ['Electronics', 'Fashion', 'Home', 'Sports', 'Books'],
            data: [35, 25, 20, 10, 10]
        },
        recentOrders: [
            { id: 'ORD9876', customer: 'Jane Smith', amount: 230.50, status: 'Delivered' },
            { id: 'ORD9875', customer: 'John Doe', amount: 120.00, status: 'Pending' },
            { id: 'ORD9874', customer: 'Robert Brown', amount: 315.75, status: 'Processing' },
            { id: 'ORD9873', customer: 'Emily Johnson', amount: 79.99, status: 'Delivered' },
            { id: 'ORD9872', customer: 'Michael Wong', amount: 189.25, status: 'Delivered' }
        ]
    };

    // Use real data if available, otherwise use mock data
    const displayStats = stats || mockStats;

    // Sales Chart Config
    const salesChartData = {
        labels: displayStats.salesData?.labels || [],
        datasets: [
            {
                label: 'Revenue',
                data: displayStats.salesData?.data || [],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                tension: 0.4
            }
        ]
    };

    // Category Chart Config
    const categoryChartData = {
        labels: displayStats.categoryData?.labels || [],
        datasets: [
            {
                data: displayStats.categoryData?.data || [],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderWidth: 1
            }
        ]
    };

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
                        <p className="text-3xl font-bold">{displayStats.userStats.total}</p>
                        <p className="text-sm text-green-600">
                            +{displayStats.userStats.new} new ({displayStats.userStats.growth}%)
                        </p>
                    </div>
                </div>

                <div className="admin-card flex items-center">
                    <div className="bg-purple-100 p-4 rounded-full mr-4">
                        <FiShoppingBag className="text-purple-600 h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Products</h3>
                        <p className="text-3xl font-bold">{displayStats.productStats.total}</p>
                        <p className="text-sm">
                            {displayStats.productStats.active} active / {displayStats.productStats.outOfStock} out of stock
                        </p>
                    </div>
                </div>

                <div className="admin-card flex items-center">
                    <div className="bg-green-100 p-4 rounded-full mr-4">
                        <FiShoppingCart className="text-green-600 h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Orders</h3>
                        <p className="text-3xl font-bold">{displayStats.orderStats.total}</p>
                        <p className="text-sm">
                            {displayStats.orderStats.pending} pending / {displayStats.orderStats.delivered} delivered
                        </p>
                    </div>
                </div>

                <div className="admin-card flex items-center">
                    <div className="bg-orange-100 p-4 rounded-full mr-4">
                        <FiUserCheck className="text-orange-600 h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Sellers</h3>
                        <p className="text-3xl font-bold">{displayStats.sellerStats.total}</p>
                        <p className="text-sm text-orange-600">
                            {displayStats.sellerStats.pending} pending approval
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
                    <button className="text-primary hover:text-primary-dark">View All</button>
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
                            {displayStats.recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="font-medium">{order.id}</td>
                                    <td>{order.customer}</td>
                                    <td>${order.amount.toFixed(2)}</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }
                    `}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;