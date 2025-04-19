import React, { useState } from 'react';
import { BASE_URL } from '../services/api';

const SellerProfile = ({ seller, size = "small" }) => {
    const getProfileImageUrl = (userId) => {
        if (!userId) return null;
        return `${BASE_URL}/auth/profile-image/${userId}?t=${Date.now()}`;
    };

    const [imageError, setImageError] = useState(false);
    const profileImage = !imageError && seller._id ? getProfileImageUrl(seller._id) : null;

    return (
        <div className={`flex ${size === "small" ? "items-center" : "flex-col items-center"}`}>
            <div className={`
                overflow-hidden rounded-full border-2 border-[var(--primary-color)]
                ${size === "small" ? "w-6 h-6 mr-2" : "w-12 h-12 mb-2"}
            `}>
                <img
                    src={profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.name?.[0] || 'S')}&background=8B6B4B&color=fff`}
                    alt={seller.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        setImageError(true);
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.name?.[0] || 'S')}&background=8B6B4B&color=fff`;
                    }}
                />
            </div>
            {size !== "small" && (
                <div className="text-center">
                    <h3 className="font-medium text-gray-900">{seller.name}</h3>
                    {seller.businessName && (
                        <p className="text-sm text-gray-500">{seller.businessName}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SellerProfile;