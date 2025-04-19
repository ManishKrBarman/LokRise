import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const result = await updateProfile(formData);
            if (result.success) {
                setSuccess('Profile updated successfully');
                setIsEditing(false);
            } else {
                setError(result.error || 'Failed to update profile');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error('Profile update error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-[var(--primary-color)] px-4 py-5 sm:px-6">
                        <div className="flex items-center">
                            <img
                                src={user?.profileImage || `https://placehold.co/100?text=${user?.name?.[0]}`}
                                alt={user?.name}
                                className="h-16 w-16 rounded-full border-2 border-white"
                            />
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
    );
};

export default Profile;