import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

const OrdersList = ({ orders, viewOrderDetails }) => {
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
            <div className="border-b border-gray-200 bg-gray-50 py-4 px-6">
                <h2 className="text-lg font-medium">Order History</h2>
            </div>

            <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-medium">Order #{order.id}</h3>
                                <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm">
                                <span className="font-medium">Total:</span> ${order.total.toFixed(2)}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Items:</span> {order.items.length}
                            </p>
                        </div>

                        <button
                            onClick={() => viewOrderDetails(order.id)}
                            className="flex items-center text-sm text-[var(--primary-color)] hover:underline"
                        >
                            View Order Details
                            <FiChevronRight className="ml-1" size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersList;