import React from 'react';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import SellerProfile from './SellerProfile';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-gray-100 hover:shadow-lg transition duration-300 max-h-80">
            {/* Product Image */}
            <div className="relative h-48">
                <img
                    // src={product.imageUrl}
                    src="https://placehold.co/300x200?text=Product+Image"
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
                {product.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {product.discount}% OFF
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4 flex-grow flex flex-col">
                <div className="mb-2 flex justify-between items-start">
                    <h3 className="font-medium text-gray-800 line-clamp-2 font-museo">{product.name}</h3>
                    <SellerProfile seller={product.seller} size="small" />
                </div>

                <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <FiStar
                                key={i}
                                className={i < Math.floor(product.rating) ? "fill-current" : ""}
                                size={14}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                </div>

                <div className="mt-auto">
                    <div className="flex items-baseline mb-2">
                        <span className="text-lg font-bold text-[var(--primary-color)]">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                                ${product.originalPrice.toFixed(2)}
                            </span>
                        )}
                    </div>

                    <button className="w-full bg-[var(--secondary-color)] hover:bg-green-600 text-white py-2 rounded-md flex items-center justify-center transition duration-300">
                        <FiShoppingCart className="mr-2" size={16} />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;