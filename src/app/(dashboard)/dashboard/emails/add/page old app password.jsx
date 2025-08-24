"use client"

import { useState } from 'react';
import { FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';
import useUserStore from '@/app/utils/store/user';

export default function AddEmailPage() {
  const user = useUserStore((state) => state.user);
  const [formData, setFormData] = useState({
    senderName: '',
    emailAddress: '',
    appPassword: '',
    sendingCapacity: 50,
    signature: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState(null); // New state for API errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    // Clear API error when form is being edited
    if (apiError) setApiError(null);
    setSuccessMessage("");
    
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.senderName.trim()) newErrors.senderName = 'Sender name is required';
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }
    if (!formData.appPassword || formData.appPassword.length < 16) {
      newErrors.appPassword = 'App password must be at least 16 characters';
    }
    if (formData.sendingCapacity < 1 || formData.sendingCapacity > 500) {
      newErrors.sendingCapacity = 'Capacity must be between 1-500';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setApiError(null); // Clear previous API errors
   
    try {
      formData['userId'] = user.id;
      const response = await axios.post('/api/dashboard/emails/add', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccessMessage('Email account added successfully!');
        // Optionally reset form here if needed
        setFormData({
        senderName: '',
        emailAddress: '',
        appPassword: '',
        sendingCapacity: 50,
        signature: '',
      });
      } else {
        throw new Error(response.data.message || 'Failed to add email account');
      }
    } catch (error) {
      console.log('Error submitting form:', error);
      // Set API error message
      setApiError(error.response?.data?.message || 'Failed to add email account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 lg:px-8">
      <div className="lg:max-w-[600px] mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Connect Gmail Account</h1>
          <p className="text-gray-600 mt-2">Add a Gmail address to send emails from your account</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>{successMessage}</div>
          </div>
        )}

        {/* API Error Message */}
        {apiError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md flex items-start">
            <FaExclamationCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>{apiError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sender Name */}
          <div>
            <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-1">
              Sender Name
            </label>
            <input
              type="text"
              id="senderName"
              name="senderName"
              value={formData.senderName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.senderName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.senderName && (
              <p className="mt-1 text-sm text-red-600 flex items-start">
                <FaExclamationCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                <span>{errors.senderName}</span>
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">The name recipients will see when they receive your emails</p>
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="emailAddress"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              placeholder="johndoe@gmail.com"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.emailAddress ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.emailAddress && (
              <p className="mt-1 text-sm text-red-600 flex items-start">
                <FaExclamationCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                <span>{errors.emailAddress}</span>
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">The Gmail address you want to connect</p>
          </div>

          {/* App Password */}
          <div>
            <label htmlFor="appPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Gmail App Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="appPassword"
                name="appPassword"
                value={formData.appPassword}
                onChange={handleChange}
                placeholder="16-character app password"
                minLength="16"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.appPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.appPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-start">
                <FaExclamationCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                <span>{errors.appPassword}</span>
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Generate this in your Google Account &gt; Security &gt; App passwords
              <a 
                href="https://myaccount.google.com/apppasswords" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 ml-1 hover:underline"
              >
                (Learn how)
              </a>
            </p>
          </div>

          {/* Sending Capacity */}
          <div>
            <label htmlFor="sendingCapacity" className="block text-sm font-medium text-gray-700 mb-1">
              Daily Sending Capacity
            </label>
            <input
              type="number"
              id="sendingCapacity"
              name="sendingCapacity"
              value={formData.sendingCapacity}
              onChange={handleChange}
              min="1"
              max="500"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.sendingCapacity ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.sendingCapacity && (
              <p className="mt-1 text-sm text-red-600 flex items-start">
                <FaExclamationCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                <span>{errors.sendingCapacity}</span>
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">Maximum emails this account can send per day (1-500)</p>
          </div>

          {/* Signature */}
          <div>
            <label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-1">
              Email Signature
            </label>
            <textarea
              id="signature"
              name="signature"
              value={formData.signature}
              onChange={handleChange}
              rows="4"
              placeholder=""
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">This will be automatically added to all emails sent from this address</p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </span>
              ) : 'Connect Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}