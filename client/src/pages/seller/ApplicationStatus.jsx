import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { FiCheckCircle, FiClock, FiAlertCircle, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const ApplicationStatus = () => {
    const { isAuthenticated, user, getCurrentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [applicationData, setApplicationData] = useState(null);
    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
        // Only run this effect once on component mount to prevent re-renders
        if (dataFetched) return;

        // Check authentication
        if (!isAuthenticated) {
            navigate('/login?returnTo=/seller/application-status');
            return;
        }

        const fetchUserData = async () => {
            setLoading(true);
            try {
                // If user data already has seller application, use it
                if (user?.sellerApplication) {
                    setApplicationData(user.sellerApplication);
                } else {
                    // Fetch the latest user data to get updated application status
                    const userData = await getCurrentUser();

                    if (!userData.sellerApplication) {
                        // No seller application found, redirect to become-seller page
                        navigate('/become-seller');
                        return;
                    }

                    setApplicationData(userData.sellerApplication);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
                setDataFetched(true);
            }
        };

        fetchUserData();
    }, [isAuthenticated, navigate, user, getCurrentUser, dataFetched]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <NavBar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-b-[var(--primary-color)] border-l-[var(--primary-color)]" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p className="mt-4 text-gray-600">Loading your application status...</p>
                    </div>
                </div>
                <Footer bgcolor="bg-gray-800" />
            </div>
        );
    }

    const renderStatusContent = () => {
        if (!applicationData) {
            return (
                <div className="text-center">
                    <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                        <FiAlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Application Found</h3>
                        <p className="text-yellow-700">You haven't submitted a seller application yet.</p>
                        <div className="mt-6">
                            <Link to="/become-seller" className="inline-block bg-[var(--primary-color)] text-white py-2 px-6 rounded-lg hover:bg-opacity-90 transition duration-300">
                                Apply to Become a Seller
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        switch (applicationData.status) {
            case 'pending':
                return (
                    <div className="text-center">
                        <div className="bg-blue-50 p-6 rounded-lg mb-6">
                            <FiClock className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">Application Under Review</h3>
                            <p className="text-blue-700">
                                Your seller application is currently being reviewed by our team.
                                We typically process applications within 24-48 hours.
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-3">Application Details</h4>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Submitted On:</span>
                                <span className="font-medium">{formatDate(applicationData.submittedAt)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Business Name:</span>
                                <span className="font-medium">{applicationData.businessDetails?.businessName || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>
                );

            case 'approved':
                return (
                    <div className="text-center">
                        <div className="bg-green-50 p-6 rounded-lg mb-6">
                            <FiCheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                            <h3 className="text-lg font-semibold text-green-800 mb-2">Congratulations!</h3>
                            <p className="text-green-700">
                                Your seller application has been approved.
                                You can now start selling products on LokRise.
                            </p>
                            <div className="mt-6">
                                <Link to="/seller/dashboard" className="inline-block bg-[var(--primary-color)] text-white py-2 px-6 rounded-lg hover:bg-opacity-90 transition duration-300">
                                    Go to Seller Dashboard <FiArrowRight className="inline ml-1" />
                                </Link>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-3">Application Details</h4>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Application Date:</span>
                                <span className="font-medium">{formatDate(applicationData.submittedAt)}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Approval Date:</span>
                                <span className="font-medium">{formatDate(applicationData.reviewedAt)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Business Name:</span>
                                <span className="font-medium">{applicationData.businessDetails?.businessName || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>
                );

            case 'rejected':
                return (
                    <div className="text-center">
                        <div className="bg-red-50 p-6 rounded-lg mb-6">
                            <FiAlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                            <h3 className="text-lg font-semibold text-red-800 mb-2">Application Not Approved</h3>
                            <p className="text-red-700">
                                Unfortunately, we were unable to approve your seller application at this time.
                                Please review the feedback below.
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg mb-6">
                            <h4 className="font-medium text-gray-700 mb-3">Rejection Reason</h4>
                            <p className="text-gray-700 italic">
                                "{applicationData.rejectionReason || 'No specific reason provided.'}"
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg mb-6">
                            <h4 className="font-medium text-gray-700 mb-3">Application Details</h4>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Submitted On:</span>
                                <span className="font-medium">{formatDate(applicationData.submittedAt)}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Reviewed On:</span>
                                <span className="font-medium">{formatDate(applicationData.reviewedAt)}</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link to="/become-seller" className="inline-block bg-[var(--primary-color)] text-white py-2 px-6 rounded-lg hover:bg-opacity-90 transition duration-300">
                                Submit New Application
                            </Link>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-center">
                        <div className="bg-yellow-50 p-6 rounded-lg">
                            <FiAlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Unknown Status</h3>
                            <p className="text-yellow-700">
                                There was an issue determining your application status.
                                Please contact customer support for assistance.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <NavBar />

            <div className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
                    <div className="flex items-center justify-center mb-6">
                        <FiShoppingBag className="text-[var(--primary-color)] h-8 w-8 mr-3" />
                        <h1 className="text-2xl font-bold text-center">Seller Application Status</h1>
                    </div>

                    {renderStatusContent()}
                </div>

                <div className="max-w-2xl mx-auto mt-8">
                    <h2 className="text-xl font-semibold mb-4">Have Questions?</h2>
                    <p className="text-gray-700 mb-4">
                        If you have any questions about your seller application or need assistance,
                        please contact our seller support team:
                    </p>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="mb-2">
                            <span className="font-medium">Email:</span>{' '}
                            <a href="mailto:seller-support@lokrise.com" className="text-[var(--primary-color)]">
                                seller-support@lokrise.com
                            </a>
                        </div>
                        <div>
                            <span className="font-medium">Phone:</span>{' '}
                            <a href="tel:+919876543210" className="text-[var(--primary-color)]">
                                +91 98765 43210
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer bgcolor="bg-gray-800" />
        </div>
    );
};

export default ApplicationStatus;