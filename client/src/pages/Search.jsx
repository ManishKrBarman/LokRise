import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiChevronDown } from 'react-icons/fi';
import { productAPI } from '../services/api';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const [results, setResults] = useState({
        products: [],
        courses: [],
        loading: true,
        error: null
    });

    const [filters, setFilters] = useState({
        category: searchParams.get('category') || 'all',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || 'newest',
        page: parseInt(searchParams.get('page')) || 1
    });

    const [showFilters, setShowFilters] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query && filters.category === 'all') return;

            try {
                setResults(prev => ({ ...prev, loading: true, error: null }));
                
                // Fetch products with all filters
                const productsRes = await productAPI.searchProducts({
                    query,
                    category: filters.category === 'all' ? undefined : filters.category,
                    minPrice: filters.minPrice || undefined,
                    maxPrice: filters.maxPrice || undefined,
                    sort: filters.sort,
                    page: filters.page,
                    limit: 12
                });
                
                setResults({
                    products: productsRes.data.products || [],
                    courses: [], // Will be implemented when course search is ready
                    loading: false,
                    error: null
                });
                setTotalPages(productsRes.data.totalPages || 1);
            } catch (error) {
                setResults(prev => ({
                    ...prev,
                    loading: false,
                    error: 'Failed to fetch search results'
                }));
            }
        };

        fetchResults();
    }, [query, filters]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        setFilters(newFilters);
        
        // Update URL params
        const params = new URLSearchParams(searchParams);
        params.set(key, value);
        params.set('page', '1');
        setSearchParams(params);
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        setSearchParams(params);
    };

    const categories = [
        { id: 'all', name: 'All Categories' },
        { id: 'electronics', name: 'Electronics' },
        { id: 'fashion', name: 'Fashion' },
        { id: 'home', name: 'Home & Living' },
        { id: 'books', name: 'Books' },
        { id: 'sports', name: 'Sports & Outdoor' },
        { id: 'beauty', name: 'Beauty & Personal Care' }
    ];

    const sortOptions = [
        { id: 'newest', name: 'Newest First' },
        { id: 'price-asc', name: 'Price: Low to High' },
        { id: 'price-desc', name: 'Price: High to Low' },
        { id: 'popularity', name: 'Most Popular' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar fixed={true} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        {query ? `Search Results for "${query}"` : 'All Products'}
                    </h1>
                    {!results.loading && (
                        <p className="text-gray-600">
                            Found {results.products.length} results
                        </p>
                    )}
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full md:w-48 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 flex gap-4">
                            <input
                                type="number"
                                placeholder="Min Price"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                className="w-full md:w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                            />
                            <input
                                type="number"
                                placeholder="Max Price"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                className="w-full md:w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                            />
                        </div>

                        <div className="flex-1">
                            <select
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="w-full md:w-48 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {results.error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <p className="text-red-700">{results.error}</p>
                    </div>
                )}

                {results.loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : results.products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {results.products.map((product) => (
                                <div key={product._id} className="bg-white rounded-lg shadow-md p-4">
                                    <img
                                        src={product.images[0] || 'placeholder.jpg'}
                                        alt={product.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <h3 className="font-semibold text-gray-800 mb-2">
                                        {product.name}
                                    </h3>
                                    <div className="flex justify-between items-center">
                                        <p className="text-[var(--primary-color)] font-bold">
                                            ₹{product.price}
                                        </p>
                                        {product.quantityAvailable === 0 && (
                                            <span className="text-red-600 text-sm">Out of Stock</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                                        disabled={filters.page === 1}
                                        className="px-4 py-2 border rounded-lg disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`px-4 py-2 rounded-lg ${
                                                filters.page === i + 1
                                                    ? 'bg-[var(--primary-color)] text-white'
                                                    : 'border hover:bg-gray-50'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(Math.min(totalPages, filters.page + 1))}
                                        disabled={filters.page === totalPages}
                                        className="px-4 py-2 border rounded-lg disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No results found</p>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Search;