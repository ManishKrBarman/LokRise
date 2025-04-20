import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import SellerApplicationStatus from '../components/SellerApplicationStatus';
import { BASE_URL } from '../services/api';
import { FiUser, FiPackage, FiSettings, FiShoppingBag, FiBell } from 'react-icons/fi';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const Profile = () => {
    const location = useLocation();
    const { user, updateProfile, loading, getCurrentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        profileImage: '',
        address: {
            addressLine1: '',
            addressLine2: '',
            city: '',
            district: '',
            state: '',
            pinCode: ''
        },
        socialProfiles: {
            website: '',
            github: '',
            twitter: '',
            linkedin: '',
            instagram: '',
            facebook: ''
        },
        preferences: {
            language: 'en',
            emailNotifications: true,
            pushNotifications: true,
            newsletter: false
        }
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageError, setImageError] = useState(false);

    const getProfileImageUrl = () => {
        if (!user?._id) return null;
        return `${BASE_URL}/auth/profile-image/${user._id}?t=${Date.now()}`;
    };

    // Set active tab from URL query parameter
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [location]);

    useEffect(() => {
        if (user) {
            setFormData(prevData => ({
                ...prevData,
                name: user.name || '',
                phone: user.phone || '',
                profileImage: user.profileImage || '',
                address: user.address || prevData.address,
                socialProfiles: user.socialProfiles || prevData.socialProfiles,
                preferences: user.preferences || prevData.preferences
            }));
            setImageError(false);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [section, field] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateImage = (file) => {
        if (!file) return 'No file selected';
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return 'Invalid file type. Please upload a JPEG, PNG or WebP image.';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'File is too large. Maximum size is 5MB.';
        }
        return null;
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const error = validateImage(file);
        if (error) {
            setError(error);
            return;
        }

        try {
            // Show preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            setFormData(prev => ({
                ...prev,
                profileImage: file
            }));
        } catch (err) {
            console.error('Error processing image:', err);
            setError('Error processing image. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setUploading(true);

        try {
            // Create FormData for file upload
            const formDataToSend = new FormData();

            // Append file if it's a File object
            if (formData.profileImage instanceof File) {
                formDataToSend.append('profileImage', formData.profileImage);
            }

            // Append other form data
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'profileImage' || !(value instanceof File)) {
                    if (typeof value === 'object') {
                        formDataToSend.append(key, JSON.stringify(value));
                    } else {
                        formDataToSend.append(key, value);
                    }
                }
            });

            const result = await updateProfile(formDataToSend);
            if (result.success) {
                setSuccess('Profile updated successfully');
                setIsEditing(false);
                // Clear the file input
                const fileInput = document.getElementById('profile-image');
                if (fileInput) fileInput.value = '';
                // Refresh user data
                await getCurrentUser();
            } else {
                setError(result.error || 'Failed to update profile');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error('Profile update error:', err);
        } finally {
            setUploading(false);
        }
    };

    // Helper to check if user has seller application
    const hasSellerApplication = user?.sellerApplication?.status && (user?.sellerApplication || user?.role === 'seller');

    // Helper to check if tab should be visible
    const showTab = (tabName) => {
        if (tabName === 'seller' && !hasSellerApplication && user?.role !== 'seller') {
            return false;
        }
        return true;
    };

    // Tab navigation functions
    const tabs = [
        { id: 'profile', label: 'Profile', icon: <FiUser /> },
        { id: 'orders', label: 'Orders', icon: <FiPackage /> },
        { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
        { id: 'seller', label: 'Seller Application', icon: <FiShoppingBag /> },
        { id: 'settings', label: 'Settings', icon: <FiSettings /> }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return renderProfileTab();
            case 'seller':
                return <SellerApplicationStatus user={user} refreshUser={getCurrentUser} />;
            case 'notifications':
                return renderNotificationsTab();
            case 'orders':
                return <div className="text-center py-8 text-gray-500">Orders view is coming soon.</div>;
            case 'settings':
                return <div className="text-center py-8 text-gray-500">Settings view is coming soon.</div>;
            default:
                return renderProfileTab();
        }
    };

    const renderNotificationsTab = () => {
        if (!user?.notifications?.length) {
            return (
                <div className="text-center py-8">
                    <div className="mb-4">
                        <FiBell className="mx-auto h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
                    <p className="text-gray-500">
                        You don't have any notifications yet.
                    </p>
                </div>
            );
        }

        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        return (
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Your Notifications</h3>
                <div className="border rounded-md overflow-hidden">
                    {user.notifications.map((notification, index) => (
                        <div key={notification._id || index}
                            className={`p-4 ${notification.read ? 'bg-white' : 'bg-blue-50'} ${index !== user.notifications.length - 1 ? 'border-b' : ''}`}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{formatDate(notification.createdAt)}</p>
                                </div>
                                {!notification.read && (
                                    <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderProfileTab = () => {
        return (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormInput
                        id="name"
                        label="Full Name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                    />
                    <FormInput
                        id="phone"
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                    />
                </div>

                {/* Address Section */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Address</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormInput
                            id="address.addressLine1"
                            label="Address Line 1"
                            type="text"
                            value={formData.address.addressLine1}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        <FormInput
                            id="address.addressLine2"
                            label="Address Line 2"
                            type="text"
                            value={formData.address.addressLine2}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        <FormInput
                            id="address.city"
                            label="City"
                            type="text"
                            value={formData.address.city}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        <FormInput
                            id="address.district"
                            label="District"
                            type="text"
                            value={formData.address.district}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        <FormInput
                            id="address.state"
                            label="State"
                            type="text"
                            value={formData.address.state}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        <FormInput
                            id="address.pinCode"
                            label="PIN Code"
                            type="text"
                            value={formData.address.pinCode}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {/* Social Profiles Section */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Social Profiles</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormInput
                            id="socialProfiles.website"
                            label="Website"
                            type="url"
                            value={formData.socialProfiles.website}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        <FormInput
                            id="socialProfiles.github"
                            label="GitHub"
                            type="url"
                            value={formData.socialProfiles.github}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        <FormInput
                            id="socialProfiles.linkedin"
                            label="LinkedIn"
                            type="url"
                            value={formData.socialProfiles.linkedin}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        <FormInput
                            id="socialProfiles.twitter"
                            label="Twitter"
                            type="url"
                            value={formData.socialProfiles.twitter}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Preferences</h3>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                id="preferences.emailNotifications"
                                name="preferences.emailNotifications"
                                type="checkbox"
                                checked={formData.preferences.emailNotifications}
                                onChange={(e) => handleChange({
                                    target: {
                                        name: 'preferences.emailNotifications',
                                        value: e.target.checked
                                    }
                                })}
                                disabled={!isEditing}
                                className="h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300 rounded"
                            />
                            <label htmlFor="preferences.emailNotifications" className="ml-2 block text-sm text-gray-900">
                                Receive Email Notifications
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="preferences.newsletter"
                                name="preferences.newsletter"
                                type="checkbox"
                                checked={formData.preferences.newsletter}
                                onChange={(e) => handleChange({
                                    target: {
                                        name: 'preferences.newsletter',
                                        value: e.target.checked
                                    }
                                })}
                                disabled={!isEditing}
                                className="h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300 rounded"
                            />
                            <label htmlFor="preferences.newsletter" className="ml-2 block text-sm text-gray-900">
                                Subscribe to Newsletter
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--primary-color)] hover:bg-[#8b6b4b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--primary-color)] hover:bg-[#8b6b4b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </form>
        );
    };

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <div className="flex-grow bg-gray-50 py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        {/* Profile Header */}
                        <div className="bg-[var(--primary-color)] px-4 py-5 sm:px-6">
                            <div className="flex items-center">
                                <div className="relative group">
                                    <img
                                        src={imagePreview || (!imageError && user?._id ? getProfileImageUrl() : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name?.[0] || 'U')}&background=8B6B4B&color=fff`)}
                                        alt={user?.name}
                                        className={`h-16 w-16 rounded-full border-2 border-white object-cover ${uploading ? 'opacity-50' : ''}`}
                                        onError={(e) => {
                                            e.target.onerror = null; // Prevent infinite loop
                                            setImageError(true);
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name?.[0] || 'U')}&background=8B6B4B&color=fff`;
                                        }}
                                    />
                                    {uploading && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                    )}
                                    {isEditing && activeTab === 'profile' && (
                                        <label
                                            htmlFor="profile-image"
                                            className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <input
                                                type="file"
                                                id="profile-image"
                                                accept={ALLOWED_FILE_TYPES.join(',')}
                                                onChange={handleImageChange}
                                                className="hidden"
                                                disabled={uploading}
                                            />
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </label>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                                    <p className="text-white opacity-90">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                {tabs.filter(tab => showTab(tab.id)).map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`${activeTab === tab.id
                                            ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            } flex items-center px-4 py-4 border-b-2 font-medium text-sm`}
                                    >
                                        {tab.icon && <span className="mr-2">{tab.icon}</span>}
                                        {tab.label}
                                        {tab.id === 'notifications' && user?.notifications?.filter(n => !n.read).length > 0 && (
                                            <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                                                {user.notifications.filter(n => !n.read).length}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Profile Content */}
                        <div className="px-4 py-5 sm:p-6">
                            {error && (
                                <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                                    <p className="text-red-700">{error}</p>
                                </div>
                            )}
                            {success && (
                                <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
                                    <p className="text-green-700">{success}</p>
                                </div>
                            )}

                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;