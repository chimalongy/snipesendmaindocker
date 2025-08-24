'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  RiArrowLeftLine,
  RiSendPlaneLine,
  RiMailLine,
  RiCalendar2Line,
  RiTimer2Line,
  RiMailAddLine,
  RiMailCheckLine,
  RiTimeLine
} from 'react-icons/ri';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import useSelectedOutboundStore from '@/app/utils/store/selectedoutbound';
import useUserStore from '@/app/utils/store/user';
import toast from 'react-hot-toast';
import { apiSumary } from '@/app/utils/apiSummary';
import axios from 'axios';
import { hasISOTimdPassed } from '@/app/utils/globalfunctions';

function convertTo24Hour(time12h) {
  if (!time12h) return '';

  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  return `${String(hours).padStart(2, '0')}:${minutes}`;
}

export default function NewScheduledTask() {
  const params = useParams();
  const router = useRouter();
  const selectedoutbound = useSelectedOutboundStore((state) => state.selectedoutbound);
  const user = useUserStore((state) => state.user)
  const [outboundTasks, setOutboundTasks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current date and time
  const now = useMemo(() => new Date(), []);
  const currentDate = now.toISOString().split('T')[0];
  const currentTime24 = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Convert to 12-hour format for display
  const currentHour = now.getHours();
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentAmpm = currentHour >= 12 ? 'PM' : 'AM';
  const currentHours12 = currentHour % 12 || 12;
  const currentTime12hr = `${currentHours12}:${currentMinutes} ${currentAmpm}`;

  const [formData, setFormData] = useState({
    taskType: 'new',
    subject: '',
    body: '',
    scheduledDate: currentDate,
    scheduledTime: currentTime12hr,
    sendingSpeed: 5
  });

  const [uniqueTaskNameCount, setUniqueTaskNameCount] = useState(0)



  function countUniqueTaskNames(tasks) {
    const uniqueTaskNames = new Set();

    tasks.forEach(task => {
      if (task.data && (task?.data?.taskname|| task.data.task_name)) {
        uniqueTaskNames.add(task?.data?.taskname||task.data.task_name);
      }
    });

    return uniqueTaskNames.size;
  }


  async function getOutboundTasks() {
    try {
      const result = await axios.post(apiSumary.get_outbound_tasks, {
        outboundname: selectedoutbound.outbound_name,
      });
      if (result.data.success) {
        console.log(result.data)
        setOutboundTasks(result.data.data);
        setUniqueTaskNameCount(countUniqueTaskNames(result.data.data))
      } else {
        toast.error(result.data.message);
      }
    } catch (error) {
      console.error('Error fetching outbound tasks:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }

  useEffect(() => {
    if (selectedoutbound?.outbound_id) {
      getOutboundTasks();
    }
  }, [selectedoutbound?.outbound_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'scheduledDate') {
      const newDate = value;
      const isToday = newDate === currentDate;

      setFormData(prev => ({
        ...prev,
        [name]: value,
        scheduledTime: isToday && convertTo24Hour(prev.scheduledTime) < currentTime24 ? currentTime12hr : prev.scheduledTime
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert to 24-hour for comparison
    const time24hr = convertTo24Hour(formData.scheduledTime);
    // Validate time if date is today
    if (formData.scheduledDate === currentDate && time24hr < currentTime24) {
      toast.error('Please select a future time for today');
      return;
    }

    if (!formData.subject.trim() || !formData.body.trim()) {
      toast.error('Subject and body cannot be empty');
      return;
    }

    setIsSubmitting(true);

   

 

    try {
      const payload = {
        userId: user.id,
        outboundId: selectedoutbound.outbound_id,
        taskName: `Task ${uniqueTaskNameCount + 1}`,
        taskType: formData.taskType,
        taskSubject: formData.subject,
        taskBody: formData.body,
        taskScheduleDate: formData.scheduledDate,
        taskScheduleTime: formData.scheduledTime, // Includes AM/PM
        taskSendingRate: formData.sendingSpeed,
        taskStatus: 'scheduled'
      };
      console.log(payload)

      const result = await axios.post(apiSumary.add_new_task, payload);

      if (result.data.success) {
        toast.success('Task scheduled successfully!');
        router.push(`/dashboard/outbounds/${params.id}`);
      } else {
        throw new Error(result.data.message || 'Failed to schedule task');
      }
    } catch (error) {
      console.log('Error scheduling task:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-[60px] max-w-2xl mx-auto  sm:px-0">
      {/* Header */}
      <div className="mb-6 pt-4">
        <Link
          href={`/dashboard/outbounds/${params.id}`}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <RiArrowLeftLine className="mr-1" />
          Back to campaign
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <RiMailAddLine className="text-indigo-600" />
          New Scheduled Task
        </h1>
        <p className="text-gray-600">
          For: <span className="font-medium">{selectedoutbound?.outbound_name}</span> | Task {uniqueTaskNameCount + 1}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-6 border border-gray-100"
      >
        {/* Task Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <RiMailCheckLine className="text-gray-500" />
            Task Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, taskType: 'new' }))}
              className={`p-3 border rounded-lg text-center transition-all ${formData.taskType === 'new'
                ? 'border-indigo-500 bg-indigo-50 shadow-inner'
                : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
            >
              <div className="font-medium flex items-center justify-center gap-2">
                <RiMailLine className="text-indigo-600" />
                New Email
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, taskType: 'followup', }))
                let prevsubject = outboundTasks[0].data?.taskSubject?.trim() ||outboundTasks[0].data?.task_subject?.trim()

                setFormData((prev) => ({ ...prev, taskType: 'followup', }))
                setFormData((prev) => ({ ...prev, subject: prevsubject, }))
              }}
              className={`p-3 border rounded-lg text-center transition-all ${formData.taskType === 'followup'
                ? 'border-indigo-500 bg-indigo-50 shadow-inner'
                : 'border-gray-300 hover:border-gray-400 bg-white'
                } ${outboundTasks.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={outboundTasks.length === 0}
              title={outboundTasks.length === 0 ? "No previous tasks available for follow-up" : ""}
            >
              <div className="font-medium flex items-center justify-center gap-2">
                <RiMailCheckLine className="text-indigo-600" />
                Follow Up
              </div>
            </button>
          </div>
          {outboundTasks.length === 0 && formData.taskType === 'followup' && (
            <p className="text-sm text-amber-600 mt-1">No previous tasks available for follow-up</p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <RiMailLine className="text-gray-500" />
            Email Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder="Enter email subject"
            required
            readOnly={formData.taskType === 'followup'}
          />
        </div>

        {/* Body */}
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <RiMailLine className="text-gray-500" />
            Email Body
          </label> 
          <textarea
            id="body"
            name="body"
            rows={8}
            value={formData.body}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder="Write your email content here..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">Supports basic HTML formatting</p>
        </div>

        {/* Schedule & Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <RiCalendar2Line className="text-indigo-600" />
            Scheduling Options
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <RiCalendar2Line className="text-gray-500" />
                Date
              </label>
              <input
                type="date"
                id="scheduledDate"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                min={currentDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <RiTimeLine className="text-gray-500" />
                Time
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  id="scheduledTime"
                  name="scheduledTime"
                  value={convertTo24Hour(formData.scheduledTime)}
                  onChange={(e) => {
                    const time24 = e.target.value;
                    const [hours, minutes] = time24.split(':');
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    const hours12 = hours % 12 || 12;
                    const time12hr = `${hours12}:${minutes} ${ampm}`;
                    setFormData(prev => ({ ...prev, scheduledTime: time12hr }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              {formData.scheduledDate === currentDate && (
                <p className="text-xs text-gray-500 mt-1">Must be after {currentTime12hr}</p>
              )}
            </div>
          </div>

          {/* Sending Speed */}
          <div>
            <label htmlFor="sendingSpeed" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <RiTimer2Line className="text-gray-500" />
              Sending Speed
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="sendingSpeed"
                name="sendingSpeed"
                min="1"
                max="60"
                value={formData.sendingSpeed}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 min-w-[40px]">
                {formData.sendingSpeed} sec
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Controls how quickly emails are sent (1 = fastest, 60 = slowest)
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-all ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scheduling...
              </>
            ) : (
              <>
                <RiSendPlaneLine className="mr-2" />
                Schedule Task
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}