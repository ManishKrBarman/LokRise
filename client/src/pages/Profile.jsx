import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const Profile = () => {
    const { user, updateProfile, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
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
    const [imageTimestamp, setImageTimestamp] = useState(Date.now());

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
            // For initial load, use the user's profile image with timestamp
            setImagePreview(user.profileImage ? `${user.profileImage}?t=${imageTimestamp}` : null);
        }
    }, [user, imageTimestamp]);

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
                // Update timestamp to force image refresh
                setImageTimestamp(Date.now());
                // Clear the file input
                const fileInput = document.getElementById('profile-image');
                if (fileInput) fileInput.value = '';
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

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <div className="flex-grow bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        {/* Profile Header */}
                        <div className="bg-[var(--primary-color)] px-4 py-5 sm:px-6">
                            <div className="flex items-center">
                                <div className="relative group">
                                    <img
                                        src={imagePreview || (user?.profileImage ? `${user.profileImage}?t=${imageTimestamp}` : `https://placehold.co/100?text=${user?.name?.[0]}`)}
                                        alt={user?.name}
                                        className={`h-16 w-16 rounded-full border-2 border-white object-cover ${uploading ? 'opacity-50' : ''}`}
                                        onError={(e) => {
                                            e.target.onerror = null; // Prevent infinite loop
                                            e.target.src = `https://placehold.co/100?text=${user?.name?.[0]}`;
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
                                    {isEditing && (
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
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;