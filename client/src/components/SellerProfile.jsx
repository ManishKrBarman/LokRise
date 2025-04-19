import React, { useState } from 'react';
import { BASE_URL } from '../services/api';

const SellerProfile = ({ seller, size = "small" }) => {
    const [imageTimestamp] = useState(Date.now());
    // Get profile image URL if seller has an ID
    const profileImage = seller._id ? `${BASE_URL}/auth/profile-image/${seller._id}?t=${imageTimestamp}` : null;

    return (
        <div className={`flex ${size === "small" ? "items-center" : "flex-col items-center"}`}>
            <div className={`
                overflow-hidden rounded-full border-2 border-[var(--primary-color)]
                ${size === "small" ? "w-6 h-6 mr-2" : "w-12 h-12 mb-2"}
            `}>
                <img
                    src={profileImage || `https://placehold.co/100?text=${seller.name?.[0]?.toUpperCase() || 'S'}`}
                    alt={seller.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop if placeholder fails
                        e.target.src = `https://placehold.co/100?text=${seller.name?.[0]?.toUpperCase() || 'S'}`;
                    }}
                />
            </div>
            <span className={`
                text-gray-700 truncate
                ${size === "small" ? "text-sm max-w-[80px]" : "text-base font-medium"}
            `}>
                {seller.name}
            </span>
        </div>
    );
};

export default SellerProfile;