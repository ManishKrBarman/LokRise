import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { FiRefreshCw, FiSearch, FiEdit, FiTrash2, FiUserX, FiUserCheck } from 'react-icons/fi';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [role, setRole] = useState('all');

    // Fetch users with pagination
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                // Changed getAllUsers to getUsers to match the API service
                const response = await adminAPI.getUsers({
                    page: currentPage,
                    limit: 50, // Increase this to see more users at once
                    search,
                    role: role !== 'all' ? role : undefined
                });

                console.log('User data response:', response.data); // For debugging

                // Use real data from the API response
                if (response.data && response.data.users) {
                    setUsers(response.data.users);
                    // Fix pagination to match server structure
                    if (response.data.pagination) {
                        setTotalPages(response.data.pagination.pages || 1);
                    } else {
                        setTotalPages(1);
                    }
                } else {
                    setUsers([]);
                    setTotalPages(1);
                }
                setError(null);
            } catch (err) {
                setError('Failed to load users');
                console.error('Users fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage, search, role]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleBanUser = async (userId, isBanned) => {
        try {
            setLoading(true);
            if (isBanned) {
                await adminAPI.unbanUser(userId);
                // Update local state
                setUsers(users.map(user =>
                    user._id === userId ? { ...user, isBanned: false } : user
                ));
            } else {
                await adminAPI.banUser(userId);
                // Update local state
                setUsers(users.map(user =>
                    user._id === userId ? { ...user, isBanned: true } : user
                ));
            }
        } catch (err) {
            setError(`Failed to ${isBanned ? 'unban' : 'ban'} user`);
            console.error('Ban/unban user error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                setLoading(true);
                await adminAPI.deleteUser(userId);
                // Remove from local state
                setUsers(users.filter(user => user._id !== userId));
            } catch (err) {
                setError('Failed to delete user');
                console.error('Delete user error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleRoleFilterChange = (e) => {
        setRole(e.target.value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const openUserModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center">
                    <FiRefreshCw className="animate-spin text-primary h-12 w-12 mb-4" />
                    <p className="text-lg">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">User Management</h1>

                <div className="flex space-x-4">
                    {/* Role Filter */}
                    <div>
                        <select
                            value={role}
                            onChange={handleRoleFilterChange}
                            className="px-3 py-2 border rounded"
                        >
                            <option value="all">All Roles</option>
                            <option value="buyer">Buyers</option>
                            <option value="seller">Sellers</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>

                    {/* Search Box */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search users..."
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

            {users.length === 0 && !loading ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-500">No users found matching your criteria.</p>
                </div>
            ) : (
                <div className="overflow-x-auto shadow rounded-lg">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Joined On</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className={user.isBanned ? 'bg-red-50' : ''}>
                                    <td className="font-medium">{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone || 'N/A'}</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                            }
                                        `}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        {user.isBanned ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Banned
                                            </span>
                                        ) : user.isVerified ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Unverified
                                            </span>
                                        )}
                                    </td>
                                    <td>{formatDate(user.createdAt)}</td>
                                    <td>
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => openUserModal(user)}
                                                className="p-1 text-blue-600 hover:text-blue-800"
                                                title="Edit User"
                                            >
                                                <FiEdit size={18} />
                                            </button>

                                            <button
                                                onClick={() => handleBanUser(user._id, user.isBanned)}
                                                className={`p-1 ${user.isBanned ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}`}
                                                title={user.isBanned ? 'Unban User' : 'Ban User'}
                                            >
                                                {user.isBanned ? <FiUserCheck size={18} /> : <FiUserX size={18} />}
                                            </button>

                                            {/* Only show delete for non-admin users - safeguard */}
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="p-1 text-red-600 hover:text-red-800"
                                                    title="Delete User"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            )}
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

            {/* User Edit Modal - Enhanced version */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-4">User Details</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                        {selectedUser.name}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                        {selectedUser.email}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                        {selectedUser.phone || 'Not provided'}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Role</label>
                                    <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                                            ${selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                selectedUser.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                            }
                                        `}>
                                            {selectedUser.role}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                        {selectedUser.isBanned ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Banned
                                            </span>
                                        ) : selectedUser.isVerified ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Unverified
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Joined On</label>
                                    <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                        {formatDate(selectedUser.createdAt)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border rounded text-gray-700"
                            >
                                Close
                            </button>

                            {/* Ban/Unban button */}
                            <button
                                onClick={() => {
                                    handleBanUser(selectedUser._id, selectedUser.isBanned);
                                    setIsModalOpen(false);
                                }}
                                className={`px-4 py-2 rounded ${selectedUser.isBanned
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                            >
                                {selectedUser.isBanned ? 'Unban User' : 'Ban User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;