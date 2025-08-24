'use client';

import { RiMailLine, RiSaveLine, RiArrowGoBackLine } from 'react-icons/ri';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiSumary } from '@/app/utils/apiSummary';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import useSelectedEmailStore from '@/app/utils/store/selectedemail';

export default function EditEmail({ params }) {
  const selectedemail = useSelectedEmailStore((state) => state.selectedemail);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    emailid: "",
    email_address: "",
    password: "",
    sender_name: "",
    signature: "",
    daily_sending_capacity: "1",
  });

  useEffect(() => {
    if (selectedemail) {
      setFormData({
        emailid: selectedemail.id || "",
        email_address: selectedemail.email_address || "",
        password: selectedemail.password || "",
        sender_name: selectedemail.sender_name || "",
        signature: selectedemail.signature || "",
        daily_sending_capacity: selectedemail.daily_sending_capacity?.toString() || "1",
      });
    }
  }, [selectedemail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.sender_name.trim()) {
      toast.error("Please add sender name");
      return false;
    }
    if (!formData.daily_sending_capacity) {
      toast.error("Please add the daily sending capacity.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await axios.post(apiSumary.update_email, {formData});
      toast.success('Email updated successfully');
      // router.push('/dashboard/emails');
    } catch (error) {
      console.error('Failed to update email:', error);
      toast.error(error.response?.data?.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedemail) {
    return <div className="text-center py-10 text-gray-500">Loading email data...</div>;
  }

  return (
    <div className="space-y-6 pb-[60px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Edit Email Account</h2>
          <p className="mt-1 text-sm text-gray-500">
            Update your email account details below.
          </p>
        </div>
        <Link
          href="/dashboard/emails"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 whitespace-nowrap"
        >
          <RiArrowGoBackLine className="mr-2" />
          Back to Email Accounts
        </Link>
      </div>

      {/* Form */}
      <div className="lg:max-w-[600px] mx-auto bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Email Address */}
              <div className="sm:col-span-6">
                <label htmlFor="email_address" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    <RiMailLine className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="email"
                    name="email_address"
                    id="email_address"
                    required
                    disabled
                    value={formData.email_address}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="sm:col-span-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    disabled
                    value={formData.password}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md border p-2"
                  />
                </div>
              </div>

              {/* Sender Name */}
              <div className="sm:col-span-6">
                <label htmlFor="sender_name" className="block text-sm font-medium text-gray-700">
                  Sender Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="sender_name"
                    id="sender_name"
                    value={formData.sender_name}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md border p-2"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    The name that will appear in the "From" field when recipients receive your emails.
                  </p>
                </div>
              </div>

              {/* Signature */}
              <div className="sm:col-span-6">
                <label htmlFor="signature" className="block text-sm font-medium text-gray-700">
                  Signature
                </label>
                <div className="mt-1">
                  <textarea
                    name="signature"
                    id="signature"
                    rows={4}
                    value={formData.signature}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md border p-2"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    This will be appended to the end of your emails.
                  </p>
                </div>
              </div>

              {/* Daily Sending Capacity */}
              <div className="sm:col-span-6">
                <label htmlFor="daily_sending_capacity" className="block text-sm font-medium text-gray-700">
                  Daily Sending Capacity
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="daily_sending_capacity"
                    id="daily_sending_capacity"
                    min="1"
                    required
                    value={formData.daily_sending_capacity}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md border p-2"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    The maximum number of emails this account can send per day.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RiSaveLine className="mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}