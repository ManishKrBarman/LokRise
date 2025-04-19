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

    // Fetch products with pagination
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await adminAPI.getAllProducts({
                    page: currentPage,
                    limit: 10,
                    search,
                    category: category !== 'all' ? category : undefined
                });

                // Using mock data for now since API isn't fully implemented
                const mockProducts = [
                    {
                        _id: 'p1',
                        name: 'Wireless Bluetooth Headphones',
                        description: 'High-quality wireless headphones with noise cancellation',
                        price: 1299,
                        quantityAvailable: 45,
                        category: 'electronics',
                        images: ['headphones.jpg'],
                        seller: {
                            _id: 's1',
                            name: 'TechWorld',
                            rating: 4.5
                        },
                        rating: 4.2,
                        reviews: 28,
                        createdAt: '2023-02-15',
                        isActive: true
                    },
                    {
                        _id: 'p2',
                        name: 'Cotton T-Shirt (Blue)',
                        description: 'Comfortable cotton t-shirt in sky blue color',
                        price: 499,
                        quantityAvailable: 120,
                        category: 'fashion',
                        images: ['tshirt.jpg'],
                        seller: {
                            _id: 's2',
                            name: 'Fashion Hub',
                            rating: 4.3
                        },
                        rating: 4.0,
                        reviews: 56,
                        createdAt: '2023-03-10',
                        isActive: true
                    },
                    {
                        _id: 'p3',
                        name: 'Stainless Steel Water Bottle',
                        description: 'Eco-friendly water bottle, keeps drinks hot/cold for 24 hours',
                        price: 799,
                        quantityAvailable: 0,
                        category: 'home',
                        images: ['bottle.jpg'],
                        seller: {
                            _id: 's3',
                            name: 'HomeGoods',
                            rating: 4.7
                        },
                        rating: 4.8,
                        reviews: 42,
                        createdAt: '2023-01-20',
                        isActive: true
                    },
                    {
                        _id: 'p4',
                        name: 'Yoga Mat',
                        description: 'Non-slip yoga mat with carrying strap',
                        price: 899,
                        quantityAvailable: 35,
                        category: 'sports',
                        images: ['yogamat.jpg'],
                        seller: {
                            _id: 's4',
                            name: 'FitLife',
                            rating: 4.6
                        },
                        rating: 4.5,
                        reviews: 31,
                        createdAt: '2023-02-28',
                        isActive: false
                    },
                    {
                        _id: 'p5',
                        name: 'Bestseller Fiction Novel',
                        description: 'Award-winning fiction novel, hardcover edition',
                        price: 349,
                        quantityAvailable: 80,
                        category: 'books',
                        images: ['book.jpg'],
                        seller: {
                            _id: 's5',
                            name: 'BookWorld',
                            rating: 4.9
                        },
                        rating: 4.7,
                        reviews: 64,
                        createdAt: '2023-04-05',
                        isActive: true
                    },
                    {
                        _id: 'p6',
                        name: 'Smart Watch',
                        description: 'Fitness tracker with heart rate monitor and notifications',
                        price: 2499,
                        quantityAvailable: 25,
                        category: 'electronics',
                        images: ['smartwatch.jpg'],
                        seller: {
                            _id: 's1',
                            name: 'TechWorld',
                            rating: 4.5
                        },
                        rating: 4.3,
                        reviews: 19,
                        createdAt: '2023-03-22',
                        isActive: true
                    },
                    {
                        _id: 'p7',
                        name: 'Portable Blender',
                        description: 'USB rechargeable personal blender for smoothies',
                        price: 1199,
                        quantityAvailable: 0,
                        category: 'home',
                        images: ['blender.jpg'],
                        seller: {
                            _id: 's3',
                            name: 'HomeGoods',
                            rating: 4.7
                        },
                        rating: 3.9,
                        reviews: 27,
                        createdAt: '2023-03-05',
                        isActive: true
                    },
                    {
                        _id: 'p8',
                        name: 'Leather Wallet',
                        description: 'Genuine leather wallet with multiple card slots',
                        price: 699,
                        quantityAvailable: 60,
                        category: 'fashion',
                        images: ['wallet.jpg'],
                        seller: {
                            _id: 's2',
                            name: 'Fashion Hub',
                            rating: 4.3
                        },
                        rating: 4.4,
                        reviews: 38,
                        createdAt: '2023-01-15',
                        isActive: true
                    }
                ];

                // Filter mock products based on search and category
                let filtered = mockProducts;
                if (search) {
                    const searchLower = search.toLowerCase();
                    filtered = filtered.filter(product =>
                        product.name.toLowerCase().includes(searchLower) ||
                        product.description.toLowerCase().includes(searchLower) ||
                        product.seller.name.toLowerCase().includes(searchLower)
                    );
                }

                if (category !== 'all') {
                    filtered = filtered.filter(product => product.category === category);
                }

                setProducts(filtered);
                setTotalPages(Math.ceil(filtered.length / 10));
                setError(null);
            } catch (err) {
                setError('Failed to load products');
                console.error('Products fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, search, category]);

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
                            <option value="electronics">Electronics</option>
                            <option value="fashion">Fashion</option>
                            <option value="home">Home</option>
                            <option value="sports">Sports</option>
                            <option value="books">Books</option>
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
                                        <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0"></div>
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
                                <td className="capitalize">{product.category}</td>
                                <td>
                                    <div>{product.seller.name}</div>
                                    <div className="text-xs text-gray-500">Rating: {product.seller.rating}/5</div>
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
                                <p className="text-gray-500">Product Image</p>
                            </div>

                            {/* Product Details */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg border-b pb-1">Details</h3>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="text-sm text-gray-500">Price:</div>
                                        <div className="font-medium">{formatPrice(selectedProduct.price)}</div>

                                        <div className="text-sm text-gray-500">Category:</div>
                                        <div className="capitalize">{selectedProduct.category}</div>

                                        <div className="text-sm text-gray-500">Stock:</div>
                                        <div className={selectedProduct.quantityAvailable === 0 ? 'text-red-600' : ''}>
                                            {selectedProduct.quantityAvailable > 0 ? selectedProduct.quantityAvailable : 'Out of stock'}
                                        </div>

                                        <div className="text-sm text-gray-500">Rating:</div>
                                        <div>{selectedProduct.rating}/5 ({selectedProduct.reviews} reviews)</div>

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
                                        <div>{selectedProduct.seller.name}</div>

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