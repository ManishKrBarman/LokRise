import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiChevronDown, FiX, FiSliders } from 'react-icons/fi';
import { productAPI } from '../services/api';
import Navbar from '../components/NavBar';
import ProductCard from '../components/ProductCard';

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
    const [totalResults, setTotalResults] = useState(0);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
                setTotalResults(productsRes.data.totalProducts || 0);
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

    const clearFilters = () => {
        const newFilters = {
            category: 'all',
            minPrice: '',
            maxPrice: '',
            sort: 'newest',
            page: 1
        };
        setFilters(newFilters);

        // Update URL params
        const params = new URLSearchParams();
        if (query) params.set('q', query);
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

    const toggleMobileFilters = () => {
        setMobileFiltersOpen(!mobileFiltersOpen);
    };

    // Filter sidebar component
    const FilterSidebar = ({ className }) => (
        <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Filters</h2>
                {(filters.category !== 'all' || filters.minPrice || filters.maxPrice) && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        Clear all
                    </button>
                )}
                <button
                    className="md:hidden"
                    onClick={toggleMobileFilters}
                >
                    <FiX size={20} />
                </button>
            </div>

            <div className="space-y-6">
                {/* Category Filter */}
                <div>
                    <h3 className="font-medium mb-2">Categories</h3>
                    <div className="space-y-2">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`category-${cat.id}`}
                                    name="category"
                                    value={cat.id}
                                    checked={filters.category === cat.id}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="h-4 w-4 text-[var(--primary-color)]"
                                />
                                <label htmlFor={`category-${cat.id}`} className="ml-2 text-sm text-gray-700">
                                    {cat.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Filter */}
                <div>
                    <h3 className="font-medium mb-2">Price Range</h3>
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="number"
                                placeholder="₹ Min"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                className="w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)]"
                            />
                            <span>to</span>
                            <input
                                type="number"
                                placeholder="₹ Max"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                className="w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)]"
                            />
                        </div>
                        <button
                            onClick={() => {
                                if (filters.minPrice || filters.maxPrice) {
                                    handleFilterChange('minPrice', filters.minPrice);
                                }
                            }}
                            className="bg-gray-100 hover:bg-gray-200 text-sm py-1 px-2 rounded"
                        >
                            Apply
                        </button>
                    </div>
                </div>

                {/* Sort Order */}
                <div>
                    <h3 className="font-medium mb-2">Sort By</h3>
                    <div className="space-y-2">
                        {sortOptions.map(option => (
                            <div key={option.id} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`sort-${option.id}`}
                                    name="sort"
                                    value={option.id}
                                    checked={filters.sort === option.id}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="h-4 w-4 text-[var(--primary-color)]"
                                />
                                <label htmlFor={`sort-${option.id}`} className="ml-2 text-sm text-gray-700">
                                    {option.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar fixed={true} cartBtn={true} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        {query ? `Search Results for "${query}"` : 'All Products'}
                    </h1>
                    {!results.loading && (
                        <p className="text-gray-600">
                            Found {totalResults} results
                        </p>
                    )}
                </div>

                {/* Mobile Filter Button */}
                <div className="md:hidden mb-4">
                    <button
                        onClick={toggleMobileFilters}
                        className="flex items-center justify-center w-full py-2 bg-white border rounded-md shadow-sm"
                    >
                        <FiSliders className="mr-2" />
                        Filters & Sort
                    </button>
                </div>

                {/* Mobile Filter Sidebar - Slide out */}
                <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 md:hidden ${mobileFiltersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}>
                    <div className={`absolute top-0 right-0 h-full w-3/4 max-w-xs bg-white transition-transform duration-300 transform ${mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'
                        } overflow-y-auto`}>
                        <FilterSidebar className="h-full" />
                    </div>
                </div>

                {/* Main Content Area with Filters and Results */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Desktop Filter Sidebar */}
                    <div className="hidden md:block md:w-64 lg:w-72 flex-shrink-0">
                        <div className="sticky top-24">
                            <FilterSidebar />
                        </div>
                    </div>

                    {/* Results Area */}
                    <div className="flex-1">
                        {results.error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                <p className="text-red-700">{results.error}</p>
                            </div>
                        )}

                        {results.loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                                    {results.products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
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
                                            {totalPages <= 5 ? (
                                                [...Array(totalPages)].map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handlePageChange(i + 1)}
                                                        className={`px-4 py-2 rounded-lg ${filters.page === i + 1
                                                            ? 'bg-[var(--primary-color)] text-white'
                                                            : 'border hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))
                                            ) : (
                                                // Show limited pagination numbers with ellipsis
                                                <>
                                                    <button
                                                        onClick={() => handlePageChange(1)}
                                                        className={`px-4 py-2 rounded-lg ${filters.page === 1
                                                            ? 'bg-[var(--primary-color)] text-white'
                                                            : 'border hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        1
                                                    </button>

                                                    {filters.page > 3 && <span className="self-center">...</span>}

                                                    {filters.page !== 1 && filters.page !== totalPages && (
                                                        <button
                                                            className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg"
                                                        >
                                                            {filters.page}
                                                        </button>
                                                    )}

                                                    {filters.page < totalPages - 2 && <span className="self-center">...</span>}

                                                    <button
                                                        onClick={() => handlePageChange(totalPages)}
                                                        className={`px-4 py-2 rounded-lg ${filters.page === totalPages
                                                            ? 'bg-[var(--primary-color)] text-white'
                                                            : 'border hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {totalPages}
                                                    </button>
                                                </>
                                            )}
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
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                <p className="text-gray-600 text-lg font-medium">No results found</p>
                                <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                                {(filters.category !== 'all' || filters.minPrice || filters.maxPrice) && (
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 text-[var(--primary-color)] hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;