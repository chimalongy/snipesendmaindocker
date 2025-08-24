'use client';

import { useState, useEffect } from 'react';
import { 
  RiArrowLeftLine, 
  RiMailLine, 
  RiUserLine, 
  RiCheckLine,
  RiAddLine,
  RiCloseLine,
  RiInformationLine,
  RiAlertLine,
  RiCalendarLine,
  RiSendPlaneLine,
  RiListCheck,
  RiPieChartLine
} from 'react-icons/ri';
import Link from 'next/link';
import useUserStore from '@/app/utils/store/user';
import axios from 'axios';
import { apiSumary } from '@/app/utils/apiSummary';
import toast from 'react-hot-toast';

export default function NewOutboundCampaign() {
  const user = useUserStore((state) => state.user);
  const [step, setStep] = useState(1);
  const [userEmails, setUserEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [allocationCount, setAllocationCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    emailList: '',
    assignedEmails: [],
    scheduleType: 'immediate'
  });
  const [emailCount, setEmailCount] = useState(0);

  async function getUserEmails() {
    try {
      const result = await axios.post(apiSumary.get_user_emails, { userId: user.id });
      if (result?.data?.data) {
        setUserEmails(result.data.data.map(email => ({
          ...email,
          daily_usage: email.daily_usage || 0,
          daily_sending_capacity: email.daily_sending_capacity || 0
        })));
      }
    } catch (error) {
      console.error("Failed to fetch user emails:", error);
    }
  }

  useEffect(() => {
    if (user?.id) getUserEmails();
  }, [user?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'emailList') {
      const emails = value.split(/[\n,;]+/).filter(email => email.trim() !== '');
      setEmailCount(emails.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate counts don't exceed limits
    const isValid = formData.assignedEmails.every(assignment => {
      const emailData = userEmails.find(e => e.email_address === assignment.email_address);
      if (!emailData) return false;
      return assignment.count <= (emailData.daily_sending_capacity - emailData.daily_usage);
    });

    if (!isValid) {
      toast.error('One or more email assignments exceed daily limits');
      setIsSubmitting(false);
      return;
    }

    // Process email list
    const allEmails = formData.emailList.split(/[\n,;]+/)
      .filter(email => email.trim() !== '')
      .map(email => email.trim());

    if (allEmails.length === 0) {
      toast.error('Please enter valid email addresses');
      setIsSubmitting(false);
      return;
    }

    // Validate total allocation matches email count
    const totalAllocated = formData.assignedEmails.reduce((sum, email) => sum + email.count, 0);
    if (totalAllocated !== allEmails.length) {
      toast.error(`Total allocated emails (${totalAllocated}) must match total email count (${allEmails.length})`);
      setIsSubmitting(false);
      return;
    }

    // Distribute emails to assigned accounts
    const assignmentsWithLists = [];
    let currentIndex = 0;
    
    for (const assignment of formData.assignedEmails) {
      const emailCount = assignment.count;
      const assignedList = allEmails.slice(currentIndex, currentIndex + emailCount);
      currentIndex += emailCount;
      
      assignmentsWithLists.push({
        emailAssigned: assignment.email_address,
        count: emailCount,
        list: assignedList
      });
    }

    const submissionData = {
      name: formData.name,
      initialList: allEmails,
      assignedEmails: assignmentsWithLists,
      userId: user.id
    };

    console.log('Form submitted:', submissionData);
    
    try {
      // Submit to API
      const result = await axios.post(apiSumary.create_campaign, submissionData);
      if (result.data.success) {
        toast.success('Campaign created successfully!');
        // Reset form or redirect
        setFormData({
          name: '',
          emailList: '',
          assignedEmails: [],
          scheduleType: 'immediate'
        });
        setStep(1);
        setEmailCount(0);
      } else {
        toast.error(result.data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAllocated = formData.assignedEmails.reduce((sum, email) => sum + email.count, 0);
  const unallocatedCount = emailCount - totalAllocated;

  return (
    <div className="pb-[60px] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <Link href="/dashboard/outbounds" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors text-sm sm:text-base">
          <RiArrowLeftLine className="mr-1" /> Back to campaigns
        </Link>
        <div className="text-xs sm:text-sm text-gray-500 flex items-center">
          <RiListCheck className="mr-1" /> Step {step} of 3
        </div>
      </div>

      <div className="flex items-center mb-4 sm:mb-6">
        <RiSendPlaneLine className="text-indigo-600 text-2xl sm:text-3xl mr-2 sm:mr-3" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Create New Outbound Campaign</h1>
      </div>

      {/* Progress Steps */}
      <div className="mb-6 sm:mb-8 bg-indigo-50 p-3 sm:p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-100 border-2 border-indigo-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
              {step > 1 ? <RiCheckLine className="text-sm sm:text-lg" /> : <span className="font-medium text-sm sm:text-base">1</span>}
            </div>
            <span className="text-xs mt-1 sm:mt-2 font-medium">Basic Info</span>
          </div>
          <div className={`flex-1 h-1 mx-1 sm:mx-2 ${step >= 2 ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-100 border-2 border-indigo-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
              {step > 2 ? <RiCheckLine className="text-sm sm:text-lg" /> : <span className="font-medium text-sm sm:text-base">2</span>}
            </div>
            <span className="text-xs mt-1 sm:mt-2 font-medium">Assign Emails</span>
          </div>
          <div className={`flex-1 h-1 mx-1 sm:mx-2 ${step >= 3 ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-100 border-2 border-indigo-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
              <span className="font-medium text-sm sm:text-base">3</span>
            </div>
            <span className="text-xs mt-1 sm:mt-2 font-medium">Review</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl overflow-hidden">
        {step === 1 && (
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center">
              <RiInformationLine className="text-indigo-500 mr-2 text-lg sm:text-xl" />
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Campaign Information</h2>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <RiUserLine className="mr-2 text-gray-400" /> Campaign Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="My Awesome Campaign"
                  required
                />
              </div>

              <div>
                <label htmlFor="emailList" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <RiMailLine className="mr-2 text-gray-400" /> Recipient Email List
                </label>
                <textarea
                  id="emailList"
                  name="emailList"
                  value={formData.emailList}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32 sm:h-40"
                  placeholder="Paste email addresses here, separated by commas, semicolons, or new lines"
                  required
                />
                <div className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center">
                  <RiInformationLine className="mr-1" /> {emailCount} email addresses detected
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 sm:pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.emailList}
                className={`px-4 py-2 sm:px-6 sm:py-2 rounded-lg text-white font-medium flex items-center transition-all ${
                  !formData.name || !formData.emailList 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
                }`}
              >
                Next: Assign Emails <RiArrowLeftLine className="ml-2 transform rotate-180" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center">
              <RiPieChartLine className="text-indigo-500 mr-2 text-lg sm:text-xl" />
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Email Allocation</h2>
            </div>
            
            {/* Allocation Status */}
            <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg border border-indigo-100">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm">
                  <div className="text-xs sm:text-sm font-medium text-indigo-700 flex items-center justify-center">
                    <RiMailLine className="mr-1" /> Total
                  </div>
                  <div className="text-xl sm:text-2xl font-bold mt-1">{emailCount}</div>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm">
                  <div className="text-xs sm:text-sm font-medium text-green-700 flex items-center justify-center">
                    <RiCheckLine className="mr-1" /> Allocated
                  </div>
                  <div className="text-xl sm:text-2xl font-bold mt-1">{totalAllocated}</div>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm">
                  <div className="text-xs sm:text-sm font-medium text-red-700 flex items-center justify-center">
                    <RiAlertLine className="mr-1" /> Unallocated
                  </div>
                  <div className="text-xl sm:text-2xl font-bold mt-1">{unallocatedCount}</div>
                </div>
              </div>
              
              {unallocatedCount > 0 && (
                <div className="mt-2 sm:mt-3 p-2 bg-red-50 text-red-600 rounded text-xs sm:text-sm flex items-center justify-center">
                  <RiAlertLine className="mr-2" /> {unallocatedCount} unallocated emails
                </div>
              )}
              {totalAllocated > emailCount && (
                <div className="mt-2 sm:mt-3 p-2 bg-yellow-50 text-yellow-600 rounded text-xs sm:text-sm flex items-center justify-center">
                  <RiAlertLine className="mr-2" /> Over allocated by {totalAllocated - emailCount}
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-500 flex items-center">
              <RiInformationLine className="mr-1" /> Select sending emails and allocate recipients to each
            </p>

            <div className="space-y-4 sm:space-y-5">
              {/* Email Selection */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                <label htmlFor="email-select" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2 flex items-center">
                  <RiMailLine className="mr-2 text-gray-400" /> Select Sending Email
                </label>
                <select
                  id="email-select"
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                  onChange={(e) => {
                    const selected = userEmails.find(email => email.email_address === e.target.value);
                    if (selected) setSelectedEmail(selected);
                  }}
                >
                  <option value="">-- Select an email --</option>
                  {userEmails.map(email => (
                    <option 
                      key={email.email_address} 
                      value={email.email_address}
                      disabled={formData.assignedEmails.some(e => e.email_address === email.email_address)}
                    >
                      {email.email_address} (Available: {email.daily_sending_capacity - email.daily_usage}/{email.daily_sending_capacity})
                    </option>
                  ))}
                </select>
              </div>

              {/* Allocation Form */}
              {selectedEmail && !formData.assignedEmails.some(e => e.email_address === selectedEmail.email_address) && (
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div>
                      <div className="font-medium flex items-center text-sm sm:text-base">
                        <RiMailLine className="mr-2 text-indigo-500" /> {selectedEmail.email_address}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center">
                        <RiInformationLine className="mr-1" />
                        {selectedEmail.daily_usage} of {selectedEmail.daily_sending_capacity} sent today
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4">
                    <label htmlFor="email-count" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2 flex items-center">
                      <RiAddLine className="mr-2 text-gray-400" /> Emails to allocate
                    </label>
                    <input
                      type="number"
                      id="email-count"
                      min="1"
                      max={Math.min(
                        selectedEmail.daily_sending_capacity - selectedEmail.daily_usage,
                        unallocatedCount
                      )}
                      value={allocationCount}
                      onChange={(e) => setAllocationCount(Math.min(
                        parseInt(e.target.value) || 0,
                        selectedEmail.daily_sending_capacity - selectedEmail.daily_usage,
                        unallocatedCount
                      ))}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <RiInformationLine className="mr-1" />
                      Max {Math.min(
                        selectedEmail.daily_sending_capacity - selectedEmail.daily_usage,
                        unallocatedCount
                      )} available
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (allocationCount > 0) {
                        setFormData(prev => ({
                          ...prev,
                          assignedEmails: [
                            ...prev.assignedEmails,
                            {
                              email_address: selectedEmail.email_address,
                              count: allocationCount
                            }
                          ]
                        }));
                        setSelectedEmail(null);
                        setAllocationCount(0);
                      }
                    }}
                    className="mt-3 sm:mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-md text-sm sm:text-base"
                  >
                    <RiAddLine className="mr-2" /> Add Allocation
                  </button>
                </div>
              )}

              {/* Assigned Emails List */}
              <div className="mt-4 sm:mt-6">
                <h3 className="text-sm sm:text-md font-medium text-gray-900 mb-2 sm:mb-3 flex items-center">
                  <RiListCheck className="mr-2 text-indigo-500" /> Assigned Emails
                </h3>
                
                {formData.assignedEmails.length === 0 ? (
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 text-gray-400 flex items-center justify-center text-xs sm:text-sm">
                    <RiInformationLine className="mr-2" /> No emails assigned yet
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {formData.assignedEmails.map((assignment, index) => {
                      const emailData = userEmails.find(e => e.email_address === assignment.email_address);
                      const maxAvailable = emailData ? emailData.daily_sending_capacity - emailData.daily_usage : 0;

                      return (
                        <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium flex items-center text-sm sm:text-base truncate">
                              <RiMailLine className="mr-2 text-green-500 min-w-[16px]" /> 
                              <span className="truncate">{assignment.email_address}</span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center">
                              <RiInformationLine className="mr-1 min-w-[16px]" />
                              <span>Allocated: {assignment.count} (max {maxAvailable})</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                assignedEmails: prev.assignedEmails.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-red-500 hover:text-red-700 p-1 sm:p-2 rounded-full hover:bg-red-50 transition-colors ml-2"
                            title="Remove allocation"
                          >
                            <RiCloseLine />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4 sm:pt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 rounded-lg text-gray-700 font-medium flex items-center hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                <RiArrowLeftLine className="mr-2" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={unallocatedCount !== 0 || totalAllocated > emailCount}
                className={`px-4 py-2 sm:px-6 sm:py-2 rounded-lg text-white font-medium flex items-center transition-all text-sm sm:text-base ${
                  unallocatedCount !== 0 || totalAllocated > emailCount
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
                }`}
              >
                Next: Review <RiArrowLeftLine className="ml-2 transform rotate-180" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center">
              <RiCheckLine className="text-green-500 mr-2 text-lg sm:text-xl" />
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Review Campaign</h2>
            </div>

            <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                <RiInformationLine className="mr-2 text-indigo-500" /> Campaign Details
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start">
                  <span className="text-gray-500 w-24 sm:w-32 flex items-center text-xs sm:text-sm">
                    <RiUserLine className="mr-2" /> Name:
                  </span>
                  <span className="font-medium text-sm sm:text-base">{formData.name}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 w-24 sm:w-32 flex items-center text-xs sm:text-sm">
                    <RiMailLine className="mr-2" /> Total:
                  </span>
                  <span className="flex items-center text-sm sm:text-base">
                    {emailCount}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 w-24 sm:w-32 block mb-1 sm:mb-2 flex items-center text-xs sm:text-sm">
                    <RiListCheck className="mr-2" /> Assigned:
                  </span>
                  <div className="space-y-2 sm:space-y-3">
                    {formData.assignedEmails.length > 0 ? (
                      formData.assignedEmails.map((assignment, index) => {
                        const emailData = userEmails.find(e => e.email_address === assignment.email_address);
                        const maxAvailable = emailData ? emailData.daily_sending_capacity - emailData.daily_usage : 0;

                        return (
                          <div key={index} className="bg-white p-2 sm:p-3 rounded-md border border-gray-200 shadow-sm">
                            <div className="font-medium flex items-center text-sm sm:text-base">
                              <RiMailLine className="mr-2 text-indigo-500" /> {assignment.email_address}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center">
                              <RiInformationLine className="mr-1" />
                              Will send: {assignment.count} (max {maxAvailable})
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-gray-400 flex items-center text-xs sm:text-sm">
                        <RiAlertLine className="mr-1" /> No emails assigned
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 sm:pt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 rounded-lg text-gray-700 font-medium flex items-center hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                <RiArrowLeftLine className="mr-2" /> Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 sm:px-6 sm:py-2 rounded-lg text-white font-medium flex items-center shadow-md transition-colors text-sm sm:text-base ${
                  isSubmitting ? 'bg-green-500' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <RiSendPlaneLine className="mr-2" /> Create
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}