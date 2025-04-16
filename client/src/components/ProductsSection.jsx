import React from 'react';
import ProductCard from './ProductCard';
import SellerProfile from './SellerProfile';

const ProductsSection = () => {
    // Sample product data
    const products = [
        {
            id: 1,
            name: "Premium Wireless Headphones",
            price: 159.99,
            originalPrice: 199.99,
            discount: 20,
            rating: 4.8,
            reviewCount: 342,
            imageUrl: "/api/placeholder/300/200",
            seller: { name: "AudioGear", avatar: "/api/placeholder/40/40" }
        },
        {
            id: 2,
            name: "Handcrafted Leather Wallet",
            price: 49.99,
            rating: 4.5,
            reviewCount: 187,
            imageUrl: "/api/placeholder/300/200",
            seller: { name: "LeatherCraft", avatar: "/api/placeholder/40/40" }
        },
        {
            id: 3,
            name: "Organic Cotton T-Shirt",
            price: 24.99,
            originalPrice: 34.99,
            discount: 28,
            rating: 4.3,
            reviewCount: 256,
            imageUrl: "/api/placeholder/300/200",
            seller: { name: "EcoClothing", avatar: "/api/placeholder/40/40" }
        },
        {
            id: 4,
            name: "Smart Home Security Camera",
            price: 129.99,
            rating: 4.7,
            reviewCount: 132,
            imageUrl: "/api/placeholder/300/200",
            seller: { name: "TechSmart", avatar: "/api/placeholder/40/40" }
        }
    ];

    // Sample famous sellers
    const famousSellers = [
        {
            id: 1,
            name: "TechSmart",
            avatar: "/api/placeholder/80/80",
            followers: 12500,
            rating: 4.9,
            category: "Electronics"
        },
        {
            id: 2,
            name: "FashionHub",
            avatar: "/api/placeholder/80/80",
            followers: 9800,
            rating: 4.7,
            category: "Fashion"
        },
        {
            id: 3,
            name: "HomeDecorPlus",
            avatar: "/api/placeholder/80/80",
            followers: 7300,
            rating: 4.8,
            category: "Home & Living"
        }
    ];

    return (
        <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 font-museo">Popular Products</h2>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Products Grid */}
                    <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Famous Sellers */}
                    <div className="md:w-64 lg:w-72">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-bold text-gray-800 mb-4 font-museo">Top Sellers</h3>

                            <div className="space-y-4">
                                {famousSellers.map(seller => (
                                    <div key={seller.id} className="bg-white p-3 rounded-lg shadow-sm">
                                        <div className="flex items-center mb-2">
                                            <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                                                <img
                                                    src={seller.avatar}
                                                    alt={seller.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">{seller.name}</h4>
                                                <p className="text-sm text-gray-500">{seller.category}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">{seller.followers.toLocaleString()} followers</span>
                                            <span className="flex items-center text-yellow-500">
                                                {seller.rating} <span className="ml-1">★</span>
                                            </span>
                                        </div>

                                        <button className="mt-2 w-full bg-[var(--tertiary-color)] hover:bg-[#7980b8] text-white text-sm py-1.5 rounded-md transition duration-300">
                                            Visit Store
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <a href="/sellers" className="block text-center text-[var(--primary-color)] hover:underline mt-4 text-sm font-medium">
                                View All Sellers
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductsSection;