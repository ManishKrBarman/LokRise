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

    useEffect(() => {
        const fetchSellerApplications = async () => {
            setLoading(true);
            try {
                const response = await adminAPI.getSellerApplications({ status: currentStatus });

                // Using mock data for now since API isn't fully implemented
                const mockApplications = [
                    {
                        _id: 'app1',
                        user: {
                            _id: 'user1',
                            name: 'John Smith',
                            email: 'john@example.com',
                            phone: '9876543210',
                            createdAt: '2023-01-10'
                        },
                        businessDetails: {
                            businessName: "John's Electronics",
                            gstin: 'GST1234567890',
                            businessType: 'individual',
                            businessCategory: 'electronics',
                            businessDescription: 'Selling high-quality electronics and accessories',
                            establishedYear: '2022'
                        },
                        address: {
                            addressLine1: '123 Main St',
                            addressLine2: 'Apt 4B',
                            city: 'Mumbai',
                            district: 'Mumbai',
                            state: 'Maharashtra',
                            pinCode: '400001'
                        },
                        bankDetails: {
                            accountHolderName: 'John Smith',
                            accountNumber: 'XXXX1234',
                            ifscCode: 'SBIN0001234',
                            bankName: 'State Bank of India',
                            branchName: 'Mumbai Main'
                        },
                        identityDetails: {
                            panNumber: 'ABCDE1234F',
                            aadharNumber: 'XXXX-XXXX-1234'
                        },
                        submittedAt: '2023-05-15',
                        status: 'pending'
                    },
                    {
                        _id: 'app2',
                        user: {
                            _id: 'user2',
                            name: 'Priya Sharma',
                            email: 'priya@example.com',
                            phone: '8765432109',
                            createdAt: '2023-02-05'
                        },
                        businessDetails: {
                            businessName: "Priya's Fashions",
                            gstin: 'GST0987654321',
                            businessType: 'partnership',
                            businessCategory: 'fashion',
                            businessDescription: 'Trendy fashion items for women',
                            establishedYear: '2021'
                        },
                        address: {
                            addressLine1: '456 Park Avenue',
                            addressLine2: '',
                            city: 'Delhi',
                            district: 'New Delhi',
                            state: 'Delhi',
                            pinCode: '110001'
                        },
                        bankDetails: {
                            accountHolderName: 'Priya Sharma',
                            accountNumber: 'XXXX5678',
                            ifscCode: 'HDFC0002345',
                            bankName: 'HDFC Bank',
                            branchName: 'Delhi Central'
                        },
                        identityDetails: {
                            panNumber: 'FGHIJ5678K',
                            aadharNumber: 'XXXX-XXXX-5678'
                        },
                        submittedAt: '2023-05-20',
                        status: 'pending'
                    },
                    {
                        _id: 'app3',
                        user: {
                            _id: 'user3',
                            name: 'Raj Patel',
                            email: 'raj@example.com',
                            phone: '7654321098',
                            createdAt: '2023-03-15'
                        },
                        businessDetails: {
                            businessName: "Raj Home Decor",
                            gstin: 'GST5678901234',
                            businessType: 'company',
                            businessCategory: 'home',
                            businessDescription: 'Quality home decor items and furniture',
                            establishedYear: '2020'
                        },
                        address: {
                            addressLine1: '789 Gandhi Road',
                            addressLine2: 'Floor 3',
                            city: 'Ahmedabad',
                            district: 'Ahmedabad',
                            state: 'Gujarat',
                            pinCode: '380001'
                        },
                        bankDetails: {
                            accountHolderName: 'Raj Patel',
                            accountNumber: 'XXXX9012',
                            ifscCode: 'ICIC0003456',
                            bankName: 'ICICI Bank',
                            branchName: 'Ahmedabad Main'
                        },
                        identityDetails: {
                            panNumber: 'KLMNO9012P',
                            aadharNumber: 'XXXX-XXXX-9012'
                        },
                        submittedAt: '2023-05-25',
                        status: 'pending'
                    }
                ];

                // Filter mock applications based on current status filter
                const filteredApplications = mockApplications.filter(app => app.status === currentStatus);

                setApplications(filteredApplications);
                setError(null);
            } catch (err) {
                setError('Failed to load seller applications');
                console.error('Applications fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerApplications();
    }, [currentStatus]);

    const handleApprove = async (applicationId) => {
        try {
            setLoading(true);
            await adminAPI.approveSellerApplication(applicationId);

            // Update local state
            setApplications(applications.filter(app => app._id !== applicationId));

            // For demo/mock, we'll just remove the application from the list
            // In a real application, you might want to refresh data or move to another status
        } catch (err) {
            setError('Failed to approve seller application');
            console.error('Approval error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (applicationId) => {
        try {
            setLoading(true);
            await adminAPI.rejectSellerApplication(applicationId, rejectionReason);

            // Update local state
            setApplications(applications.filter(app => app._id !== applicationId));

            // Close modal
            setIsRejectModalOpen(false);
            setRejectionReason('');
            setSelectedApplication(null);
        } catch (err) {
            setError('Failed to reject seller application');
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
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
                <h1 className="text-2xl font-semibold">Seller Applications</h1>

                <div className="flex space-x-4">
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
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Business Name</th>
                                <th>Seller Name</th>
                                <th>Contact Info</th>
                                <th>Business Type</th>
                                <th>Submitted On</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app._id}>
                                    <td className="font-medium">{app.businessDetails.businessName}</td>
                                    <td>{app.user.name}</td>
                                    <td>
                                        <div>{app.user.email}</div>
                                        <div className="text-gray-500 text-sm">{app.user.phone}</div>
                                    </td>
                                    <td className="capitalize">{app.businessDetails.businessType}</td>
                                    <td>{formatDate(app.submittedAt)}</td>
                                    <td>
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
                                        <div>{selectedApplication.user.name}</div>

                                        <div className="text-sm text-gray-500">Email:</div>
                                        <div>{selectedApplication.user.email}</div>

                                        <div className="text-sm text-gray-500">Phone:</div>
                                        <div>{selectedApplication.user.phone}</div>

                                        <div className="text-sm text-gray-500">Member Since:</div>
                                        <div>{formatDate(selectedApplication.user.createdAt)}</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg border-b pb-1">Business Information</h3>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="text-sm text-gray-500">Business Name:</div>
                                        <div>{selectedApplication.businessDetails.businessName}</div>

                                        <div className="text-sm text-gray-500">GSTIN:</div>
                                        <div>{selectedApplication.businessDetails.gstin}</div>

                                        <div className="text-sm text-gray-500">Business Type:</div>
                                        <div className="capitalize">{selectedApplication.businessDetails.businessType}</div>

                                        <div className="text-sm text-gray-500">Category:</div>
                                        <div className="capitalize">{selectedApplication.businessDetails.businessCategory}</div>

                                        <div className="text-sm text-gray-500">Established:</div>
                                        <div>{selectedApplication.businessDetails.establishedYear}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Address & Banking Information */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg border-b pb-1">Business Address</h3>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="text-sm text-gray-500">Address Line 1:</div>
                                        <div>{selectedApplication.address.addressLine1}</div>

                                        {selectedApplication.address.addressLine2 && (
                                            <>
                                                <div className="text-sm text-gray-500">Address Line 2:</div>
                                                <div>{selectedApplication.address.addressLine2}</div>
                                            </>
                                        )}

                                        <div className="text-sm text-gray-500">City:</div>
                                        <div>{selectedApplication.address.city}</div>

                                        <div className="text-sm text-gray-500">District:</div>
                                        <div>{selectedApplication.address.district}</div>

                                        <div className="text-sm text-gray-500">State:</div>
                                        <div>{selectedApplication.address.state}</div>

                                        <div className="text-sm text-gray-500">PIN Code:</div>
                                        <div>{selectedApplication.address.pinCode}</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg border-b pb-1">Banking Details</h3>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="text-sm text-gray-500">Account Holder:</div>
                                        <div>{selectedApplication.bankDetails.accountHolderName}</div>

                                        <div className="text-sm text-gray-500">Account Number:</div>
                                        <div>{selectedApplication.bankDetails.accountNumber}</div>

                                        <div className="text-sm text-gray-500">IFSC Code:</div>
                                        <div>{selectedApplication.bankDetails.ifscCode}</div>

                                        <div className="text-sm text-gray-500">Bank:</div>
                                        <div>{selectedApplication.bankDetails.bankName}</div>

                                        <div className="text-sm text-gray-500">Branch:</div>
                                        <div>{selectedApplication.bankDetails.branchName}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-4">
                            <h3 className="font-semibold text-lg border-b pb-1">Business Description</h3>
                            <p className="mt-2">{selectedApplication.businessDetails.businessDescription}</p>
                        </div>

                        {/* Identity Information */}
                        <div className="mt-4">
                            <h3 className="font-semibold text-lg border-b pb-1">Identity Details</h3>
                            <div className="grid grid-cols-2 gap-2 mt-2 max-w-md">
                                <div className="text-sm text-gray-500">PAN Number:</div>
                                <div>{selectedApplication.identityDetails.panNumber}</div>

                                <div className="text-sm text-gray-500">Aadhar Number:</div>
                                <div>{selectedApplication.identityDetails.aadharNumber}</div>
                            </div>
                        </div>

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
                            You are about to reject the seller application for <strong>{selectedApplication.businessDetails.businessName}</strong>.
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