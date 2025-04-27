import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingCart, FiFilter, FiSearch, FiChevronRight, FiCalendar } from 'react-icons/fi';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import OrdersList from '../components/OrdersList';
import OrderDetails from '../components/OrderDetails';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [sortBy, setSortBy] = useState('date-desc');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated, statusFilter, page, searchQuery, sortBy, dateRange]);

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
            
            const response = await orderAPI.getBuyerOrders(queryParams);
            
            if (response.data && response.data.orders) {
                setOrders(response.data.orders);
                setTotalPages(response.data.totalPages || 1);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load your orders. Please try again.');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const viewOrderDetails = (orderId) => {
        const order = orders.find(o => o._id === orderId);
        setSelectedOrder(order);
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null);
    };
    
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setPage(1);
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

    // Format date helper function
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get status badge class
    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
            case 'confirmed':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
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

    return (
        <>
            <NavBar fixed={true} cartBtn={true} />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>

                {isAuthenticated ? (
                    <>
                        {/* Filter Controls */}
                        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
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
                                            </select>
                                            
                                            <button 
                                                onClick={toggleFilterPanel}
                                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]"
                                            >
                                                <FiFilter className="mr-2" />
                                                Filters
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {renderFilterPanel()}
                            </div>

                            <div className="p-6">
                                {selectedOrder ? (
                                    <OrderDetails
                                        order={selectedOrder}
                                        onBack={closeOrderDetails}
                                    />
                                ) : (
                                    <>
                                        {loading ? (
                                            <div className="flex items-center justify-center h-64">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-color)]"></div>
                                            </div>
                                        ) : error ? (
                                            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                                                <div className="flex">
                                                    <div className="ml-3">
                                                        <p className="text-sm text-red-700">{error}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : orders.length > 0 ? (
                                            <div>
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Order Info
                                                                </th>
                                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Items
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
                                                                        <div className="text-xs text-gray-500 mt-1">
                                                                            Seller: {order.seller?.name || 'Unknown'}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="text-sm text-gray-900">
                                                                            {order.items?.length || 0} item(s)
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 truncate max-w-xs">
                                                                            {(order.items || []).map((item, i) => (
                                                                                <span key={i} className="inline-block mr-1">
                                                                                    {i > 0 ? ', ' : ''}{item.quantity}x {item.productName || ''}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="text-sm font-medium text-gray-900">
                                                                            ₹{order.totalAmount?.toFixed(2)}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">
                                                                            {order.paymentMethod}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                                                                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                                                        </span>
                                                                        {order.statusHistory && order.statusHistory.length > 1 && (
                                                                            <div className="text-xs text-gray-500 mt-1">
                                                                                Updated {formatDate(order.statusHistory[order.statusHistory.length - 1].date)}
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <button 
                                                                            onClick={() => viewOrderDetails(order._id)}
                                                                            className="text-[var(--primary-color)] hover:text-opacity-80 flex items-center text-sm"
                                                                        >
                                                                            View Details
                                                                            <FiChevronRight className="ml-1" size={16} />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                
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
                                        ) : (
                                            <div className="text-center py-12">
                                                <FiPackage className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                                <h2 className="text-xl font-medium text-gray-900 mb-2">No orders found</h2>
                                                <p className="text-gray-500 max-w-md mx-auto mb-6">
                                                    {searchQuery 
                                                        ? `No results found for "${searchQuery}". Try a different search term.`
                                                        : statusFilter !== 'all' 
                                                            ? `You don't have any ${statusFilter} orders at the moment.` 
                                                            : dateRange.startDate || dateRange.endDate
                                                                ? `No orders found in the selected date range.`
                                                                : 'You haven\'t placed any orders yet.'}
                                                </p>
                                                {(searchQuery || statusFilter !== 'all' || dateRange.startDate || dateRange.endDate) ? (
                                                    <button
                                                        onClick={clearFilters}
                                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                                    >
                                                        Clear Filters
                                                    </button>
                                                ) : (
                                                    <Link
                                                        to="/"
                                                        className="inline-flex items-center px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-opacity-90"
                                                    >
                                                        <FiShoppingCart className="mr-2" />
                                                        Browse Products
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Please log in to view your orders</h2>
                        <p className="text-gray-600 mb-8">You need to be logged in to view your order history.</p>
                        <Link
                            to="/login?returnTo=/orders"
                            className="bg-[var(--primary-color)] text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-300"
                        >
                            Log In
                        </Link>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Orders;