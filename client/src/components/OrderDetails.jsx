import React, { useState } from 'react';
import { FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import api from '../services/api';

const OrderDetails = ({ order, onBack, currentUser, refreshOrder }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Helper function to get status badge styling
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
            case 'awaiting_barter_approval':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Format date helper function
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Check if current user is the seller
    const isSeller = currentUser && order && currentUser._id === order.seller._id;
    
    // Check if order has a barter proposal
    const hasBarterProposal = order?.paymentMethod === 'BARTER' && 
        order?.paymentDetails?.barterProposal;

    // Handle barter acceptance
    const handleAcceptBarter = async () => {
        try {
            setIsProcessing(true);
            setError('');
            
            // Call API to accept barter
            const response = await api.post(`/orders/${order._id}/accept-barter`, {
                status: 'confirmed',
                description: 'Barter proposal accepted by seller'
            });
            
            if (response.data && response.data.success) {
                setSuccess('Barter proposal accepted successfully');
                // Refresh order data to show updated status
                if (refreshOrder) refreshOrder();
            } else {
                setError('Failed to accept barter proposal');
            }
        } catch (err) {
            console.error('Error accepting barter:', err);
            setError(err.response?.data?.message || 'Failed to process barter acceptance');
        } finally {
            setIsProcessing(false);
        }
    };
    
    // Handle barter rejection
    const handleRejectBarter = async () => {
        try {
            setIsProcessing(true);
            setError('');
            
            // Call API to reject barter
            const response = await api.post(`/orders/${order._id}/reject-barter`, {
                status: 'cancelled',
                description: 'Barter proposal rejected by seller'
            });
            
            if (response.data && response.data.success) {
                setSuccess('Barter proposal rejected');
                // Refresh order data to show updated status
                if (refreshOrder) refreshOrder();
            } else {
                setError('Failed to reject barter proposal');
            }
        } catch (err) {
            console.error('Error rejecting barter:', err);
            setError(err.response?.data?.message || 'Failed to process barter rejection');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!order) {
        return <div className="p-4">Order not found or loading...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header with back button */}
            <div className="border-b border-gray-200 bg-gray-50 py-4 px-6 flex items-center">
                <button
                    onClick={onBack}
                    className="mr-4 text-gray-600 hover:text-[var(--primary-color)]"
                >
                    <FiArrowLeft size={20} />
                </button>
                <h2 className="text-lg font-medium">Order Details: #{order.orderNumber || order._id?.substring(0, 8)}</h2>
            </div>

            {/* Status messages */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 my-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}
            
            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mx-6 my-4">
                    <p className="text-green-700">{success}</p>
                </div>
            )}

            <div className="p-6">
                {/* Order summary */}
                <div className="mb-8">
                    <div className="flex flex-wrap justify-between mb-4">
                        <div className="mb-2">
                            <p className="text-sm text-gray-500">Order Placed</p>
                            <p className="font-medium">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="mb-2">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="font-medium">₹{order.totalAmount?.toFixed(2)}</p>
                        </div>
                        <div className="mb-2">
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                            </span>
                        </div>
                    </div>

                    {/* Barter Proposal Section - Only show if this is a barter order */}
                    {hasBarterProposal && (
                        <div className="mb-6 border rounded-lg p-4 bg-purple-50">
                            <h3 className="font-medium mb-3 text-purple-900">Barter Proposal</h3>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Offered Item</h4>
                                    <div className="bg-white p-3 rounded-md shadow-sm">
                                        <p className="font-medium">{order.paymentDetails.barterProposal.item.title}</p>
                                        <p className="text-sm text-gray-600 mb-1">Category: {order.paymentDetails.barterProposal.item.category}</p>
                                        <p className="text-sm text-gray-600 mb-2">{order.paymentDetails.barterProposal.item.description}</p>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Estimated Value:</span>
                                            <span>₹{order.paymentDetails.barterProposal.item.estimatedValue?.toFixed(2)}</span>
                                        </div>
                                        {order.paymentDetails.barterProposal.item.topUpAmount > 0 && (
                                            <div className="flex justify-between mt-1">
                                                <span className="text-sm font-medium">Additional Money:</span>
                                                <span>₹{order.paymentDetails.barterProposal.item.topUpAmount?.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between mt-1">
                                            <span className="text-sm font-medium">Total Value:</span>
                                            <span className="font-bold">₹{(
                                                order.paymentDetails.barterProposal.item.estimatedValue +
                                                (order.paymentDetails.barterProposal.item.topUpAmount || 0)
                                            )?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Item photos if available */}
                                {order.paymentDetails.barterProposal.item.photos && 
                                    order.paymentDetails.barterProposal.item.photos.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-1">Item Photos</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {order.paymentDetails.barterProposal.item.photos.map((photo, index) => (
                                                <div key={index} className="w-20 h-20">
                                                    <img 
                                                        src={photo} 
                                                        alt={`Barter item ${index + 1}`}
                                                        className="w-full h-full object-cover rounded-md"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Seller Actions - Only show if current user is the seller and order is awaiting approval */}
                            {isSeller && order.status === 'awaiting_barter_approval' && (
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <button 
                                        onClick={handleAcceptBarter}
                                        disabled={isProcessing}
                                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                    >
                                        <FiCheck className="mr-2" /> 
                                        {isProcessing ? 'Processing...' : 'Accept Barter'}
                                    </button>
                                    <button 
                                        onClick={handleRejectBarter}
                                        disabled={isProcessing}
                                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                                    >
                                        <FiX className="mr-2" /> 
                                        {isProcessing ? 'Processing...' : 'Reject Barter'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Shipping info */}
                        <div>
                            <h3 className="font-medium mb-2">Shipping Information</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="font-medium">{order.shippingAddress?.name || 'N/A'}</p>
                                <p>{order.shippingAddress?.addressLine1}</p>
                                {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.pinCode}</p>
                                <p>{order.shippingAddress?.state}, {order.shippingAddress?.country || 'India'}</p>
                            </div>
                        </div>

                        {/* Payment info */}
                        <div>
                            <h3 className="font-medium mb-2">Payment Method</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p>{order.paymentMethod === 'BARTER' ? 'Barter Exchange' : order.paymentMethod || 'Not specified'}</p>
                                {order.paymentDetails && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Status: {order.paymentDetails.paymentStatus || 'Unknown'}
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
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item, index) => (
                                        <tr key={item._id || index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img 
                                                            className="h-10 w-10 rounded-md object-cover" 
                                                            src={item.productImage || (item.product && item.product.images && item.product.images[0]) || 'https://via.placeholder.com/100'} 
                                                            alt={item.productName || item.name || 'Product Image'} 
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.productName || item.name || (item.product && item.product.name) || 'Unknown Product'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {item.productType === 'course' ? 'Online Course' : 'Physical Product'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ₹{(item.price || 0).toFixed(2)}
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
                {order.statusHistory && order.statusHistory.length > 0 && (
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
                                    {order.statusHistory.map((status, index) => (
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
            </div>
        </div>
    );
};

export default OrderDetails;