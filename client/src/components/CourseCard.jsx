import React from 'react';
import { FiStar, FiUsers } from 'react-icons/fi';

const CourseCard = ({ course }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition duration-300">
            {/* Course Image */}
            <div className="relative h-40">
                <img
                    // src={course.images && course.images.length > 0 ? course.images[0] : "https://placehold.co/300x200?text=Course+Image"}
                    src={"https://placehold.co/300x200?text=Course+Image"}
                    alt={course.name}
                    className="w-full h-full object-cover"
                />
                {course.courseDetails && course.courseDetails.level && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        {course.courseDetails.level}
                    </div>
                )}
            </div>

            {/* Course Info */}
            <div className="p-4">
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
                                    <span>{course.seller.name ? course.seller.name.charAt(0).toUpperCase() : "I"}</span>
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

                <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold text-[var(--primary-color)]">₹{course.price.toFixed(2)}</span>
                    {course.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            ₹{course.originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseCard;