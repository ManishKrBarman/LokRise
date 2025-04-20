import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { FiRefreshCw, FiSearch, FiEye, FiEdit } from 'react-icons/fi';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await adminAPI.getAllOrders({
                    page: currentPage,
                    limit: 10,
                    search,
                    status: statusFilter !== 'all' ? statusFilter : undefined
                });

                // Use real data from the API response
                if (response.data && response.data.orders) {
                    setOrders(response.data.orders);
                    setTotalPages(response.data.totalPages || Math.ceil(response.data.totalOrders / 10) || 1);
                } else {
                    setOrders([]);
                    setTotalPages(1);
                }
                setError(null);
            } catch (err) {
                setError('Failed to load orders');
                console.error('Orders fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentPage, search, statusFilter]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const openOrderModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            setLoading(true);
            await adminAPI.updateOrderStatus(orderId, status);

            // Update local state
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, orderStatus: status } : order
            ));

            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder({ ...selectedOrder, orderStatus: status });
            }

        } catch (err) {
            setError('Failed to update order status');
            console.error('Update order status error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusBadgeClass = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center">
                    <FiRefreshCw className="animate-spin text-primary h-12 w-12 mb-4" />
                    <p className="text-lg">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Order Management</h1>

                <div className="flex space-x-4">
                    {/* Status Filter */}
                    <div>
                        <select
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            className="px-3 py-2 border rounded"
                        >
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Search Box */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={search}
                            onChange={handleSearchChange}
                            className="pl-10 pr-4 py-2 border rounded w-64"
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                        <div>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {orders.length === 0 && !loading ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-500">No orders found matching your criteria.</p>
                </div>
            ) : (
                <div className="overflow-x-auto shadow rounded-lg">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Order Date</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr
                                    key={order._id}
                                    className={order.orderStatus === 'cancelled' ? 'bg-red-50' : (order.orderStatus === 'delivered' ? 'bg-green-50' : '')}
                                >
                                    <td className="font-medium">{order._id}</td>
                                    <td>
                                        <div>{order.user?.name || 'Unknown User'}</div>
                                        <div className="text-xs text-gray-500">{order.user?.email || 'No email'}</div>
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>
                                        <div>{order.items?.length || 0} item(s)</div>
                                        <div className="text-xs text-gray-500 truncate max-w-xs">
                                            {order.items?.map(item => `${item.quantity}x ${item.product?.name || 'Unknown Product'}`).join(', ')}
                                        </div>
                                    </td>
                                    <td className="font-medium">{formatPrice(order.totalAmount)}</td>
                                    <td>
                                        <div className="capitalize">{order.paymentMethod}</div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => openOrderModal(order)}
                                                className="p-1 text-blue-600 hover:text-blue-800"
                                                title="View Details"
                                            >
                                                <FiEye size={18} />
                                            </button>

                                            <button
                                                onClick={() => openOrderModal(order)}
                                                className="p-1 text-green-600 hover:text-green-800"
                                                title="Edit Order"
                                            >
                                                <FiEdit size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <div className="flex">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border rounded-l disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-4 py-2 border-t border-b ${currentPage === i + 1 ? 'bg-primary text-white' : ''
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border rounded-r disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Order Details: {selectedOrder._id}</h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadgeClass(selectedOrder.orderStatus)}`}>
                                {selectedOrder.orderStatus}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Customer Information */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg border-b pb-1">Customer Information</h3>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="text-sm text-gray-500">Name:</div>
                                        <div>{selectedOrder.user?.name || 'Unknown User'}</div>

                                        <div className="text-sm text-gray-500">Email:</div>
                                        <div>{selectedOrder.user?.email || 'No email'}</div>

                                        <div className="text-sm text-gray-500">Phone:</div>
                                        <div>{selectedOrder.user?.phone || 'No phone'}</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg border-b pb-1">Shipping Address</h3>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="text-sm text-gray-500">Address:</div>
                                        <div>{selectedOrder.address?.addressLine1 || 'No address'}</div>

                                        <div className="text-sm text-gray-500">City:</div>
                                        <div>{selectedOrder.address?.city || 'No city'}</div>

                                        <div className="text-sm text-gray-500">State:</div>
                                        <div>{selectedOrder.address?.state || 'No state'}</div>

                                        <div className="text-sm text-gray-500">PIN Code:</div>
                                        <div>{selectedOrder.address?.pinCode || 'No PIN code'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment & Order Information */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg border-b pb-1">Order Information</h3>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="text-sm text-gray-500">Order Date:</div>
                                        <div>{formatDate(selectedOrder.createdAt)}</div>

                                        <div className="text-sm text-gray-500">Last Updated:</div>
                                        <div>{formatDate(selectedOrder.updatedAt)}</div>

                                        <div className="text-sm text-gray-500">Total Amount:</div>
                                        <div className="font-medium">{formatPrice(selectedOrder.totalAmount)}</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg border-b pb-1">Payment Information</h3>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="text-sm text-gray-500">Payment Method:</div>
                                        <div className="capitalize">{selectedOrder.paymentMethod}</div>

                                        <div className="text-sm text-gray-500">Payment Status:</div>
                                        <div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadgeClass(selectedOrder.paymentStatus)}`}>
                                                {selectedOrder.paymentStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div>
                            <h3 className="font-semibold text-lg border-b pb-1 mb-3">Order Items</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2">Product</th>
                                            <th className="px-4 py-2">Price</th>
                                            <th className="px-4 py-2">Quantity</th>
                                            <th className="px-4 py-2 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.items && selectedOrder.items.map((item, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="px-4 py-3">{item.product?.name || 'Unknown Product'}</td>
                                                <td className="px-4 py-3">{formatPrice(item.price)}</td>
                                                <td className="px-4 py-3">{item.quantity}</td>
                                                <td className="px-4 py-3 text-right font-medium">{formatPrice(item.price * item.quantity)}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gray-50">
                                            <td colSpan="3" className="px-4 py-3 font-semibold text-right">Total:</td>
                                            <td className="px-4 py-3 text-right font-semibold">{formatPrice(selectedOrder.totalAmount)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Update Status Section */}
                        <div className="mt-6 border-t pt-4">
                            <div className="flex flex-wrap items-center justify-between">
                                <div>
                                    <h3 className="font-semibold">Update Order Status</h3>
                                </div>
                                <div className="flex space-x-2 mt-2 sm:mt-0">
                                    {selectedOrder.orderStatus !== 'pending' && (
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder._id, 'pending')}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        >
                                            Pending
                                        </button>
                                    )}

                                    {selectedOrder.orderStatus !== 'processing' && (
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder._id, 'processing')}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Processing
                                        </button>
                                    )}

                                    {selectedOrder.orderStatus !== 'shipped' && (
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder._id, 'shipped')}
                                            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                                        >
                                            Shipped
                                        </button>
                                    )}

                                    {selectedOrder.orderStatus !== 'delivered' && (
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder._id, 'delivered')}
                                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Delivered
                                        </button>
                                    )}

                                    {selectedOrder.orderStatus !== 'cancelled' && (
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder._id, 'cancelled')}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Cancelled
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border rounded text-gray-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;