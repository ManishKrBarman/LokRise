import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FormInput from './FormInput';
import { productAPI, uploadAPI, authAPI } from '../services/api';

const ProductForm = ({ onSuccess, onCancel, initialSellerStatus }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        quantityAvailable: '',
        category: '',
        subCategory: '',
        productType: 'physical',
        location: '',
        tags: '',
        images: []
    });
    const [courseDetails, setCourseDetails] = useState({
        level: 'Beginner',
        duration: '',
        topics: '',
        instructorDetails: ''
    });
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [uploadedImages, setUploadedImages] = useState([]);
    const [imageUploadProgress, setImageUploadProgress] = useState(0);
    // Use the initialSellerStatus if provided, otherwise start with null
    const [sellerStatus, setSellerStatus] = useState(initialSellerStatus || null);
    const [loading, setLoading] = useState(initialSellerStatus ? false : true);

    // Effect to immediately update seller status from user data if available
    useEffect(() => {
        if (user && user.sellerApplication && user.sellerApplication.status) {
            setSellerStatus(user.sellerApplication.status);
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        // Only fetch seller status if it's not already provided through props
        const checkSellerStatus = async () => {
            // If we already have a valid status from props, skip the API call
            if (initialSellerStatus === 'approved' || initialSellerStatus === 'rejected' || initialSellerStatus === 'pending') {
                console.log("Using seller status from props:", initialSellerStatus);
                setSellerStatus(initialSellerStatus);
                setLoading(false);
                return;
            }

            try {
                console.log("Fetching seller status from API");
                const statusResponse = await authAPI.getSellerApplicationStatus();
                setSellerStatus(statusResponse.data.status || 'pending');
                setLoading(false); // API call complete, no longer loading
            } catch (error) {
                console.error('Error checking seller status:', error);
                // Show error if unable to check seller status
                setError('Unable to verify seller status. Please try again later.');
                setLoading(false); // API call failed but still not loading
            }
        };

        // Fetch categories from API
        const fetchCategories = async () => {
            try {
                // In a real app, you'd fetch from your API
                // For now, using mock data
                setCategories(['Electronics', 'Fashion', 'Home & Garden', 'Books', 'Courses']);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        checkSellerStatus();
        fetchCategories();
    }, [initialSellerStatus]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleCourseDetailsChange = (e) => {
        const { name, value } = e.target;
        setCourseDetails(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        setImageUploadProgress(0);

        try {
            // For development/testing - simulate uploads with local data URLs
            // In production, use the real API
            const uploadPromises = files.map(file => {
                return new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        resolve(event.target.result);
                    };
                    reader.readAsDataURL(file);
                });
            });

            // Simulate progress
            const interval = setInterval(() => {
                setImageUploadProgress(prev => {
                    if (prev >= 95) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + 5;
                });
            }, 100);

            // Wait for all uploads to complete
            const imageUrls = await Promise.all(uploadPromises);

            clearInterval(interval);
            setImageUploadProgress(100);

            const newUploadedImages = [...uploadedImages, ...imageUrls];
            setUploadedImages(newUploadedImages);
            setFormData(prevData => ({
                ...prevData,
                images: newUploadedImages
            }));

            // Reset progress after a moment
            setTimeout(() => {
                setImageUploadProgress(0);
            }, 1000);
        } catch (error) {
            console.error('Error handling image uploads:', error);
            setError('Failed to upload images. Please try again.');
            setImageUploadProgress(0);
        }
    };

    const removeImage = (index) => {
        const newImages = [...uploadedImages];
        newImages.splice(index, 1);
        setUploadedImages(newImages);
        setFormData(prevData => ({
            ...prevData,
            images: newImages
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (sellerStatus !== 'approved') {
            setError('Your seller account is pending approval or has been rejected.');
            setIsSubmitting(false);
            return;
        }

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price || 0),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
                quantityAvailable: parseInt(formData.quantityAvailable || 0),
                seller: user._id,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
                ...(formData.productType === 'course' && {
                    courseDetails: {
                        ...courseDetails,
                        topics: courseDetails.topics ? courseDetails.topics.split(',').map(topic => topic.trim()) : []
                    }
                })
            };

            // For development/testing - mock API call
            console.log('Would send product data to API:', productData);

            // Simulate successful product creation
            const mockResponse = {
                data: {
                    ...productData,
                    _id: 'temp_' + Date.now(),
                    createdAt: new Date().toISOString(),
                    rating: 0,
                    reviewCount: 0,
                    purchaseCount: 0,
                    viewCount: 0,
                    inStock: true,
                    featured: false,
                    isNewProduct: true
                }
            };

            // In production, uncomment this to use the real API
            // const response = await productAPI.createProduct(productData);

            onSuccess(mockResponse.data);
        } catch (error) {
            console.error('Error creating product:', error);
            if (error.response?.status === 403) {
                setError('Your seller account is pending approval or has been rejected.');
            } else {
                setError(error.response?.data?.message || 'Failed to create product. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-600">Verifying seller status...</span>
                </div>
            </div>
        );
    }

    // If seller status isn't approved and we're not loading, show a message
    if (sellerStatus !== 'approved' && sellerStatus !== 'unknown') {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h3 className="font-medium text-yellow-700">Seller account not approved</h3>
                <p className="mt-2 text-sm text-yellow-600">
                    Your seller account is {sellerStatus === 'rejected' ? 'rejected' : 'pending approval'}.
                    You'll be able to add products once your account is approved.
                </p>
                <button
                    type="button"
                    onClick={onCancel}
                    className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 p-4 rounded-md">
                    <div className="text-sm text-red-700">{error}</div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Basic Information */}
                <div className="col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
                </div>

                <FormInput
                    label="Product Name"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="productType" className="block text-sm font-medium text-gray-700">
                        Product Type
                    </label>
                    <select
                        id="productType"
                        name="productType"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                        value={formData.productType}
                        onChange={handleChange}
                        required
                    >
                        <option value="physical">Physical Product</option>
                        <option value="course">Course</option>
                    </select>
                </div>

                <FormInput
                    label="Location"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai, Delhi, etc."
                />

                {/* Pricing and Inventory */}
                <div className="col-span-2 mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Pricing & Inventory</h3>
                </div>

                <FormInput
                    label="Price (₹)"
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />

                <FormInput
                    label="Original Price (₹) (optional)"
                    id="originalPrice"
                    name="originalPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="For showing discounts"
                />

                <FormInput
                    label="Quantity Available"
                    id="quantityAvailable"
                    name="quantityAvailable"
                    type="number"
                    min="1"
                    value={formData.quantityAvailable}
                    onChange={handleChange}
                    required
                />

                {/* Categorization */}
                <div className="col-span-2 mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Categorization</h3>
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <FormInput
                    label="Sub-Category (optional)"
                    id="subCategory"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                />

                <FormInput
                    label="Tags (comma separated)"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g. smartphone, electronics, sale"
                />

                {/* Course Details (conditional) */}
                {formData.productType === 'course' && (
                    <>
                        <div className="col-span-2 mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Course Details</h3>
                        </div>

                        <div>
                            <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                                Level
                            </label>
                            <select
                                id="level"
                                name="level"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                                value={courseDetails.level}
                                onChange={handleCourseDetailsChange}
                                required={formData.productType === 'course'}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="All Levels">All Levels</option>
                            </select>
                        </div>

                        <FormInput
                            label="Duration"
                            id="duration"
                            name="duration"
                            value={courseDetails.duration || ''}
                            onChange={handleCourseDetailsChange}
                            placeholder="e.g. 6 weeks, 3 months"
                            required={formData.productType === 'course'}
                        />

                        <div className="col-span-2">
                            <label htmlFor="topics" className="block text-sm font-medium text-gray-700">
                                Topics (comma separated)
                            </label>
                            <textarea
                                id="topics"
                                name="topics"
                                rows={2}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                                value={courseDetails.topics || ''}
                                onChange={handleCourseDetailsChange}
                                placeholder="e.g. Web Development, React, JavaScript"
                                required={formData.productType === 'course'}
                            />
                        </div>

                        <div className="col-span-2">
                            <label htmlFor="instructorDetails" className="block text-sm font-medium text-gray-700">
                                Instructor Details
                            </label>
                            <textarea
                                id="instructorDetails"
                                name="instructorDetails"
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                                value={courseDetails.instructorDetails || ''}
                                onChange={handleCourseDetailsChange}
                                placeholder="Information about the instructor's qualifications and expertise"
                                required={formData.productType === 'course'}
                            />
                        </div>
                    </>
                )}

                {/* Images Upload */}
                <div className="col-span-2 mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Product Images</h3>

                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="images"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-[var(--primary-color)] hover:text-[var(--primary-color)] focus-within:outline-none"
                                >
                                    <span>Upload images</span>
                                    <input
                                        id="images"
                                        name="images"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>

                    {imageUploadProgress > 0 && (
                        <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-[var(--primary-color)] h-2.5 rounded-full"
                                    style={{ width: `${imageUploadProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Uploading... {imageUploadProgress}%</p>
                        </div>
                    )}

                    {uploadedImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                            {uploadedImages.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={image}
                                        alt={`Product ${index + 1}`}
                                        className="h-24 w-24 object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
                                        onClick={() => removeImage(index)}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-5 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-[var(--primary-color)] border border-transparent rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating...' : 'Create Product'}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;