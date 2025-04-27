import React, { useState, useEffect } from 'react';
import { FiPackage, FiCheck, FiX, FiAlertCircle, FiShoppingBag, FiUser, FiMapPin, FiFileText, FiGrid, FiSearch, FiFilter, FiDownload, FiCalendar, FiTrendingUp, FiEye, FiArrowLeft } from 'react-icons/fi';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [actionLoading, setActionLoading] = useState(false);
    const [actionSuccess, setActionSuccess] = useState(null);
    const [actionError, setActionError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [orderToReject, setOrderToReject] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date-desc');
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [orderStats, setOrderStats] = useState({
        pending: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        total: 0,
        totalRevenue: 0
    });
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        if (user && user.role !== 'seller') {
            navigate('/dashboard');
        }
    }, [isAuthenticated, user, navigate]);

    const fetchOrderStats = async () => {
        try {
            const response = await orderAPI.getSellerOrderStats();
            
            if (response.data) {
                setOrderStats(response.data);
            }
        } catch (err) {
            console.error('Error fetching order statistics:', err);
            setOrderStats({
                pending: 0,
                confirmed: 0,
                shipped: 0,
                delivered: 0,
                cancelled: 0,
                total: orders.length,
                totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0)
            });
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const queryParams = {
                status: statusFilter !== 'all' ? statusFilter : undefined,
                page,
                limit: 10,
                search: searchQuery || undefined,
                sort: sortBy,
                startDate: dateRange.startDate || undefined,
                endDate: dateRange.endDate || undefined
            };
            
            const response = await orderAPI.getSellerOrders(queryParams);
            
            if (response.data && response.data.orders) {
                setOrders(response.data.orders);
                setTotalPages(response.data.totalPages || 1);
                
                const stats = {
                    pending: 0,
                    confirmed: 0,
                    shipped: 0,
                    delivered: 0,
                    cancelled: 0,
                    total: response.data.totalOrders || response.data.orders.length,
                    totalRevenue: 0
                };
                
                response.data.orders.forEach(order => {
                    if (stats[order.status] !== undefined) {
                        stats[order.status]++;
                    }
                    stats.totalRevenue += order.totalAmount || 0;
                });
                
                setOrderStats(prevStats => ({
                    ...prevStats,
                    ...stats
                }));
                
                fetchOrderStats();
            } else {
                setOrders([]);
                setError('No orders found');
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders. Please try again.');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user?.role === 'seller') {
            fetchOrders();
        }
    }, [isAuthenticated, user, statusFilter, page, searchQuery, sortBy, dateRange]);

    const handleViewOrderDetails = (order) => {
        setSelectedOrder(order);
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setPage(1);
    };

    const handleDateRangeChange = (e) => {
        setDateRange({
            ...dateRange,
            [e.target.name]: e.target.value
        });
        setPage(1);
    };

    const toggleFilterPanel = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setSortBy('date-desc');
        setDateRange({ startDate: '', endDate: '' });
        setPage(1);
    };

    const generateOrdersReport = async () => {
        try {
            setIsGeneratingReport(true);
            
            const queryParams = {
                status: statusFilter !== 'all' ? statusFilter : undefined,
                search: searchQuery || undefined,
                sort: sortBy,
                startDate: dateRange.startDate || undefined,
                endDate: dateRange.endDate || undefined,
                limit: 1000
            };
            
            const response = await orderAPI.getSellerOrders(queryParams);
            
            if (response.data && response.data.orders) {
                const ordersData = response.data.orders;
                
                let csv = 'Order ID,Order Number,Date,Customer,Amount,Status,Payment Method\n';
                
                ordersData.forEach(order => {
                    const date = new Date(order.createdAt).toLocaleDateString();
                    const customerName = order.buyer?.name || 'Unknown';
                    const amount = order.totalAmount?.toFixed(2) || '0.00';
                    const status = order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown';
                    const paymentMethod = order.paymentMethod || 'Unknown';
                    
                    csv += `${order._id || ''},"${order.orderNumber || ''}","${date}","${customerName}",${amount},"${status}","${paymentMethod}"\n`;
                });
                
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `orders-report-${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                setActionSuccess('Report generated successfully');
                setTimeout(() => {
                    setActionSuccess(null);
                }, 3000);
            } else {
                setActionError('No orders found to generate report');
                setTimeout(() => {
                    setActionError(null);
                }, 3000);
            }
        } catch (err) {
            console.error('Error generating orders report:', err);
            setActionError('Failed to generate orders report');
            setTimeout(() => {
                setActionError(null);
            }, 3000);
        } finally {
            setIsGeneratingReport(false);
        }
    };

    const handleAcceptOrder = async (orderId) => {
        try {
            setActionLoading(true);
            setActionError(null);
            setActionSuccess(null);
            
            const response = await orderAPI.updateOrderStatus(
                orderId,
                "confirmed", 
                "Order accepted by seller"
            );
            
            if (response.data) {
                setActionSuccess('Order accepted successfully');
                setOrders(orders.map(order => 
                    order._id === orderId 
                        ? { ...order, status: 'confirmed' } 
                        : order
                ));
                
                if (selectedOrder && selectedOrder._id === orderId) {
                    setSelectedOrder({
                        ...selectedOrder,
                        status: 'confirmed',
                        statusHistory: [
                            ...selectedOrder.statusHistory,
                            {
                                status: 'confirmed',
                                date: new Date(),
                                note: 'Order accepted by seller'
                            }
                        ]
                    });
                }
                
                setOrderStats(prev => ({
                    ...prev,
                    pending: Math.max(0, prev.pending - 1),
                    confirmed: prev.confirmed + 1
                }));
                
                setTimeout(() => {
                    setActionSuccess(null);
                }, 3000);
            }
        } catch (err) {
            console.error('Error accepting order:', err);
            setActionError('Failed to accept order. Please try again.');
            
            setTimeout(() => {
                setActionError(null);
            }, 3000);
        } finally {
            setActionLoading(false);
        }
    };

    const handleMarkAsShipped = async (orderId) => {
        try {
            setActionLoading(true);
            setActionError(null);
            setActionSuccess(null);
            
            const response = await orderAPI.updateOrderStatus(
                orderId,
                "shipped", 
                "Order marked as shipped by seller"
            );
            
            if (response.data) {
                setActionSuccess('Order marked as shipped successfully');
                setOrders(orders.map(order => 
                    order._id === orderId 
                        ? { ...order, status: 'shipped' } 
                        : order
                ));
                
                if (selectedOrder && selectedOrder._id === orderId) {
                    setSelectedOrder({
                        ...selectedOrder,
                        status: 'shipped',
                        statusHistory: [
                            ...selectedOrder.statusHistory,
                            {
                                status: 'shipped',
                                date: new Date(),
                                note: 'Order marked as shipped by seller'
                            }
                        ]
                    });
                }
                
                setOrderStats(prev => ({
                    ...prev,
                    confirmed: Math.max(0, prev.confirmed - 1),
                    shipped: prev.shipped + 1
                }));
                
                setTimeout(() => {
                    setActionSuccess(null);
                }, 3000);
            }
        } catch (err) {
            console.error('Error marking order as shipped:', err);
            setActionError('Failed to mark order as shipped. Please try again.');
            
            setTimeout(() => {
                setActionError(null);
            }, 3000);
        } finally {
            setActionLoading(false);
        }
    };

    const openRejectModal = (order) => {
        setOrderToReject(order);
        setRejectionReason('');
        setIsRejectModalOpen(true);
    };

    const closeRejectModal = () => {
        setIsRejectModalOpen(false);
        setOrderToReject(null);
        setRejectionReason('');
    };

    const handleRejectOrder = async () => {
        if (!orderToReject) return;
        
        try {
            setActionLoading(true);
            setActionError(null);
            setActionSuccess(null);
            
            const response = await orderAPI.updateOrderStatus(
                orderToReject._id,
                'cancelled',
                `Order rejected by seller: ${rejectionReason}`
            );
            
            if (response.data) {
                setActionSuccess('Order rejected successfully');
                setOrders(orders.map(order => 
                    order._id === orderToReject._id 
                        ? { ...order, status: 'cancelled' } 
                        : order
                ));
                
                if (selectedOrder && selectedOrder._id === orderToReject._id) {
                    setSelectedOrder({
                        ...selectedOrder,
                        status: 'cancelled',
                        statusHistory: [
                            ...selectedOrder.statusHistory,
                            {
                                status: 'cancelled',
                                date: new Date(),
                                note: `Order rejected by seller: ${rejectionReason}`
                            }
                        ]
                    });
                }
                
                setOrderStats(prev => ({
                    ...prev,
                    pending: Math.max(0, prev.pending - 1),
                    cancelled: prev.cancelled + 1
                }));
                
                setTimeout(() => {
                    setActionSuccess(null);
                }, 3000);
                
                closeRejectModal();
            }
        } catch (err) {
            console.error('Error rejecting order:', err);
            setActionError('Failed to reject order. Please try again.');
            
            setTimeout(() => {
                setActionError(null);
            }, 3000);
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-purple-100 text-purple-800';
            case 'shipped':
                return 'bg-indigo-100 text-indigo-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const renderOrderStats = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                    <p className="text-2xl font-bold">{orderStats.total}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
                    <p className="text-2xl font-bold">₹{orderStats.totalRevenue?.toFixed(2) || '0.00'}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-sm font-medium text-yellow-500">Pending</h3>
                    <p className="text-2xl font-bold">{orderStats.pending}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-sm font-medium text-blue-500">Confirmed</h3>
                    <p className="text-2xl font-bold">{orderStats.confirmed}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-sm font-medium text-indigo-500">Shipped</h3>
                    <p className="text-2xl font-bold">{orderStats.shipped}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-sm font-medium text-green-500">Delivered</h3>
                    <p className="text-2xl font-bold">{orderStats.delivered}</p>
                </div>
            </div>
        );
    };

    const renderRejectModal = () => {
        if (!isRejectModalOpen || !orderToReject) return null;

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Confirm Order Rejection
                    </h3>
                    
                    <div className="mb-4">
                        <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
                            Rejection Reason
                        </label>
                        <textarea
                            id="rejectionReason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                            rows="3"
                            placeholder="Please provide a reason for rejecting this order..."
                            required
                        ></textarea>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={closeRejectModal}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRejectOrder}
                            disabled={actionLoading || !rejectionReason.trim()}
                            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${(!rejectionReason.trim() || actionLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {actionLoading ? 'Processing...' : 'Reject Order'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderFilterPanel = () => {
        if (!isFilterOpen) return null;
        
        return (
            <div className="bg-white rounded-lg shadow mt-4 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={dateRange.startDate}
                            onChange={handleDateRangeChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={dateRange.endDate}
                            onChange={handleDateRangeChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sort By
                        </label>
                        <select 
                            value={sortBy}
                            onChange={handleSortChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="amount-desc">Highest Amount</option>
                            <option value="amount-asc">Lowest Amount</option>
                        </select>
                    </div>
                    
                    <div className="flex items-end">
                        <button 
                            onClick={clearFilters}
                            className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderOrderDetails = () => {
        if (!selectedOrder) return null;
        
        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header with back button */}
                <div className="border-b border-gray-200 bg-gray-50 py-4 px-6 flex items-center">
                    <button
                        onClick={closeOrderDetails}
                        className="mr-4 text-gray-600 hover:text-[var(--primary-color)]"
                    >
                        <FiArrowLeft size={20} />
                    </button>
                    <h2 className="text-lg font-medium">Order Details: #{selectedOrder.orderNumber || selectedOrder._id?.substring(0, 8)}</h2>
                </div>

                <div className="p-6">
                    {/* Order summary */}
                    <div className="mb-8">
                        <div className="flex flex-wrap justify-between mb-4">
                            <div className="mb-2">
                                <p className="text-sm text-gray-500">Order Placed</p>
                                <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                            </div>
                            <div className="mb-2">
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="font-medium">₹{selectedOrder.totalAmount?.toFixed(2)}</p>
                            </div>
                            <div className="mb-2">
                                <p className="text-sm text-gray-500">Status</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedOrder.status)}`}>
                                    {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1) || 'Unknown'}
                                </span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Buyer info */}
                            <div>
                                <h3 className="font-medium mb-2">Customer Information</h3>
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <p className="font-medium">{selectedOrder.buyer?.name || 'N/A'}</p>
                                    <p>{selectedOrder.buyer?.email || 'N/A'}</p>
                                    <p>{selectedOrder.buyer?.phone || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Shipping info */}
                            <div>
                                <h3 className="font-medium mb-2">Shipping Information</h3>
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <p className="font-medium">{selectedOrder.shippingAddress?.name || 'N/A'}</p>
                                    <p>{selectedOrder.shippingAddress?.addressLine1}</p>
                                    {selectedOrder.shippingAddress?.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.pinCode}</p>
                                    <p>{selectedOrder.shippingAddress?.state}, {selectedOrder.shippingAddress?.country || 'India'}</p>
                                </div>
                            </div>

                            {/* Payment info */}
                            <div>
                                <h3 className="font-medium mb-2">Payment Method</h3>
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <p>{selectedOrder.paymentMethod || 'Not specified'}</p>
                                    {selectedOrder.paymentDetails && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Status: {selectedOrder.paymentDetails.paymentStatus || 'Unknown'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order items */}
                    <div>
                        <h3 className="font-medium mb-4">Order Items</h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                        selectedOrder.items.map((item, index) => (
                                            <tr key={item._id || index}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img 
                                                                className="h-10 w-10 rounded-md object-cover" 
                                                                src={item.productImage || 'https://via.placeholder.com/100'} 
                                                                alt={item.name || 'Product Image'} 
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = 'https://via.placeholder.com/100';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.name || 'Unknown Product'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ₹{item.price?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    ₹{((item.price || 0) * item.quantity).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No items found in this order
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Order Status History */}
                    {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                        <div className="mt-8">
                            <h3 className="font-medium mb-4">Order Status History</h3>
                            <div className="border rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Note
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedOrder.statusHistory.map((status, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(status.date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(status.status)}`}>
                                                        {status.status?.charAt(0).toUpperCase() + status.status?.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {status.note || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Order Actions */}
                    {selectedOrder.status === 'pending' && (
                        <div className="mt-8 flex flex-wrap gap-3">
                            <button 
                                onClick={() => handleAcceptOrder(selectedOrder._id)}
                                disabled={actionLoading}
                                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 flex items-center"
                            >
                                <FiCheck className="mr-2" /> Accept Order
                            </button>
                            <button 
                                onClick={() => openRejectModal(selectedOrder)}
                                disabled={actionLoading}
                                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 flex items-center"
                            >
                                <FiX className="mr-2" /> Reject Order
                            </button>
                        </div>
                    )}

                    {selectedOrder.status === 'confirmed' && (
                        <div className="mt-8">
                            <button 
                                onClick={() => handleMarkAsShipped(selectedOrder._id)}
                                disabled={actionLoading}
                                className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 flex items-center"
                            >
                                <FiPackage className="mr-2" /> Mark as Shipped
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <NavBar fixed={false} />
            
            <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        View and manage all your customer orders in one place
                    </p>
                </div>

                {renderOrderStats()}

                {actionSuccess && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FiCheck className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">{actionSuccess}</p>
                            </div>
                        </div>
                    </div>
                )}

                {actionError && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FiAlertCircle className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{actionError}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900 mb-4 md:mb-0">
                                Order History
                            </h2>
                            
                            <div className="flex flex-col sm:flex-row w-full md:w-auto space-y-3 sm:space-y-0 space-x-0 sm:space-x-3">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiSearch className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder="Search orders..."
                                        className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full"
                                    />
                                </div>
                                
                                <div className="flex space-x-3">
                                    <select
                                        id="statusFilter"
                                        value={statusFilter}
                                        onChange={handleStatusFilterChange}
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm rounded-md"
                                    >
                                        <option value="all">All Orders</option>
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                    
                                    <button 
                                        onClick={toggleFilterPanel}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]"
                                    >
                                        <FiFilter className="mr-2" />
                                        Filters
                                    </button>
                                    
                                    <button 
                                        onClick={generateOrdersReport}
                                        disabled={isGeneratingReport || orders.length === 0}
                                        className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] ${(isGeneratingReport || orders.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <FiDownload className="mr-2" />
                                        {isGeneratingReport ? 'Generating...' : 'Export'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {renderFilterPanel()}
                    </div>
                    
                    <div className="p-6">
                        {selectedOrder ? renderOrderDetails() : (
                            <>
                                {actionSuccess && (
                                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                                        <div className="flex items-center">
                                            <FiCheck className="h-5 w-5 text-green-400 mr-2" />
                                            <p className="text-green-700">{actionSuccess}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {loading && orders.length === 0 ? (
                                    <div className="flex items-center justify-center h-64">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-color)]"></div>
                                    </div>
                                ) : error && orders.length === 0 ? (
                                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <FiAlertCircle className="h-5 w-5 text-red-400" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-red-700">{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FiPackage className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                        <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
                                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                                            {searchQuery 
                                                ? `No results found for "${searchQuery}". Try a different search term.`
                                                : statusFilter !== 'all' 
                                                    ? `You don't have any ${statusFilter} orders at the moment.` 
                                                    : dateRange.startDate || dateRange.endDate
                                                        ? `No orders found in the selected date range.`
                                                        : 'You haven\'t received any orders yet. Once you receive an order, it will appear here.'}
                                        </p>
                                        {(searchQuery || statusFilter !== 'all' || dateRange.startDate || dateRange.endDate) && (
                                            <button
                                                onClick={clearFilters}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                            >
                                                Clear Filters
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Order Info
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Customer
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Products
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Amount
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {orders.map((order) => (
                                                    <tr key={order._id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                #{order.orderNumber || order._id.substring(0, 8)}
                                                            </div>
                                                            <div className="text-xs text-gray-500 flex items-center">
                                                                <FiCalendar className="mr-1" size={12} />
                                                                {formatDate(order.createdAt)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-medium text-gray-900 flex items-center">
                                                                <FiUser className="mr-2 text-gray-400" size={14} />
                                                                {order.buyer?.name || 'Unknown'}
                                                            </div>
                                                            {order.buyer?.email && (
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    {order.buyer.email}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900">
                                                                {order.items?.length || 0} item(s)
                                                            </div>
                                                            <div className="text-xs text-gray-500 truncate max-w-xs">
                                                                {(order.items || []).map((item, i) => (
                                                                    <span key={i} className="inline-block mr-1">
                                                                        {i > 0 ? ', ' : ''}{item.quantity}x {item.productName || item.name || ''}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                ₹{order.totalAmount?.toFixed(2)}
                                                            </div>
                                                            <div className="text-xs text-gray-500 flex items-center">
                                                                {order.paymentMethod || 'N/A'} 
                                                                {order.paymentDetails?.paymentStatus && (
                                                                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                                                                        order.paymentDetails.paymentStatus === 'paid' 
                                                                            ? 'bg-green-100 text-green-800' 
                                                                            : 'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                        {order.paymentDetails.paymentStatus}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                                                                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                                            </span>
                                                            {order.statusHistory && order.statusHistory.length > 1 && (
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    Updated {formatDate(order.statusHistory[order.statusHistory.length - 1].date).split(',')[0]}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col space-y-2">
                                                                <button 
                                                                    onClick={() => handleViewOrderDetails(order)}
                                                                    className="text-blue-600 hover:text-blue-900 text-sm flex items-center"
                                                                >
                                                                    <FiEye className="mr-1" size={14} /> View Details
                                                                </button>
                                                                
                                                                {order.status === 'pending' && (
                                                                    <>
                                                                        <button 
                                                                            onClick={() => handleAcceptOrder(order._id)}
                                                                            className="text-green-600 hover:text-green-900 text-sm flex items-center"
                                                                            disabled={actionLoading}
                                                                        >
                                                                            <FiCheck className="mr-1" size={14} /> Accept
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => openRejectModal(order)}
                                                                            className="text-red-600 hover:text-red-900 text-sm flex items-center"
                                                                            disabled={actionLoading}
                                                                        >
                                                                            <FiX className="mr-1" size={14} /> Reject
                                                                        </button>
                                                                    </>
                                                                )}

                                                                {order.status === 'confirmed' && (
                                                                    <button 
                                                                        onClick={() => handleMarkAsShipped(order._id)}
                                                                        className="text-indigo-600 hover:text-indigo-900 text-sm flex items-center"
                                                                        disabled={actionLoading}
                                                                    >
                                                                        <FiPackage className="mr-1" size={14} /> Ship
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        
                                        {totalPages > 1 && (
                                            <div className="flex justify-center mt-8">
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                    <button
                                                        onClick={() => handlePageChange(Math.max(1, page - 1))}
                                                        disabled={page === 1}
                                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
                                                    >
                                                        Previous
                                                    </button>
                                                    
                                                    {[...Array(totalPages)].map((_, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => handlePageChange(i + 1)}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === i + 1 ? 'bg-[var(--primary-color)] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    ))}
                                                    
                                                    <button
                                                        onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                                                        disabled={page === totalPages}
                                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
                                                    >
                                                        Next
                                                    </button>
                                                </nav>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            {renderRejectModal()}
            <Footer />
        </div>
    );
};

export default SellerOrders;