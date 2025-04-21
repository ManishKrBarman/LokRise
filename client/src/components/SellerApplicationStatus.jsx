import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiAlertCircle, FiClock, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { authAPI } from '../services/api';

const SellerApplicationStatus = ({ user, refreshUser }) => {
    const [applicationData, setApplicationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const hasFetchedData = useRef(false);

    useEffect(() => {
        // Skip if no user or if we've already fetched the data
        if (!user || hasFetchedData.current) return;

        const fetchApplicationStatus = async () => {
            try {
                setLoading(true);

                // If user already has seller application data, use it
                if (user.sellerApplication) {
                    setApplicationData(user.sellerApplication);
                } else {
                    // Otherwise fetch from API
                    try {
                        const response = await authAPI.getSellerApplicationStatus();
                        if (response.data && response.data.hasApplication) {
                            setApplicationData(response.data.application);
                        }
                    } catch (apiError) {
                        // If the API returns a 404 (no application found), that's not an error
                        // Just means the user hasn't submitted an application yet
                        if (apiError.response && apiError.response.status === 404) {
                            // This is expected if the user hasn't submitted an application
                            console.log("User has no seller application yet");
                        } else {
                            throw apiError; // Re-throw if it's a real error
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch application status:", err);
                setError('Failed to load application status');
            } finally {
                setLoading(false);
                hasFetchedData.current = true; // Mark that we've fetched data
            }
        };

        fetchApplicationStatus();
    }, [user]); // Only depend on user object

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-b-[var(--primary-color)] border-l-[var(--primary-color)]" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <FiAlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!applicationData) {
        return (
            <div className="text-center py-8">
                <div className="mb-4">
                    <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Seller Application</h3>
                <p className="text-gray-500 mb-6">
                    You haven't submitted a seller application yet. Apply to become a seller on Lokrise to start selling your products.
                </p>
                <Link
                    to="/become-seller"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--primary-color)] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]"
                >
                    Apply to Become a Seller
                </Link>
            </div>
        );
    }

    const renderStatusContent = () => {
        switch (applicationData.status) {
            case 'pending':
                return (
                    <div className="bg-blue-50 p-6 rounded-lg mb-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <FiClock className="h-6 w-6 text-blue-500" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-semibold text-blue-800 mb-2">Application Under Review</h3>
                                <p className="text-blue-700">
                                    Your seller application is currently being reviewed by our team.
                                    We typically process applications within 24-48 hours.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'approved':
                return (
                    <div className="bg-green-50 p-6 rounded-lg mb-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <FiCheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-semibold text-green-800 mb-2">Congratulations!</h3>
                                <p className="text-green-700 mb-4">
                                    Your seller application has been approved.
                                    You can now start selling products on Lokrise.
                                </p>
                                <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-900">
                                    Go to Seller Dashboard <FiArrowRight className="ml-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                );

            case 'rejected':
                return (
                    <div className="bg-red-50 p-6 rounded-lg mb-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <FiAlertCircle className="h-6 w-6 text-red-500" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-semibold text-red-800 mb-2">Application Not Approved</h3>
                                <p className="text-red-700 mb-4">
                                    Unfortunately, we were unable to approve your seller application at this time.
                                    Please review the feedback below.
                                </p>
                                <div className="mt-2 p-3 bg-white rounded border border-red-200">
                                    <h4 className="font-medium text-red-700 mb-1">Rejection Reason:</h4>
                                    <p className="text-gray-700 italic">
                                        "{applicationData.rejectionReason || 'No specific reason provided.'}"
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <Link to="/become-seller" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                        Submit New Application
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="bg-yellow-50 p-6 rounded-lg">
                        <FiAlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Unknown Status</h3>
                        <p className="text-yellow-700">
                            There was an issue determining your application status.
                            Please contact customer support for assistance.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            {renderStatusContent()}

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Application Details</h3>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Submitted On</h4>
                            <p className="mt-1">{formatDate(applicationData.submittedAt)}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Status</h4>
                            <p className="mt-1 capitalize">{applicationData.status}</p>
                        </div>
                        {applicationData.reviewedAt && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Reviewed On</h4>
                                <p className="mt-1">{formatDate(applicationData.reviewedAt)}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Business Information</h4>
                        <div className="bg-gray-50 p-4 rounded border border-gray-200">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h5 className="text-xs font-medium text-gray-500">Business Name</h5>
                                    <p className="text-sm">{applicationData.businessDetails?.businessName || 'Not specified'}</p>
                                </div>
                                <div>
                                    <h5 className="text-xs font-medium text-gray-500">Business Type</h5>
                                    <p className="text-sm capitalize">{applicationData.businessDetails?.businessType || 'Not specified'}</p>
                                </div>
                                <div>
                                    <h5 className="text-xs font-medium text-gray-500">GSTIN</h5>
                                    <p className="text-sm">{applicationData.businessDetails?.gstin || 'Not provided'}</p>
                                </div>
                                <div>
                                    <h5 className="text-xs font-medium text-gray-500">Business Category</h5>
                                    <p className="text-sm">{applicationData.businessDetails?.businessCategory || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h4 className="font-medium mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-4">
                    If you have any questions about your seller application or need assistance,
                    please contact our seller support team:
                </p>
                <div>
                    <a href="mailto:seller-support@lokrise.com" className="text-[var(--primary-color)] hover:underline">
                        seller-support@lokrise.com
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SellerApplicationStatus;