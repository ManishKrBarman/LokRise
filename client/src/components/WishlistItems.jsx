import React from 'react';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const WishlistItems = ({ items, removeItem }) => {
    const { addToCart } = useCart();

    const handleMoveToCart = async (item) => {
        try {
            // Add to cart
            const result = await addToCart(item.product, 1);
            if (result.success) {
                // If successfully added to cart, remove from wishlist
                removeItem(item.product._id);
            }
        } catch (error) {
            console.error('Error moving item to cart:', error);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
                <div key={item.product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative">
                        <img
                            src={item.product.images?.[0] || '/placeholder-image.jpg'}
                            alt={item.product.name}
                            className="w-full h-48 object-cover"
                        />
                        {item.product.quantityAvailable === 0 && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs py-1 px-2 rounded">
                                Out of Stock
                            </div>
                        )}
                    </div>

                    <div className="p-4">
                        <h3 className="font-medium text-lg mb-2">{item.product.name}</h3>
                        <p className="text-gray-600 mb-2 text-sm">
                            Type: {item.product.type === 'course' ? 'Online Course' : 'Physical Product'}
                        </p>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">₹{item.product.price.toFixed(2)}</span>
                            <div className="space-x-2">
                                <button
                                    onClick={() => removeItem(item.product._id)}
                                    className="p-2 text-gray-500 hover:text-red-500"
                                    aria-label="Remove from wishlist"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleMoveToCart(item)}
                                    className={`p-2 ${item.product.quantityAvailable > 0 ? 'text-gray-500 hover:text-[var(--primary-color)]' : 'text-gray-300 cursor-not-allowed'}`}
                                    disabled={item.product.quantityAvailable === 0}
                                    aria-label="Add to cart"
                                >
                                    <FiShoppingCart size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-3 bg-gray-50">
                        <button
                            onClick={() => handleMoveToCart(item)}
                            disabled={item.product.quantityAvailable === 0}
                            className={`w-full py-2 rounded-md text-center text-sm ${
                                item.product.quantityAvailable === undefined
                                    ? 'bg-[var(--primary-color)] text-white hover:bg-opacity-90'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {item.product.quantityAvailable === undefined ? 'Move to Cart' : 'Currently Unavailable'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WishlistItems;