import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { productAPI } from '../services/api';

const ProductsSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Following the same pattern as Search.jsx, use productAPI.getProducts
                const response = await productAPI.getProducts({
                    limit: 8, // Show 8 products
                    sort: 'popularity' // Sort by popularity
                });

                // Check if response.data.products exists (similar to Search.jsx)
                if (response.data && response.data.products) {
                    setProducts(response.data.products);
                } else {
                    setProducts([]);
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 font-museo">Popular Products</h2>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Products Grid */}
                    <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            // Show skeleton loaders while loading
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))
                        ) : error ? (
                            <div className="col-span-full text-center text-red-500">{error}</div>
                        ) : products.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500">No products available</div>
                        ) : (
                            products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductsSection;