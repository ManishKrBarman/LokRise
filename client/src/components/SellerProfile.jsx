import React from 'react';

const SellerProfile = ({ seller, size = "small" }) => {
    return (
        <div className={`flex ${size === "small" ? "items-center" : "flex-col items-center"}`}>
            <div className={`
        overflow-hidden rounded-full border-2 border-[var(--primary-color)]
        ${size === "small" ? "w-6 h-6 mr-2" : "w-12 h-12 mb-2"}
      `}>
                <img
                    src={seller.avatar || "/api/placeholder/100/100"}
                    alt={seller.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <span className={`
        text-gray-700 truncate
        ${size === "small" ? "text-xs max-w-[60px]" : "text-sm font-medium"}
      `}>
                {seller.name}
            </span>
        </div>
    );
};

export default SellerProfile;