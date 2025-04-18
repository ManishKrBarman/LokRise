import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import FormInput from '../components/FormInput';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        phone: '',
        email: '',
        country: 'India'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // Step 1: Basic info, Step 2: OTP verification
    const [otp, setOtp] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 10) {
            setFormData(prev => ({ ...prev, phone: value }));
        }
    };

    const validateForm = () => {
        if (!formData.firstName.trim()) {
            setError('First name is required');
            return false;
        }

        if (!formData.phone || formData.phone.length !== 10) {
            setError('Please enter a valid 10-digit phone number');
            return false;
        }

        if (!formData.email || !formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        // Simulate API call to register user and send OTP
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1500);
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setError('');

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);

        // Simulate API call to verify OTP and complete registration
        setTimeout(() => {
            setLoading(false);
            // Redirect to dashboard or login page after successful registration
            alert('Registration successful! You can now login.');
            // history.push('/login');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center items-center">
                    <img src={logo} alt="Logo" className="h-12 w-auto" />
                    <span className="ml-2 font-bold font-museo text-2xl text-[var(--primary-color)]">Lokrise</span>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create a new account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <Link to="/login" className="font-medium text-[var(--primary-color)] hover:text-[#8b6b4b]">
                        sign in to your account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <FormInput
                                id="firstName"
                                label="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                autoComplete="given-name"
                                placeholder="First Name"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    id="middleName"
                                    label="Middle Name"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                    optional
                                    autoComplete="additional-name"
                                    placeholder="Middle Name"
                                />

                                <FormInput
                                    id="lastName"
                                    label="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    optional
                                    autoComplete="family-name"
                                    placeholder="Last Name"
                                />
                            </div>

                            <FormInput
                                id="phone"
                                label="Phone Number"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                type="tel"
                                required
                                autoComplete="tel"
                                placeholder="10-digit phone number"
                                prefix="+91"
                            />

                            <FormInput
                                id="email"
                                label="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="Email Address"
                            />

                            <FormInput
                                id="country"
                                label="Country"
                                value={formData.country}
                                disabled
                                helperText="Services are currently only available in India"
                            />

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--primary-color)] hover:bg-[#8b6b4b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Register'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <FormInput
                                id="otp"
                                label={`Enter OTP sent to ${formData.email}`}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                required
                                maxLength="6"
                                placeholder="6-digit OTP"
                            />

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--primary-color)] hover:bg-[#8b6b4b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] disabled:opacity-50"
                                >
                                    {loading ? 'Verifying...' : 'Complete Registration'}
                                </button>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="font-medium text-[var(--primary-color)] hover:text-[#8b6b4b] text-sm"
                                >
                                    Change details
                                </button>
                                <span className="px-2 text-gray-400">|</span>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="font-medium text-[var(--primary-color)] hover:text-[#8b6b4b] text-sm"
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;