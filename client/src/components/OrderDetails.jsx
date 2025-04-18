import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';

const OrderDetails = ({ order, onBack }) => {
    // Helper function to get status badge styling
    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

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
                <h2 className="text-lg font-medium">Order Details: #{order.id}</h2>
            </div>

            <div className="p-6">
                {/* Order summary */}
                <div className="mb-8">
                    <div className="flex flex-wrap justify-between mb-4">
                        <div className="mb-2">
                            <p className="text-sm text-gray-500">Order Placed</p>
                            <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className="mb-2">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="font-medium">${order.total.toFixed(2)}</p>
                        </div>
                        <div className="mb-2">
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Shipping info */}
                        <div>
                            <h3 className="font-medium mb-2">Shipping Information</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="font-medium">{order.shippingAddress.name}</p>
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        </div>

                        {/* Payment info */}
                        <div>
                            <h3 className="font-medium mb-2">Payment Method</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p>{order.paymentMethod}</p>
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
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-md object-cover" src={item.image} alt={item.name} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {item.type === 'course' ? 'Online Course' : 'Physical Product'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${item.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;