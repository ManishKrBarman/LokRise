import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { resetPassword } = useAuth();

    // Parse token and email from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const email = queryParams.get('email');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Check if token exists
    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token. Please request a new password reset link.');
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.password) {
            setError('Password is required');
            return false;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Call the resetPassword function from AuthContext
            const result = await resetPassword(token, formData.password, email);

            if (result.success) {
                setSuccess(true);
                // Redirect to login page after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(result.error || 'Password reset failed. Please try again.');
            }
        } catch (err) {
            console.error('Reset password error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center items-center">
                    <img src={logo} alt="Logo" className="h-12 w-auto" />
                    <span className="ml-2 font-bold font-museo text-2xl text-[var(--primary-color)]">Lokrise</span>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Reset your password
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {success ? (
                        <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
                            <p className="text-sm text-green-700">
                                Password reset successful! You will be redirected to the login page in a few seconds.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <FormInput
                                id="password"
                                name="password"
                                label="New Password"
                                value={formData.password}
                                onChange={handleChange}
                                type="password"
                                required
                                autoComplete="new-password"
                                placeholder="Enter your new password"
                                helperText="Password must be at least 8 characters"
                            />

                            <FormInput
                                id="confirmPassword"
                                name="confirmPassword"
                                label="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                type="password"
                                required
                                autoComplete="new-password"
                                placeholder="Confirm your new password"
                            />

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading || !token}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--primary-color)] hover:bg-[#8b6b4b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Reset Password'}
                                </button>
                            </div>

                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="font-medium text-[var(--primary-color)] hover:text-[#8b6b4b] text-sm"
                                >
                                    Back to login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;