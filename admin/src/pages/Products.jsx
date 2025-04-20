import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { FiRefreshCw, FiSearch, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [category, setCategory] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    // Fetch products with pagination
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Use a higher limit to get more products at once
                const response = await adminAPI.getAllProducts({
                    page: currentPage,
                    limit: 50, // Show more products per page
                    search,
                    category: category !== 'all' ? category : undefined
                });

                console.log('Products response:', response.data); // For debugging

                // Use real data from the API response
                if (response.data && response.data.products) {
                    setProducts(response.data.products);
                    // Fix pagination to match server structure
                    if (response.data.pagination) {
                        setTotalPages(response.data.pagination.pages || 1);
                    } else {
                        setTotalPages(1);
                    }
                    setError(null);
                } else {
                    setProducts([]);
                    setTotalPages(1);
                }
            } catch (err) {
                setError('Failed to load products');
                console.error('Products fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, search, category]);

    // Fetch categories for filter dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // You might need to implement this API endpoint
                const response = await adminAPI.getCategories();
                if (response.data && response.data.categories) {
                    setCategories(response.data.categories);
                }
            } catch (err) {
                console.error('Categories fetch error:', err);
                // Fallback to default categories if API fails
                setCategories([
                    { _id: 'electronics', name: 'Electronics' },
                    { _id: 'fashion', name: 'Fashion' },
                    { _id: 'home', name: 'Home' },
                    { _id: 'sports', name: 'Sports' },
                    { _id: 'books', name: 'Books' }
                ]);
            }
        };

        fetchCategories();
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                setLoading(true);
                await adminAPI.deleteProduct(productId);
                // Remove from local state
                setProducts(products.filter(product => product._id !== productId));
            } catch (err) {
                setError('Failed to delete product');
                console.error('Delete product error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleCategoryFilterChange = (e) => {
        setCategory(e.target.value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const openProductModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    if (loading && products.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center">
                    <FiRefreshCw className="animate-spin text-primary h-12 w-12 mb-4" />
                    <p className="text-lg">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Product Management</h1>

                <div className="flex space-x-4">
                    {/* Category Filter */}
                    <div>
                        <select
                            value={category}
                            onChange={handleCategoryFilterChange}
                            className="px-3 py-2 border rounded"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search Box */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={handleSearchChange}
                            className="pl-10 pr-4 py-2 border rounded w-64"
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                        <div>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {products.length === 0 && !loading ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-500">No products found matching your criteria.</p>
                </div>
            ) : (
                <div className="overflow-x-auto shadow rounded-lg">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Category</th>
                                <th>Seller</th>
                                <th>Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id} className={!product.isActive ? 'bg-red-50' : (product.quantityAvailable === 0 ? 'bg-yellow-50' : '')}>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0">
                                                {product.images && product.images.length > 0 && (
                                                    <img
                                                        src={product.images[0].startsWith('http') ? product.images[0] : `/product-images/${product.images[0]}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover rounded"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://placehold.co/100x100?text=No+Image';
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium">{product.name}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="font-medium">{formatPrice(product.price)}</td>
                                    <td>
                                        {product.quantityAvailable > 0 ? (
                                            product.quantityAvailable
                                        ) : (
                                            <span className="text-red-600">Out of stock</span>
                                        )}
                                    </td>
                                    <td className="capitalize">{product.category?.name || product.category}</td>
                                    <td>
                                        <div>{product.seller?.name || 'Unknown Seller'}</div>
                                        <div className="text-xs text-gray-500">Rating: {product.seller?.rating || 'N/A'}</div>
                                    </td>
                                    <td>
                                        {product.isActive ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => openProductModal(product)}
                                                className="p-1 text-blue-600 hover:text-blue-800"
                                                title="View Details"
                                            >
                                                <FiEye size={18} />
                                            </button>

                                            <button
                                                onClick={() => openProductModal(product)}
                                                className="p-1 text-green-600 hover:text-green-800"
                                                title="Edit Product"
                                            >
                                                <FiEdit size={18} />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteProduct(product._id)}
                                                className="p-1 text-red-600 hover:text-red-800"
                                                title="Delete Product"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <div className="flex">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border rounded-l disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-4 py-2 border-t border-b ${currentPage === i + 1 ? 'bg-primary text-white' : ''
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border rounded-r disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Product Modal - Basic version */}
            {isModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">{selectedProduct.name}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Image */}
                            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                    <img
                                        src={selectedProduct.images[0].startsWith('http') ? selectedProduct.images[0] : `/product-images/${selectedProduct.images[0]}`}
                                        alt={selectedProduct.name}
                                        className="h-full object-contain"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/300x300?text=No+Image';
                                        }}
                                    />
                                ) : (
                                    <p className="text-gray-500">No image available</p>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg border-b pb-1">Details</h3>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="text-sm text-gray-500">Price:</div>
                                        <div className="font-medium">{formatPrice(selectedProduct.price)}</div>

                                        <div className="text-sm text-gray-500">Category:</div>
                                        <div className="capitalize">{selectedProduct.category?.name || selectedProduct.category}</div>

                                        <div className="text-sm text-gray-500">Stock:</div>
                                        <div className={selectedProduct.quantityAvailable === 0 ? 'text-red-600' : ''}>
                                            {selectedProduct.quantityAvailable > 0 ? selectedProduct.quantityAvailable : 'Out of stock'}
                                        </div>

                                        <div className="text-sm text-gray-500">Rating:</div>
                                        <div>{selectedProduct.rating || 'N/A'}/5 ({selectedProduct.reviews?.length || 0} reviews)</div>

                                        <div className="text-sm text-gray-500">Status:</div>
                                        <div>
                                            {selectedProduct.isActive ? (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Inactive
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-sm text-gray-500">Seller:</div>
                                        <div>{selectedProduct.seller?.name || 'Unknown Seller'}</div>

                                        <div className="text-sm text-gray-500">Added On:</div>
                                        <div>{formatDate(selectedProduct.createdAt)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-4">
                            <h3 className="font-semibold text-lg border-b pb-1">Description</h3>
                            <p className="mt-2">{selectedProduct.description}</p>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border rounded text-gray-700"
                            >
                                Close
                            </button>
                            <button
                                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                            >
                                Edit Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;