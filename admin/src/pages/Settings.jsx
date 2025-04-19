import React, { useState } from 'react';
import { adminAPI } from '../services/api';
import { FiSave, FiAlertCircle } from 'react-icons/fi';

const Settings = () => {
    const [generalSettings, setGeneralSettings] = useState({
        siteName: 'LokRise',
        siteDescription: 'Local vendor marketplace',
        contactEmail: 'support@lokrise.com',
        contactPhone: '+91 9876543210',
        facebookLink: 'https://facebook.com/lokrise',
        twitterLink: 'https://twitter.com/lokrise',
        instagramLink: 'https://instagram.com/lokrise'
    });

    const [emailSettings, setEmailSettings] = useState({
        smtpHost: 'smtp.example.com',
        smtpPort: '587',
        smtpUser: 'notifications@lokrise.com',
        smtpPass: '********',
        fromEmail: 'noreply@lokrise.com',
        fromName: 'LokRise Team'
    });

    const [paymentSettings, setPaymentSettings] = useState({
        currencyCode: 'INR',
        currencySymbol: '₹',
        razorpayKeyId: 'rzp_test_xxxxxxxxxxx',
        razorpayKeySecret: '********************',
        stripePublishableKey: 'pk_test_xxxxxxxxxxx',
        stripeSecretKey: '********************',
        paymentGateways: ['razorpay', 'stripe', 'cod']
    });

    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const handleGeneralSettingsChange = (e) => {
        const { name, value } = e.target;
        setGeneralSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEmailSettingsChange = (e) => {
        const { name, value } = e.target;
        setEmailSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePaymentSettingsChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'paymentGateways') {
            const updatedGateways = [...paymentSettings.paymentGateways];
            if (checked) {
                updatedGateways.push(value);
            } else {
                const index = updatedGateways.indexOf(value);
                if (index > -1) {
                    updatedGateways.splice(index, 1);
                }
            }

            setPaymentSettings(prev => ({
                ...prev,
                paymentGateways: updatedGateways
            }));
        } else {
            setPaymentSettings(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSaveSettings = async (settingType) => {
        setSaving(true);
        setSuccessMessage('');
        setError('');

        try {
            let response;

            switch (settingType) {
                case 'general':
                    response = await adminAPI.updateSettings('general', generalSettings);
                    break;
                case 'email':
                    response = await adminAPI.updateSettings('email', emailSettings);
                    break;
                case 'payment':
                    response = await adminAPI.updateSettings('payment', paymentSettings);
                    break;
                default:
                    throw new Error('Invalid setting type');
            }

            setSuccessMessage(`${settingType.charAt(0).toUpperCase() + settingType.slice(1)} settings updated successfully!`);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (err) {
            setError(`Failed to save ${settingType} settings: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-6">Admin Settings</h1>

            {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                    <div className="flex">
                        <div>
                            <p className="text-sm text-green-700">{successMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FiAlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* General Settings */}
                <div className="admin-card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium">General Settings</h2>
                        <button
                            onClick={() => handleSaveSettings('general')}
                            className="btn btn-primary flex items-center"
                            disabled={saving}
                        >
                            {saving ? (
                                <>Saving...</>
                            ) : (
                                <>
                                    <FiSave className="mr-2" /> Save Changes
                                </>
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="form-label">Site Name</label>
                            <input
                                type="text"
                                name="siteName"
                                value={generalSettings.siteName}
                                onChange={handleGeneralSettingsChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">Site Description</label>
                            <input
                                type="text"
                                name="siteDescription"
                                value={generalSettings.siteDescription}
                                onChange={handleGeneralSettingsChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">Contact Email</label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={generalSettings.contactEmail}
                                onChange={handleGeneralSettingsChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">Contact Phone</label>
                            <input
                                type="text"
                                name="contactPhone"
                                value={generalSettings.contactPhone}
                                onChange={handleGeneralSettingsChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">Facebook Link</label>
                            <input
                                type="url"
                                name="facebookLink"
                                value={generalSettings.facebookLink}
                                onChange={handleGeneralSettingsChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">Twitter Link</label>
                            <input
                                type="url"
                                name="twitterLink"
                                value={generalSettings.twitterLink}
                                onChange={handleGeneralSettingsChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">Instagram Link</label>
                            <input
                                type="url"
                                name="instagramLink"
                                value={generalSettings.instagramLink}
                                onChange={handleGeneralSettingsChange}
                                className="form-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Email Settings */}
                <div className="admin-card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium">Email Settings</h2>
                        <button
                            onClick={() => handleSaveSettings('email')}
                            className="btn btn-primary flex items-center"
                            disabled={saving}
                        >
                            {saving ? (
                                <>Saving...</>
                            ) : (
                                <>
                                    <FiSave className="mr-2" /> Save Changes
                                </>
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="form-label">SMTP Host</label>
                            <input
                                type="text"
                                name="smtpHost"
                                value={emailSettings.smtpHost}
                                onChange={handleEmailSettingsChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">SMTP Port</label>
                            <input
                                type="text"
                                name="smtpPort"
                                value={emailSettings.smtpPort}
                                onChange={handleEmailSettingsChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">SMTP Username</label>
                            <input
                                type="text"
                                name="smtpUser"
                                value={emailSettings.smtpUser}
                                onChange={handleEmailSettingsChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">SMTP Password</label>
                            <input
                                type="password"
                                name="smtpPass"
                                value={emailSettings.smtpPass}
                                onChange={handleEmailSettingsChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">From Email</label>
                            <input
                                type="email"
                                name="fromEmail"
                                value={emailSettings.fromEmail}
                                onChange={handleEmailSettingsChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">From Name</label>
                            <input
                                type="text"
                                name="fromName"
                                value={emailSettings.fromName}
                                onChange={handleEmailSettingsChange}
                                className="form-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Settings */}
                <div className="admin-card">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium">Payment Settings</h2>
                        <button
                            onClick={() => handleSaveSettings('payment')}
                            className="btn btn-primary flex items-center"
                            disabled={saving}
                        >
                            {saving ? (
                                <>Saving...</>
                            ) : (
                                <>
                                    <FiSave className="mr-2" /> Save Changes
                                </>
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="form-label">Currency Code</label>
                            <input
                                type="text"
                                name="currencyCode"
                                value={paymentSettings.currencyCode}
                                onChange={handlePaymentSettingsChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">Currency Symbol</label>
                            <input
                                type="text"
                                name="currencySymbol"
                                value={paymentSettings.currencySymbol}
                                onChange={handlePaymentSettingsChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">Razorpay Key ID</label>
                            <input
                                type="text"
                                name="razorpayKeyId"
                                value={paymentSettings.razorpayKeyId}
                                onChange={handlePaymentSettingsChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">Razorpay Key Secret</label>
                            <input
                                type="password"
                                name="razorpayKeySecret"
                                value={paymentSettings.razorpayKeySecret}
                                onChange={handlePaymentSettingsChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">Stripe Publishable Key</label>
                            <input
                                type="text"
                                name="stripePublishableKey"
                                value={paymentSettings.stripePublishableKey}
                                onChange={handlePaymentSettingsChange}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">Stripe Secret Key</label>
                            <input
                                type="password"
                                name="stripeSecretKey"
                                value={paymentSettings.stripeSecretKey}
                                onChange={handlePaymentSettingsChange}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="form-label">Payment Gateways</label>
                        <div className="flex flex-wrap gap-4 mt-2">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="razorpay"
                                    name="paymentGateways"
                                    value="razorpay"
                                    checked={paymentSettings.paymentGateways.includes('razorpay')}
                                    onChange={handlePaymentSettingsChange}
                                    className="mr-2 h-4 w-4"
                                />
                                <label htmlFor="razorpay">Razorpay</label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="stripe"
                                    name="paymentGateways"
                                    value="stripe"
                                    checked={paymentSettings.paymentGateways.includes('stripe')}
                                    onChange={handlePaymentSettingsChange}
                                    className="mr-2 h-4 w-4"
                                />
                                <label htmlFor="stripe">Stripe</label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="cod"
                                    name="paymentGateways"
                                    value="cod"
                                    checked={paymentSettings.paymentGateways.includes('cod')}
                                    onChange={handlePaymentSettingsChange}
                                    className="mr-2 h-4 w-4"
                                />
                                <label htmlFor="cod">Cash on Delivery</label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="upi"
                                    name="paymentGateways"
                                    value="upi"
                                    checked={paymentSettings.paymentGateways.includes('upi')}
                                    onChange={handlePaymentSettingsChange}
                                    className="mr-2 h-4 w-4"
                                />
                                <label htmlFor="upi">UPI</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;