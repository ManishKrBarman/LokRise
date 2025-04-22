import React, { useState } from 'react';
import { FiStar, FiShoppingCart, FiHeart, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [loading, setLoading] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [error, setError] = useState(null);

    const isWishlisted = isInWishlist(product._id);

    const handleWishlistClick = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { returnUrl: window.location.pathname } });
            return;
        }

        setLoading(true);
        try {
            if (isWishlisted) {
                await removeFromWishlist(product._id);
            } else {
                await addToWishlist(product._id);
            }
        } catch (error) {
            console.error('Wishlist operation failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { returnUrl: window.location.pathname } });
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await addToCart(product, 1);
            if (result.success) {
                // Show success state temporarily
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 2000);
            } else {
                setError(result.error || 'Failed to add to cart');
            }
        } catch (error) {
            console.error('Add to cart failed:', error);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = () => {
        navigate(`/product/${product._id}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-md flex flex-col border border-gray-100 hover:shadow-lg transition duration-300">
            {/* Product Image */}
            <div
                className="relative h-[180px] cursor-pointer"
                onClick={handleProductClick}
            >
                <img
                    // src={product.images?.[0]}
                    // src={"https://placehold.co/600x400?text=Product"} // Placeholder image for demo
                    src={product.images?.[0] || "https://placehold.co/600x400?text=Product+Image"}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-lg"
                />
                {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {product.discount}% OFF
                    </div>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistClick();
                    }}
                    disabled={loading}
                    className={`absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-md 
                        ${isWishlisted ? 'text-red-500' : 'text-gray-400'} 
                        hover:text-red-500 transition-colors`}
                >
                    <FiHeart size={16} className={isWishlisted ? 'fill-current' : ''} />
                </button>
            </div>

            {/* Product Info */}
            <div className="p-3 flex flex-col flex-grow">
                <div
                    className="mb-1 flex justify-between items-start cursor-pointer"
                    onClick={handleProductClick}
                >
                    <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
                    <div className="flex items-center text-sm">
                        <FiStar className="text-yellow-400" size={14} />
                        <span className="ml-1">{product.rating}</span>
                    </div>
                </div>

                <div className="text-sm text-gray-500 mb-2">
                    {product.seller.name}
                </div>

                <div className="mt-auto">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-baseline gap-2">
                            <span className="font-semibold">₹{product.price}</span>
                            {product.discount > 0 && (
                                <span className="text-sm text-gray-400 line-through">
                                    ₹{(product.price / (1 - product.discount / 100)).toFixed(2)}
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-gray-500">{product.reviews} reviews</span>
                    </div>

                    {error && (
                        <div className="text-xs text-red-500 mb-1">{error}</div>
                    )}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart();
                        }}
                        disabled={loading || product.quantityAvailable === 0 || addedToCart}
                        className={`w-full py-1.5 rounded-md flex items-center justify-center transition duration-300 text-sm
                            ${product.quantityAvailable === 0
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : addedToCart
                                    ? 'bg-green-600 text-white'
                                    : 'bg-amber-900 hover:bg-orange-500 text-white'}`}
                    >
                        {addedToCart ? (
                            <>
                                <FiCheck className="mr-1" size={14} />
                                Added to Cart
                            </>
                        ) : (
                            <>
                                <FiShoppingCart className="mr-1" size={14} />
                                {product.quantityAvailable === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;