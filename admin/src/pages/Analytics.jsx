import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('last30days');

    // Fetch analytics data
    useEffect(() => {
        const fetchAnalyticsData = async () => {
            setLoading(true);
            try {
                // For sales report
                const salesResponse = await adminAPI.getSalesReport({ timeRange });

                // For user stats
                const userResponse = await adminAPI.getUserStats({ timeRange });

                // For product stats
                const productResponse = await adminAPI.getProductStats({ timeRange });

                // Combine all responses
                const combinedData = {
                    sales: salesResponse.data,
                    users: userResponse.data,
                    products: productResponse.data
                };

                setAnalyticsData(combinedData);
                setError(null);
            } catch (err) {
                setError('Failed to load analytics data');
                console.error('Analytics data fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        // fetchAnalyticsData();

        // Using mock data for now
        const mockData = {
            sales: {
                dailySales: {
                    labels: ['Apr 10', 'Apr 11', 'Apr 12', 'Apr 13', 'Apr 14', 'Apr 15', 'Apr 16', 'Apr 17', 'Apr 18', 'Apr 19'],
                    data: [12500, 15000, 10000, 18000, 16500, 21000, 22500, 19000, 23500, 25000]
                },
                totalRevenue: 183000,
                averageOrderValue: 1650,
                ordersCount: {
                    total: 115,
                    pending: 15,
                    processing: 20,
                    shipped: 25,
                    delivered: 50,
                    cancelled: 5
                },
                revenueByCategory: {
                    labels: ['Electronics', 'Fashion', 'Home', 'Sports', 'Books'],
                    data: [85000, 40000, 25000, 18000, 15000]
                }
            },
            users: {
                newUsers: {
                    labels: ['Apr 10', 'Apr 11', 'Apr 12', 'Apr 13', 'Apr 14', 'Apr 15', 'Apr 16', 'Apr 17', 'Apr 18', 'Apr 19'],
                    data: [5, 8, 3, 10, 7, 12, 15, 9, 11, 14]
                },
                totalUsers: 542,
                activeUsers: 480,
                usersByRole: {
                    labels: ['Buyers', 'Sellers', 'Admins'],
                    data: [425, 112, 5]
                }
            },
            products: {
                newProducts: {
                    labels: ['Apr 10', 'Apr 11', 'Apr 12', 'Apr 13', 'Apr 14', 'Apr 15', 'Apr 16', 'Apr 17', 'Apr 18', 'Apr 19'],
                    data: [8, 12, 5, 15, 10, 18, 20, 14, 16, 22]
                },
                totalProducts: 879,
                outOfStockProducts: 123,
                productsByCategory: {
                    labels: ['Electronics', 'Fashion', 'Home', 'Sports', 'Books'],
                    data: [220, 312, 175, 98, 74]
                }
            }
        };

        setTimeout(() => {
            setAnalyticsData(mockData);
            setLoading(false);
        }, 1000);
    }, [timeRange]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    // Sales chart configuration
    const salesChartConfig = {
        data: {
            labels: analyticsData?.sales.dailySales.labels || [],
            datasets: [
                {
                    label: 'Revenue',
                    data: analyticsData?.sales.dailySales.data || [],
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => formatCurrency(value)
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: context => formatCurrency(context.parsed.y)
                    }
                },
                title: {
                    display: true,
                    text: 'Daily Revenue'
                }
            }
        }
    };

    // User growth chart configuration
    const userChartConfig = {
        data: {
            labels: analyticsData?.users.newUsers.labels || [],
            datasets: [
                {
                    label: 'New Users',
                    data: analyticsData?.users.newUsers.data || [],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'New User Registrations'
                }
            }
        }
    };

    // Order status chart configuration
    const orderStatusChartConfig = {
        data: {
            labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            datasets: [
                {
                    data: analyticsData ? [
                        analyticsData.sales.ordersCount.pending,
                        analyticsData.sales.ordersCount.processing,
                        analyticsData.sales.ordersCount.shipped,
                        analyticsData.sales.ordersCount.delivered,
                        analyticsData.sales.ordersCount.cancelled
                    ] : [],
                    backgroundColor: [
                        '#FBBF24', // yellow
                        '#3B82F6', // blue
                        '#8B5CF6', // purple
                        '#10B981', // green
                        '#EF4444'  // red
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Orders by Status'
                }
            }
        }
    };

    // Category revenue chart configuration
    const categoryRevenueChartConfig = {
        data: {
            labels: analyticsData?.sales.revenueByCategory.labels || [],
            datasets: [
                {
                    label: 'Revenue',
                    data: analyticsData?.sales.revenueByCategory.data || [],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(153, 102, 255, 0.6)'
                    ]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Revenue by Category'
                }
            }
        }
    };

    // Product by category chart configuration
    const productByCategoryChartConfig = {
        data: {
            labels: analyticsData?.products.productsByCategory.labels || [],
            datasets: [
                {
                    label: 'Products',
                    data: analyticsData?.products.productsByCategory.data || [],
                    backgroundColor: [
                        '#3B82F6',
                        '#EF4444',
                        '#10B981',
                        '#F59E0B',
                        '#8B5CF6'
                    ]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Products by Category'
                }
            }
        }
    };

    // Users by role chart configuration
    const usersByRoleChartConfig = {
        data: {
            labels: analyticsData?.users.usersByRole.labels || [],
            datasets: [
                {
                    data: analyticsData?.users.usersByRole.data || [],
                    backgroundColor: [
                        '#10B981',
                        '#3B82F6',
                        '#8B5CF6'
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'User Distribution by Role'
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center">
                    <FiRefreshCw className="animate-spin text-primary h-12 w-12 mb-4" />
                    <p className="text-lg">Loading analytics...</p>
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
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>

                <div className="flex space-x-4">
                    <div>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="px-3 py-2 border rounded"
                        >
                            <option value="last7days">Last 7 Days</option>
                            <option value="last30days">Last 30 Days</option>
                            <option value="last90days">Last 90 Days</option>
                            <option value="lastYear">Last Year</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Sales Stats */}
                <div className="admin-card">
                    <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-bold">{formatCurrency(analyticsData.sales.totalRevenue)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Orders</p>
                            <p className="text-2xl font-bold">{analyticsData.sales.ordersCount.total}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Avg. Order Value</p>
                            <p className="text-2xl font-bold">{formatCurrency(analyticsData.sales.averageOrderValue)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Conversion Rate</p>
                            <p className="text-2xl font-bold">3.2%</p>
                        </div>
                    </div>
                </div>

                {/* User Stats */}
                <div className="admin-card">
                    <h2 className="text-lg font-semibold mb-4">User Overview</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Total Users</p>
                            <p className="text-2xl font-bold">{analyticsData.users.totalUsers}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Active Users</p>
                            <p className="text-2xl font-bold">{analyticsData.users.activeUsers}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">New Users</p>
                            <p className="text-2xl font-bold">{analyticsData.users.newUsers.data.reduce((acc, curr) => acc + curr, 0)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Active Rate</p>
                            <p className="text-2xl font-bold">{Math.round((analyticsData.users.activeUsers / analyticsData.users.totalUsers) * 100)}%</p>
                        </div>
                    </div>
                </div>

                {/* Product Stats */}
                <div className="admin-card">
                    <h2 className="text-lg font-semibold mb-4">Product Overview</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Total Products</p>
                            <p className="text-2xl font-bold">{analyticsData.products.totalProducts}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Out of Stock</p>
                            <p className="text-2xl font-bold">{analyticsData.products.outOfStockProducts}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">New Products</p>
                            <p className="text-2xl font-bold">{analyticsData.products.newProducts.data.reduce((acc, curr) => acc + curr, 0)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Stock Rate</p>
                            <p className="text-2xl font-bold">{Math.round(((analyticsData.products.totalProducts - analyticsData.products.outOfStockProducts) / analyticsData.products.totalProducts) * 100)}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="admin-card">
                    <div className="h-80">
                        <Line data={salesChartConfig.data} options={salesChartConfig.options} />
                    </div>
                </div>
                <div className="admin-card">
                    <div className="h-80">
                        <Line data={userChartConfig.data} options={userChartConfig.options} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="admin-card">
                    <div className="h-80">
                        <Doughnut data={orderStatusChartConfig.data} options={orderStatusChartConfig.options} />
                    </div>
                </div>
                <div className="admin-card">
                    <div className="h-80">
                        <Bar data={categoryRevenueChartConfig.data} options={categoryRevenueChartConfig.options} />
                    </div>
                </div>
                <div className="admin-card">
                    <div className="h-80">
                        <Doughnut data={usersByRoleChartConfig.data} options={usersByRoleChartConfig.options} />
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <h2 className="text-lg font-semibold mb-4">Products by Category</h2>
                <div className="h-96">
                    <Bar data={productByCategoryChartConfig.data} options={productByCategoryChartConfig.options} />
                </div>
            </div>
        </div>
    );
};

export default Analytics;