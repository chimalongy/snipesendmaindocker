'use client';

import {
  RiMailAddLine,
  RiMailLine,
  RiPencilLine,
  RiDeleteBinLine,
  RiSendPlaneFill,
  RiMoreLine
} from 'react-icons/ri';
import { FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import axios from 'axios';
import { apiSumary } from '@/app/utils/apiSummary';
import useUserStore from '@/app/utils/store/user';
import useSelectedEmailStore from '@/app/utils/store/selectedemail';
import toast from 'react-hot-toast';

export default function EmailManagement() {
  const user = useUserStore((state) => state.user);
  const [emails, setEmails] = useState([]);
  const [emailToDelete, setEmailToDelete] = useState(null);
  const [deletingEmailLoader, setDeletingEmailLoader] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const setSelectedEmail = useSelectedEmailStore((state) => state.setSelectedEmail);

  useEffect(() => {
    // Check screen size on mount and resize
    const checkScreenSize = () => {
      setMobileView(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeletingEmailLoader(true);
      const result = await axios.post(apiSumary.delete_email, { email_id: id });

      if (result.data.success) {
        await getUserEmails();
        toast.success("Email deleted");
        setEmailToDelete(null);
      } else {
        console.error("Failed to delete email:", result.data.message);
        toast.error(result.data.message);
      }
    } catch (error) {
      console.error("Error deleting email:", error);
      toast.error("Error deleting email");
    } finally {
      setDeletingEmailLoader(false);
    }
  };

  const getUsagePercentage = (sent, limit) => {
    return Math.min(Math.round((sent / limit) * 100), 100);
  };

  async function getUserEmails() {
    try {
      const result = await axios.post(apiSumary.get_user_emails, { userId: user.id });
      if (result?.data?.data) {
        setEmails(result.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch user emails:", error);
    }
  }

  useEffect(() => {
    if (user?.id) getUserEmails();
  }, [user?.id]);

  const toggleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-6 pb-[60px] ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Manage Email Accounts</h2>
          <p className="text-sm text-gray-500 mt-1">Connected email addresses for sending</p>
        </div>
        <Link
          href="/dashboard/emails/add"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
        >
          <RiMailAddLine className="mr-2" />
          Add New Email
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
        <StatCard
          icon={<RiMailLine className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />}
          label="Total Email Accounts"
          value={emails.length}
          bgColor="bg-indigo-100"
        />
        <StatCard
          icon={<RiSendPlaneFill className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />}
          label="Total Daily Capacity"
          value={`${emails.reduce((sum, email) => sum + email.daily_sending_capacity, 0)} emails/day`}
          bgColor="bg-blue-100"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Connected Email Accounts</h3>
        </div>
        
        {mobileView ? (
          /* Mobile View */
          <div className="divide-y divide-gray-200">
            {emails.length === 0 ? (
              <div className="px-6 py-4 text-center text-gray-500">
                No email accounts found.
              </div>
            ) : (
              emails.map((email) => {
                const usage = getUsagePercentage(email.daily_usage, email.daily_sending_capacity);
                return (
                  <div key={email.id} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-indigo-100 flex items-center justify-center rounded-full">
                          <RiMailLine className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                            {email.email_address}
                          </div>
                          <div className="text-xs text-gray-500">
                            Last used: {email.last_used || 'Never'}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleRowExpansion(email.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <RiMoreLine className="h-5 w-5" />
                      </button>
                    </div>
                    
                    {expandedRow === email.id && (
                      <div className="mt-3 space-y-3">
                        <div className="w-full">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{email.daily_usage} sent</span>
                            <span>{email.daily_sending_capacity} limit</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${usage > 80 ? 'bg-red-500' : 'bg-indigo-500'}`}
                              style={{ width: `${usage}%` }}
                            ></div>
                          </div>
                          {usage > 80 && (
                            <div className="flex items-center mt-1 text-xs text-yellow-600">
                              <FaExclamationTriangle className="mr-1" />
                              High usage
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-3">
                          <Link
                            href={`/dashboard/emails/edit/${email.email_address}`}
                            className="flex-1 inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                            onClick={() => { setSelectedEmail(email); }}
                          >
                            <RiPencilLine className="mr-1" /> Edit
                          </Link>
                          <button
                            onClick={() => setEmailToDelete(email)}
                            className="flex-1 inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            <RiDeleteBinLine className="mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Desktop View */
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
                  <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Usage</th>
                  <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Used</th>
                  <th className="px-4 py-3 sm:px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emails.map((email) => {
                  const usage = getUsagePercentage(email.daily_usage, email.daily_sending_capacity);
                  return (
                    <tr key={email.id}>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-indigo-100 flex items-center justify-center rounded-full">
                            <RiMailLine className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="ml-4 text-sm font-medium text-gray-900">
                            {email.email_address}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full mr-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>{email.daily_usage} sent</span>
                              <span>{email.daily_sending_capacity} limit</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${usage > 80 ? 'bg-red-500' : 'bg-indigo-500'}`}
                                style={{ width: `${usage}%` }}
                              ></div>
                            </div>
                          </div>
                          {usage > 80 && <FaExclamationTriangle className="text-yellow-500" />}
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-500">
                        {email.last_used || 'Never'}
                      </td>
                      <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Link
                          href={`/dashboard/emails/edit/${email.email_address}`}
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                          onClick={() => { setSelectedEmail(email); }}
                        >
                          <RiPencilLine className="mr-1" /> Edit
                        </Link>
                        <button
                          onClick={() => setEmailToDelete(email)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <RiDeleteBinLine className="mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {emails.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No email accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={!!emailToDelete}
        onCancel={() => setEmailToDelete(null)}
        onConfirm={() => handleDelete(emailToDelete?.id)}
        title="Delete Email"
        message={`Are you sure you want to delete ${emailToDelete?.email_address}? This action cannot be undone.`}
        loader={deletingEmailLoader}
      />
    </div>
  );
}

// Reusable StatCard Component
function StatCard({ icon, label, value, bgColor }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-3 py-4 sm:p-6 flex items-center">
        <div className={`flex-shrink-0 ${bgColor} p-2 sm:p-3 rounded-md`}>
          {icon}
        </div>
        <div className="ml-3 sm:ml-5">
          <div className="text-xs sm:text-sm text-gray-500">{label}</div>
          <div className="text-lg sm:text-2xl font-semibold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );
}