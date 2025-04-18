import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import FormInput from '../components/FormInput';
import { FiCheckCircle, FiInfo } from 'react-icons/fi';
import { authAPI, uploadAPI } from '../services/api';

const BecomeSeller = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        // Personal Information
        fullName: '',
        email: '',
        phone: '',
        profileImage: null,

        // Business Information
        businessName: '',
        gstin: '',
        businessType: 'individual', // individual, partnership, company
        businessCategory: '',
        businessDescription: '',
        establishedYear: '',

        // Address Information
        addressLine1: '',
        addressLine2: '',
        city: '',
        district: '',
        state: '',
        pinCode: '',

        // Payment Information
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        branchName: '',
        upiId: '',

        // Identity Verification
        panNumber: '',
        aadharNumber: '',
        idProofDocument: null,
        addressProofDocument: null,

        // Terms
        agreeToTerms: false,
        agreeToSellerPolicy: false,
    });

    const [formStep, setFormStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files[0]
            });
        } else if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleNextStep = () => {
        if (formStep < 5) {
            setFormStep(formStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrevStep = () => {
        if (formStep > 1) {
            setFormStep(formStep - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            // Create a FormData object to handle file uploads
            const submitFormData = new FormData();

            // Add all form fields to FormData
            Object.keys(formData).forEach(key => {
                if (key !== 'profileImage' && key !== 'idProofDocument' && key !== 'addressProofDocument') {
                    submitFormData.append(key, formData[key]);
                }
            });

            // Upload files if they exist
            let profileImageUrl = null;
            let idProofUrl = null;
            let addressProofUrl = null;

            if (formData.profileImage) {
                const profileImageResponse = await uploadAPI.uploadFile(formData.profileImage, 'profile');
                profileImageUrl = profileImageResponse.data.url;
                submitFormData.append('profileImageUrl', profileImageUrl);
            }

            if (formData.idProofDocument) {
                const idProofResponse = await uploadAPI.uploadFile(formData.idProofDocument, 'identity');
                idProofUrl = idProofResponse.data.url;
                submitFormData.append('idProofUrl', idProofUrl);
            }

            if (formData.addressProofDocument) {
                const addressProofResponse = await uploadAPI.uploadFile(formData.addressProofDocument, 'address');
                addressProofUrl = addressProofResponse.data.url;
                submitFormData.append('addressProofUrl', addressProofUrl);
            }

            // Submit the seller registration form
            const response = await authAPI.registerSeller(submitFormData);

            setIsSubmitting(false);
            setSuccess('Your seller application has been submitted successfully! We will review it and get back to you shortly.');

            // Redirect after a short delay to show success message
            setTimeout(() => {
                navigate('/seller/pending');
            }, 3000);
        } catch (err) {
            setIsSubmitting(false);
            setError(err.response?.data?.message || 'Failed to register. Please try again later.');
        }
    };

    const renderFormStep = () => {
        switch (formStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>

                        <FormInput
                            label="Full Name"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                        />

                        <FormInput
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="you@example.com"
                            required
                        />

                        <FormInput
                            label="Phone Number"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Your 10-digit phone number"
                            required
                        />

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Profile Image (Optional)</label>
                            <input
                                type="file"
                                name="profileImage"
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                accept="image/*"
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-6">Business Information</h2>

                        <FormInput
                            label="Business Name"
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            placeholder="Your business name"
                            required
                        />

                        <FormInput
                            label="GSTIN (Optional for small businesses)"
                            type="text"
                            name="gstin"
                            value={formData.gstin}
                            onChange={handleInputChange}
                            placeholder="15-digit GSTIN"
                        />

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Business Type</label>
                            <select
                                name="businessType"
                                value={formData.businessType}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                required
                            >
                                <option value="individual">Individual/Sole Proprietor</option>
                                <option value="partnership">Partnership</option>
                                <option value="company">Private/Public Company</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Business Category</label>
                            <select
                                name="businessCategory"
                                value={formData.businessCategory}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                required
                            >
                                <option value="">Select a category</option>
                                <option value="electronics">Electronics</option>
                                <option value="clothing">Clothing & Apparel</option>
                                <option value="home">Home & Kitchen</option>
                                <option value="beauty">Beauty & Personal Care</option>
                                <option value="books">Books & Education</option>
                                <option value="handmade">Handmade & Crafts</option>
                                <option value="grocery">Grocery & Gourmet</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Business Description</label>
                            <textarea
                                name="businessDescription"
                                value={formData.businessDescription}
                                onChange={handleInputChange}
                                placeholder="Tell us about your business and products"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                rows="4"
                                required
                            ></textarea>
                        </div>

                        <FormInput
                            label="Year Established"
                            type="number"
                            name="establishedYear"
                            value={formData.establishedYear}
                            onChange={handleInputChange}
                            placeholder="YYYY"
                            min="1900"
                            max={new Date().getFullYear()}
                        />
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-6">Address Information</h2>

                        <FormInput
                            label="Address Line 1"
                            type="text"
                            name="addressLine1"
                            value={formData.addressLine1}
                            onChange={handleInputChange}
                            placeholder="Street address, P.O. box, company name"
                            required
                        />

                        <FormInput
                            label="Address Line 2 (Optional)"
                            type="text"
                            name="addressLine2"
                            value={formData.addressLine2}
                            onChange={handleInputChange}
                            placeholder="Apartment, suite, unit, building, floor, etc."
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                label="City/Village"
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="City or village"
                                required
                            />

                            <FormInput
                                label="District"
                                type="text"
                                name="district"
                                value={formData.district}
                                onChange={handleInputChange}
                                placeholder="District"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">State</label>
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                    required
                                >
                                    <option value="">Select State</option>
                                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                    <option value="Assam">Assam</option>
                                    <option value="Bihar">Bihar</option>
                                    <option value="Chhattisgarh">Chhattisgarh</option>
                                    <option value="Goa">Goa</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Haryana">Haryana</option>
                                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                                    <option value="Jharkhand">Jharkhand</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Kerala">Kerala</option>
                                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Manipur">Manipur</option>
                                    <option value="Meghalaya">Meghalaya</option>
                                    <option value="Mizoram">Mizoram</option>
                                    <option value="Nagaland">Nagaland</option>
                                    <option value="Odisha">Odisha</option>
                                    <option value="Punjab">Punjab</option>
                                    <option value="Rajasthan">Rajasthan</option>
                                    <option value="Sikkim">Sikkim</option>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Telangana">Telangana</option>
                                    <option value="Tripura">Tripura</option>
                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                    <option value="Uttarakhand">Uttarakhand</option>
                                    <option value="West Bengal">West Bengal</option>
                                    <option value="Delhi">Delhi</option>
                                </select>
                            </div>

                            <FormInput
                                label="PIN Code"
                                type="text"
                                name="pinCode"
                                value={formData.pinCode}
                                onChange={handleInputChange}
                                placeholder="6-digit PIN code"
                                minLength="6"
                                maxLength="6"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Address Proof Document</label>
                            <input
                                type="file"
                                name="addressProofDocument"
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                accept=".pdf,.jpg,.jpeg,.png"
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Upload a utility bill, rental agreement, or any government-issued document with your address (PDF, JPG, PNG)
                            </p>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-6">Payment & Banking Information</h2>

                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <FiInfo className="h-5 w-5 text-blue-500" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700">
                                        Your banking details are secure and will only be used for payments related to your seller activities on LokRise.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <FormInput
                            label="Account Holder Name"
                            type="text"
                            name="accountHolderName"
                            value={formData.accountHolderName}
                            onChange={handleInputChange}
                            placeholder="Name as it appears on your bank account"
                            required
                        />

                        <FormInput
                            label="Account Number"
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleInputChange}
                            placeholder="Your bank account number"
                            required
                        />

                        <FormInput
                            label="IFSC Code"
                            type="text"
                            name="ifscCode"
                            value={formData.ifscCode}
                            onChange={handleInputChange}
                            placeholder="11-character IFSC code"
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                label="Bank Name"
                                type="text"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleInputChange}
                                placeholder="Your bank's name"
                                required
                            />

                            <FormInput
                                label="Branch Name"
                                type="text"
                                name="branchName"
                                value={formData.branchName}
                                onChange={handleInputChange}
                                placeholder="Your bank branch"
                                required
                            />
                        </div>

                        <FormInput
                            label="UPI ID"
                            type="text"
                            name="upiId"
                            value={formData.upiId}
                            onChange={handleInputChange}
                            placeholder="Your UPI ID for quick payments (e.g., name@upi)"
                            required
                        />
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-6">Identity Verification & Agreement</h2>

                        <FormInput
                            label="PAN Number"
                            type="text"
                            name="panNumber"
                            value={formData.panNumber}
                            onChange={handleInputChange}
                            placeholder="10-character PAN"
                            required
                        />

                        <FormInput
                            label="Aadhar Number (Last 4 digits only)"
                            type="text"
                            name="aadharNumber"
                            value={formData.aadharNumber}
                            onChange={handleInputChange}
                            placeholder="Last 4 digits of your Aadhar"
                            maxLength="4"
                            required
                        />

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">ID Proof Document</label>
                            <input
                                type="file"
                                name="idProofDocument"
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                accept=".pdf,.jpg,.jpeg,.png"
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Upload your PAN card, Aadhar card, or any government-issued ID (PDF, JPG, PNG)
                            </p>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="agreeToTerms"
                                        name="agreeToTerms"
                                        type="checkbox"
                                        checked={formData.agreeToTerms}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="agreeToTerms" className="text-gray-700">
                                        I agree to the {" "}
                                        <a href="/terms" className="text-[var(--primary-color)] underline">
                                            Terms and Conditions
                                        </a>{" "}
                                        and {" "}
                                        <a href="/privacy" className="text-[var(--primary-color)] underline">
                                            Privacy Policy
                                        </a>
                                        .
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="agreeToSellerPolicy"
                                        name="agreeToSellerPolicy"
                                        type="checkbox"
                                        checked={formData.agreeToSellerPolicy}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="agreeToSellerPolicy" className="text-gray-700">
                                        I agree to the {" "}
                                        <a href="/seller-policy" className="text-[var(--primary-color)] underline">
                                            Seller Policy
                                        </a>{" "}
                                        and confirm that the information provided is accurate.
                                    </label>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    const renderProgressBar = () => {
        const steps = [
            "Personal Info",
            "Business Info",
            "Address",
            "Banking",
            "Verification"
        ];

        return (
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`flex flex-col items-center ${index + 1 <= formStep ? "text-[var(--primary-color)]" : "text-gray-400"}`}
                        >
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-1 ${index + 1 <= formStep ? "bg-[var(--primary-color)] text-white" : "bg-gray-200 text-gray-500"}`}>
                                {index + 1 < formStep ? <FiCheckCircle className="w-5 h-5" /> : index + 1}
                            </div>
                            <span className={`text-xs hidden md:block ${index + 1 <= formStep ? "text-[var(--primary-color)]" : "text-gray-500"}`}>
                                {step}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="hidden md:flex mt-1 mb-6">
                    <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-1 bg-[var(--primary-color)]"
                            style={{ width: `${((formStep - 1) / 4) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <NavBar />

            <div className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        Become a Seller on LokRise
                    </h1>

                    {renderProgressBar()}

                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <FiCheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">{success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {renderFormStep()}

                        <div className="flex justify-between mt-10">
                            {formStep > 1 && (
                                <button
                                    type="button"
                                    onClick={handlePrevStep}
                                    className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300"
                                >
                                    Previous
                                </button>
                            )}

                            {formStep < 5 ? (
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="ml-auto bg-[var(--primary-color)] text-white py-3 px-8 rounded-lg hover:bg-opacity-90 transition duration-300"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="ml-auto bg-[var(--primary-color)] text-white py-3 px-8 rounded-lg hover:bg-opacity-90 transition duration-300"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="max-w-3xl mx-auto mt-8 p-6 bg-blue-50 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">What happens next?</h3>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                                <div className="absolute h-5 w-5 bg-blue-200 rounded-full"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-medium text-blue-800">1</span>
                                </div>
                            </div>
                            <p className="ml-3 text-gray-700">Our team will review your application (usually within 24-48 hours)</p>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                                <div className="absolute h-5 w-5 bg-blue-200 rounded-full"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-medium text-blue-800">2</span>
                                </div>
                            </div>
                            <p className="ml-3 text-gray-700">You'll receive an email notification about your application status</p>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                                <div className="absolute h-5 w-5 bg-blue-200 rounded-full"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-medium text-blue-800">3</span>
                                </div>
                            </div>
                            <p className="ml-3 text-gray-700">Once approved, you can start setting up your store and listing products</p>
                        </li>
                    </ul>
                </div>
            </div>

            <Footer bgcolor="bg-gray-800" />
        </div>
    );
};

export default BecomeSeller;