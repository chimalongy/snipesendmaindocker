"use client"

import { useState } from 'react';
import { FaExclamationCircle, FaGoogle } from 'react-icons/fa';
import axios from 'axios';
import useUserStore from '@/app/utils/store/user';

export default function AddEmailPage() {
  const user = useUserStore((state) => state.user);
  const [formData, setFormData] = useState({
    senderName: '',
    emailAddress: '',
    sendingCapacity: 50,
    signature: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
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
    if (formData.sendingCapacity < 1 || formData.sendingCapacity > 500) {
      newErrors.sendingCapacity = 'Capacity must be between 1-500';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const initiateGmailAuth = async () => {
  setIsConnecting(true);
   let requestbody={
    sender_name:formData.senderName,
    email_address:formData.emailAddress,
    sending_capacity:formData.sendingCapacity,
    signature:formData.signature,
    user_id:user.id
   }

console.log(requestbody)
  
  try {
    const response = await axios.get('/api/auth/gmail/connect', {
      params: requestbody
    })
    if (response.data.authUrl) {
      window.location.href = response.data.authUrl;
    } else {
      throw new Error('Failed to get Google auth URL');
    }
  } catch (error) {
    setApiError(error.response?.data?.message || 'Failed to connect with Gmail');
  } finally {
    setIsConnecting(false);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setApiError(null);
   
    try {
      formData['userId'] = user.id;
      const response = await axios.post('/api/dashboard/emails/add', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccessMessage('Email account added successfully!');
        setFormData({
          senderName: '',
          emailAddress: '',
          sendingCapacity: 50,
          signature: '',
        });
      } else {
        throw new Error(response.data.message || 'Failed to add email account');
      }
    } catch (error) {
      console.log('Error submitting form:', error);
      setApiError(error.response?.data?.message || 'Failed to add email account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 lg:px-8">
      <div className="lg:max-w-[600px] mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Connect Gmail Account</h1>
          <p className="text-gray-600 mt-2">Securely connect your Gmail account using Google OAuth</p>
        </div>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>{successMessage}</div>
          </div>
        )}

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





 {/* Gmail Connection Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={initiateGmailAuth}
              disabled={isConnecting || !formData.emailAddress}
              className={`w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isConnecting ? 'opacity-75 cursor-not-allowed' : ''
              } ${!formData.emailAddress ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isConnecting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </span>
              ) : (
                <>
                  <FaGoogle className="w-5 h-5 mr-2 text-red-500" />
                  Connect with Google
                </>
              )}
            </button>
            <p className="mt-2 text-xs text-gray-500">
              You'll be redirected to Google to securely authorize access to your account
            </p>
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
                  Saving...
                </span>
              ) : 'Save Email Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}