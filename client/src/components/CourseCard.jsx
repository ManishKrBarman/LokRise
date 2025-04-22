import React, { useState } from 'react';
import { FiStar, FiUsers, FiShoppingCart, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();

    const [loading, setLoading] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [error, setError] = useState(null);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { returnUrl: window.location.pathname } });
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await addToCart(course, 1); // Quantity 1
            if (result.success) {
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 2000);
            } else {
                setError(result.error || 'Failed to add to cart');
            }
        } catch (err) {
            console.error('Error adding course to cart:', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition duration-300">
            {/* Course Image */}
            <div className="relative h-40">
                <img
                    src={course.images?.[0] || "https://placehold.co/300x200?text=Course+Image"}
                    alt={course.name}
                    className="w-full h-full object-cover"
                />
                {course.courseDetails?.level && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        {course.courseDetails.level}
                    </div>
                )}
            </div>

            {/* Course Info */}
            <div className="p-4 flex flex-col">
                <div className="mb-2 flex justify-between items-start">
                    <h3 className="font-medium text-gray-800 line-clamp-2 font-museo">{course.name}</h3>
                    {course.seller && (
                        <div className="flex items-center text-xs">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-1">
                                {course.seller.profileImage ? (
                                    <img
                                        src={course.seller.profileImage}
                                        alt={course.seller.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>{course.seller.name?.charAt(0).toUpperCase() || "I"}</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center text-sm mb-2">
                    <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                            <FiStar
                                key={i}
                                className={i < Math.floor(course.rating || 0) ? "fill-current" : ""}
                                size={14}
                            />
                        ))}
                    </div>
                    <span className="text-gray-500">({course.reviewCount || 0})</span>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                    <FiUsers className="mr-1" />
                    <span>{course.purchaseCount || 0} students</span>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                    <span className="text-lg font-bold text-[var(--primary-color)]">₹{course.price.toFixed(2)}</span>
                    {course.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            ₹{course.originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Error Message */}
                {error && <div className="text-xs text-red-500 mb-1">{error}</div>}

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={loading || addedToCart}
                    className={`w-full py-1.5 rounded-md flex items-center justify-center transition duration-300 text-sm
                        ${addedToCart
                            ? 'bg-green-600 text-white'
                            : 'bg-indigo-700 hover:bg-blue-900 text-white'}`}
                >
                    {addedToCart ? (
                        <>
                            <FiCheck className="mr-1" size={14} />
                            Added to Cart
                        </>
                    ) : (
                        <>
                            <FiShoppingCart className="mr-1" size={14} />
                            Add to Cart
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default CourseCard;