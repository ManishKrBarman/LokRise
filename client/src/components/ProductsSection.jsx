import React from 'react';
import ProductCard from './ProductCard';

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
            avatar: "https://placehold.co/10?text=T",
            followers: 12500,
            rating: 4.9,
            category: "Electronics"
        },
        {
            id: 2,
            name: "FashionHub",
            avatar: "https://placehold.co/10?text=F",
            followers: 9800,
            rating: 4.7,
            category: "Fashion"
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


                </div>
            </div>
        </section>
    );
};

export default ProductsSection;