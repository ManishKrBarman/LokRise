import React from 'react';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

const CartItemList = ({ items, removeItem, updateQuantity }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Items ({items.length})</h2>

            <div className="divide-y divide-gray-200">
                {items.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 mb-4 sm:mb-0">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-md"
                            />
                        </div>

                        <div className="flex-grow sm:ml-6">
                            <div className="flex justify-between mb-2">
                                <h3 className="font-medium">{item.name}</h3>
                                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>

                            <div className="text-sm text-gray-500 mb-3">
                                Type: {item.type === 'course' ? 'Online Course' : 'Physical Product'}
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                                    >
                                        <FiMinus size={16} />
                                    </button>

                                    <span className="mx-3 w-6 text-center">{item.quantity}</span>

                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                                    >
                                        <FiPlus size={16} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="flex items-center text-red-500 hover:text-red-700"
                                >
                                    <FiTrash2 size={16} className="mr-1" />
                                    <span>Remove</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CartItemList;