import React from 'react';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';

const WishlistItems = ({ items, removeItem, moveToCart }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-48 object-cover"
                        />
                        {!item.inStock && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs py-1 px-2 rounded">
                                Out of Stock
                            </div>
                        )}
                    </div>

                    <div className="p-4">
                        <h3 className="font-medium text-lg mb-2">{item.name}</h3>
                        <p className="text-gray-600 mb-2 text-sm">
                            Type: {item.type === 'course' ? 'Online Course' : 'Physical Product'}
                        </p>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">${item.price.toFixed(2)}</span>
                            <div className="space-x-2">
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="p-2 text-gray-500 hover:text-red-500"
                                    aria-label="Remove from wishlist"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                                <button
                                    onClick={() => moveToCart(item.id)}
                                    className={`p-2 ${item.inStock ? 'text-gray-500 hover:text-[var(--primary-color)]' : 'text-gray-300 cursor-not-allowed'}`}
                                    disabled={!item.inStock}
                                    aria-label="Add to cart"
                                >
                                    <FiShoppingCart size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-3 bg-gray-50">
                        <button
                            onClick={() => moveToCart(item.id)}
                            disabled={!item.inStock}
                            className={`w-full py-2 rounded-md text-center text-sm ${item.inStock
                                    ? 'bg-[var(--primary-color)] text-white hover:bg-opacity-90'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {item.inStock ? 'Move to Cart' : 'Currently Unavailable'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WishlistItems;