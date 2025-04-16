import React from 'react';
import { FiStar, FiUsers } from 'react-icons/fi';
import SellerProfile from './SellerProfile';

const CourseCard = ({ course }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition duration-300">
            {/* Course Image */}
            <div className="relative h-40">
                <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                />
                {course.level && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        {course.level}
                    </div>
                )}
            </div>

            {/* Course Info */}
            <div className="p-4">
                <div className="mb-2 flex justify-between items-start">
                    <h3 className="font-medium text-gray-800 line-clamp-2 font-museo">{course.title}</h3>
                    <SellerProfile seller={course.instructor} size="small" />
                </div>

                <div className="flex items-center text-sm mb-2">
                    <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                            <FiStar
                                key={i}
                                className={i < Math.floor(course.rating) ? "fill-current" : ""}
                                size={14}
                            />
                        ))}
                    </div>
                    <span className="text-gray-500">({course.reviewCount})</span>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                    <FiUsers className="mr-1" />
                    <span>{course.studentsCount} students</span>
                </div>

                <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold text-[var(--primary-color)]">${course.price.toFixed(2)}</span>
                    {course.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            ${course.originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseCard;