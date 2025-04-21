import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { FiRefreshCw, FiCheck, FiX, FiEye } from 'react-icons/fi';

const SellerApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [currentStatus, setCurrentStatus] = useState('pending');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchSellerApplications = async () => {
            setLoading(true);
            try {
                // Get seller applications based on current status filter
                const response = await adminAPI.getSellerApplications(currentStatus);

                if (response.data && response.data.applications) {
                    setApplications(response.data.applications);
                    setError(null);
                } else {
                    setApplications([]);
                    setError('No applications data received');
                }
            } catch (err) {
                setError('Failed to load seller applications');
                console.error('Applications fetch error:', err);
                setApplications([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerApplications();
    }, [currentStatus, refreshTrigger]);

    const handleApprove = async (userId) => {
        if (!window.confirm('Are you sure you want to approve this seller application?')) {
            return;
        }

        try {
            setLoading(true);
            const response = await adminAPI.approveSellerApplication(userId);

            if (response.data && response.data.success) {
                // Refresh the applications list
                setRefreshTrigger(prev => prev + 1);
                // Show success message
                alert('Seller application approved successfully');

                if (isDetailsModalOpen) {
                    setIsDetailsModalOpen(false);
                }
            }
        } catch (err) {
            setError(`Failed to approve seller application: ${err.response?.data?.message || err.message}`);
            console.error('Approval error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (userId) => {
        if (!rejectionReason.trim()) {
            setError('Please provide a reason for rejection');
            return;
        }

        try {
            setLoading(true);
            const response = await adminAPI.rejectSellerApplication(userId, { reason: rejectionReason });

            if (response.data && response.data.success) {
                // Refresh the applications list
                setRefreshTrigger(prev => prev + 1);
                // Close modal and reset
                setIsRejectModalOpen(false);
                setRejectionReason('');
                setSelectedApplication(null);
                // Show success message
                alert('Seller application rejected successfully');
            }
        } catch (err) {
            setError(`Failed to reject seller application: ${err.response?.data?.message || err.message}`);
            console.error('Rejection error:', err);
        } finally {
            setLoading(false);
        }
    };

    const openDetailsModal = (application) => {
        setSelectedApplication(application);
        setIsDetailsModalOpen(true);
    };

    const openRejectModal = (application) => {
        setSelectedApplication(application);
        setIsRejectModalOpen(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const refreshApplications = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    if (loading && applications.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center">
                    <FiRefreshCw className="animate-spin text-primary h-12 w-12 mb-4" />
                    <p className="text-lg">Loading applications...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold"></h1>

                <div className="flex space-x-4">
                    <button
                        onClick={refreshApplications}
                        className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                        disabled={loading}
                    >
                        <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>

                    <div>
                        <select
                            value={currentStatus}
                            onChange={(e) => setCurrentStatus(e.target.value)}
                            className="px-3 py-2 border rounded"
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
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

            {applications.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <p className="text-lg text-gray-500">No {currentStatus} seller applications found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto shadow rounded-lg">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Business Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Seller Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact Info
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Business Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Submitted On
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.map(app => (
                                <tr key={app._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                                        {app.sellerApplication?.businessDetails?.businessName || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {app.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>{app.email}</div>
                                        <div className="text-gray-500 text-sm">{app.phone || 'No phone'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                                        {app.sellerApplication?.businessDetails?.businessType || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatDate(app.sellerApplication?.submittedAt || app.updatedAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => openDetailsModal(app)}
                                                className="p-1 text-blue-600 hover:text-blue-800"
                                                title="View Details"
                                            >
                                                <FiEye size={18} />
                                            </button>

                                            {currentStatus === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(app._id)}
                                                        className="p-1 text-green-600 hover:text-green-800"
                                                        title="Approve"
                                                    >
                                                        <FiCheck size={18} />
                                                    </button>

                                                    <button
                                                        onClick={() => openRejectModal(app)}
                                                        className="p-1 text-red-600 hover:text-red-800"
                                                        title="Reject"
                                                    >
                                                        <FiX size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Application Details Modal */}
            {isDetailsModalOpen && selectedApplication && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Application Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal & Business Information */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg border-b pb-1">Seller Information</h3>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="text-sm text-gray-500">Name:</div>
                                        <div>{selectedApplication.name}</div>

                                        <div className="text-sm text-gray-500">Email:</div>
                                        <div>{selectedApplication.email}</div>

                                        <div className="text-sm text-gray-500">Phone:</div>
                                        <div>{selectedApplication.phone || 'Not provided'}</div>

                                        <div className="text-sm text-gray-500">Member Since:</div>
                                        <div>{formatDate(selectedApplication.createdAt)}</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg border-b pb-1">Business Information</h3>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="text-sm text-gray-500">Business Name:</div>
                                        <div>{selectedApplication.sellerApplication?.businessDetails?.businessName || 'N/A'}</div>

                                        <div className="text-sm text-gray-500">GSTIN:</div>
                                        <div>{selectedApplication.sellerApplication?.businessDetails?.gstin || 'N/A'}</div>

                                        <div className="text-sm text-gray-500">Business Type:</div>
                                        <div className="capitalize">{selectedApplication.sellerApplication?.businessDetails?.businessType || 'N/A'}</div>

                                        <div className="text-sm text-gray-500">Category:</div>
                                        <div className="capitalize">{selectedApplication.sellerApplication?.businessDetails?.businessCategory || 'N/A'}</div>

                                        <div className="text-sm text-gray-500">Established:</div>
                                        <div>{selectedApplication.sellerApplication?.businessDetails?.establishedYear || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Address & Banking Information */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg border-b pb-1">Business Address</h3>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="text-sm text-gray-500">Address Line 1:</div>
                                        <div>{selectedApplication.sellerApplication?.address?.addressLine1 || 'N/A'}</div>

                                        {selectedApplication.sellerApplication?.address?.addressLine2 && (
                                            <>
                                                <div className="text-sm text-gray-500">Address Line 2:</div>
                                                <div>{selectedApplication.sellerApplication?.address?.addressLine2}</div>
                                            </>
                                        )}

                                        <div className="text-sm text-gray-500">City:</div>
                                        <div>{selectedApplication.sellerApplication?.address?.city || 'N/A'}</div>

                                        <div className="text-sm text-gray-500">District:</div>
                                        <div>{selectedApplication.sellerApplication?.address?.district || 'N/A'}</div>

                                        <div className="text-sm text-gray-500">State:</div>
                                        <div>{selectedApplication.sellerApplication?.address?.state || 'N/A'}</div>

                                        <div className="text-sm text-gray-500">PIN Code:</div>
                                        <div>{selectedApplication.sellerApplication?.address?.pinCode || 'N/A'}</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg border-b pb-1">Banking Details</h3>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="text-sm text-gray-500">Account Holder:</div>
                                        <div>{selectedApplication.sellerApplication?.bankDetails?.accountHolderName || 'N/A'}</div>

                                        <div className="text-sm text-gray-500">Account Number:</div>
                                        <div>{selectedApplication.sellerApplication?.bankDetails?.accountNumber || 'N/A'}</div>

                                        <div className="text-sm text-gray-500">IFSC Code:</div>
                                        <div>{selectedApplication.sellerApplication?.bankDetails?.ifscCode || 'N/A'}</div>

                                        <div className="text-sm text-gray-500">Bank:</div>
                                        <div>{selectedApplication.sellerApplication?.bankDetails?.bankName || 'N/A'}</div>

                                        <div className="text-sm text-gray-500">Branch:</div>
                                        <div>{selectedApplication.sellerApplication?.bankDetails?.branchName || 'N/A'}</div>

                                        <div className="text-sm text-gray-500">UPI ID:</div>
                                        <div>{selectedApplication.sellerApplication?.bankDetails?.upiId || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-4">
                            <h3 className="font-semibold text-lg border-b pb-1">Business Description</h3>
                            <p className="mt-2">{selectedApplication.sellerApplication?.businessDetails?.businessDescription || 'No description provided'}</p>
                        </div>

                        {/* Identity Information */}
                        <div className="mt-4">
                            <h3 className="font-semibold text-lg border-b pb-1">Identity Details</h3>
                            <div className="grid grid-cols-2 gap-2 mt-2 max-w-md">
                                <div className="text-sm text-gray-500">PAN Number:</div>
                                <div>{selectedApplication.sellerApplication?.identityDetails?.panNumber || 'N/A'}</div>

                                <div className="text-sm text-gray-500">Aadhar Number (Last 4):</div>
                                <div>{selectedApplication.sellerApplication?.identityDetails?.aadharNumber || 'N/A'}</div>
                            </div>
                        </div>

                        {currentStatus === 'rejected' && selectedApplication.sellerApplication.rejectionReason && (
                            <div className="mt-4">
                                <h3 className="font-semibold text-lg border-b pb-1 text-red-600">Rejection Reason</h3>
                                <p className="mt-2 text-red-600">{selectedApplication.sellerApplication.rejectionReason}</p>
                            </div>
                        )}

                        {currentStatus === 'approved' && selectedApplication.sellerApplication.reviewedAt && (
                            <div className="mt-4">
                                <h3 className="font-semibold text-lg border-b pb-1 text-green-600">Approval Information</h3>
                                <p className="mt-2">Approved on: {formatDate(selectedApplication.sellerApplication.reviewedAt)}</p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="px-4 py-2 border rounded text-gray-700"
                            >
                                Close
                            </button>

                            {currentStatus === 'pending' && (
                                <>
                                    <button
                                        onClick={() => {
                                            setIsDetailsModalOpen(false);
                                            handleApprove(selectedApplication._id);
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() => {
                                            setIsDetailsModalOpen(false);
                                            openRejectModal(selectedApplication);
                                        }}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            {isRejectModalOpen && selectedApplication && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Reject Seller Application</h2>
                        <p className="mb-4">
                            You are about to reject the seller application for <strong>{selectedApplication.sellerApplication?.businessDetails?.businessName || selectedApplication.name}</strong>.
                            Please provide a reason for rejection.
                        </p>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Rejection Reason
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows="4"
                                placeholder="Please provide a reason for rejection..."
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsRejectModalOpen(false)}
                                className="px-4 py-2 border rounded text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(selectedApplication._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                disabled={!rejectionReason.trim()}
                            >
                                Reject Application
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerApplications;