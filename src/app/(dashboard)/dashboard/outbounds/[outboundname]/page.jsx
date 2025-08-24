'use client';

import { RiMailSendLine, RiDeleteBinLine, RiCalendarLine, RiArrowLeftLine, RiListUnordered, RiEditLine, RiReplyLine, RiArrowDownSLine, RiArrowRightSLine } from 'react-icons/ri';
import { FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import SendReplyModal from "../../components/SendReplyModal";
import DeleteCampaignMemberModal from '../../components/DeleteCampaignMemberModal';
import { useState, useEffect } from 'react';
import useSelectedOutboundStore from "@/app/utils/store/selectedoutbound";
import axios from 'axios';
import { apiSumary } from '@/app/utils/apiSummary';
import { formatHumanReadable, hasISOTimdPassed } from '@/app/utils/globalfunctions';

export default function CampaignDetail() {
  const selectedoutbound = useSelectedOutboundStore((state) => state.selectedoutbound);
  const params = useParams();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('scheduled');
  const [expandedTask, setExpandedTask] = useState(null);
  const [scheduledtasks, setscheduledtasks] = useState([]);
  const [completedtasks, setcompletedtasks] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [expandedReply, setExpandedReply] = useState(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [deleteMemberModalOpen, setDeleteMemberModalOpen] = useState(false);
  const [selectedReply, setSelectedReply] = useState(null);

  const cleanEmailBody = (body) => {
    if (!body) return '';
    let cleaned = body.replace(/^>.*$/gm, '');
    cleaned = cleaned.replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    return cleaned;
  };

  async function fetchOutboundTasks(selectedoutbound) {
    try {
      let url = apiSumary.get_outbound_tasks;
      let response = await axios.post(url, {
        outboundname: selectedoutbound.outbound_name,
      });

      let result = response.data;
      if (result.success) {
        let jobs = result.data;

        let completedtasks = jobs.filter(
          (job) => hasISOTimdPassed(job.nextRunAt)
        );

        let scheduledtasks = jobs.filter(
          (job) => !hasISOTimdPassed(job.nextRunAt)
        );

        setscheduledtasks(scheduledtasks);
        setcompletedtasks(completedtasks);

        if (completedtasks.length > 0) {
          fetchReplies(completedtasks[0]);
        }
      }
    } catch (error) {
      console.log("❌ Error fetching tasks:", error);
    }
  }

  async function fetchReplies(task) {
    try {
      if ((!task?.data?.taskSubject && !task?.data?.task_subject) || !selectedoutbound?.outbound_id) {
        console.log("no task subject");
        return;
      };
      let task_subject = task.data.taskSubject || task.data.task_subject;
      console.log(task_subject)
      setLoadingReplies(true);
      const response = await axios.post(apiSumary.get_outbound_replies, {
        outbound_id: selectedoutbound.outbound_id,
        subject: task_subject
      });
      let result = response.data;
      console.log(result)
      if (result.success) {
        setReplies(result.replies);
        setExpandedReply(null);
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setLoadingReplies(false);
    }
  }

  useEffect(() => {
    if (selectedoutbound?.outbound_id) {
      fetchOutboundTasks(selectedoutbound);
    }
  }, [selectedoutbound?.outbound_id]);

  const handleDelete = () => {
    console.log('Deleting campaign:', params.id);
    alert('Campaign deleted successfully!');
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const toggleReplyExpansion = (replyIndex) => {
    setExpandedReply(expandedReply === replyIndex ? null : replyIndex);
  };

  const handleReplyClick = (reply) => {
    setSelectedReply(reply);
    setReplyModalOpen(true);
  };

  const handleDeleteMemberClick = (reply) => {
    setSelectedReply(reply);
    setDeleteMemberModalOpen(true);
  };



  return (
    <div className="pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <Link href="/dashboard/outbounds" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-2">
            <RiArrowLeftLine className="mr-1" /> Back to campaigns
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedoutbound?.outbound_name}</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteConfirm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
          >
            <RiDeleteBinLine className="mr-2" /> Delete
          </button>
        </div>
      </div>

      {/* Campaign Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Campaign Details</h2>
          <Link
            href={`/dashboard/outbounds/${selectedoutbound?.outbound_name}/email_list`}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            View recipient list <FiExternalLink className="ml-1" />
          </Link>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Sending From</h3>
          <div className="flex flex-wrap gap-2">
            {selectedoutbound?.list_allocations?.map((allocation, index) => (
              <span key={index} className="bg-gray-50 px-3 py-1.5 rounded-md text-sm border border-gray-200">
                {allocation.emailAssigned}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
            <p className="text-gray-900">{selectedoutbound?.created_at}</p>
          </div>
        </div>
      </div>

      {/* Replies Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <RiReplyLine className="mr-2 text-indigo-600" />
            Replies
            {replies.length > 0 && (
              <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {replies.length}
              </span>
            )}
          </h2>
          {completedtasks.length > 0 && (
            <button
              onClick={() => fetchReplies(completedtasks[0])}
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              Refresh
            </button>
          )}
        </div>

        {loadingReplies ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading replies...</p>
          </div>
        ) : replies.length > 0 ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {replies.map((reply, index) => (
                <div key={index} className="border-b border-gray-200 last:border-b-0">
                  <button
                    onClick={() => toggleReplyExpansion(index)}
                    className="w-full text-left p-4 hover:bg-gray-50 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{reply.from}</p>
                      <p className="font-medium text-gray-900">To:{reply.to}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(reply.date).toLocaleString()}
                      </p>
                    </div>
                    {expandedReply === ( index) ? (
                      <RiArrowDownSLine className="text-gray-500" />
                    ) : (
                      <RiArrowRightSLine className="text-gray-500" />
                    )}
                  </button>

                  {expandedReply === ( index) && (
                    <div className="p-4 pt-0 bg-gray-50">
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          {cleanEmailBody(reply.plainText)}
                        </p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleReplyClick(reply)}
                          className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md border border-indigo-100 flex items-center"
                        >
                          <RiReplyLine className="mr-1" /> Reply
                        </button>
                        <button
                          onClick={() => handleDeleteMemberClick(reply)}
                          className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md border border-red-100 flex items-center"
                        >
                          <RiDeleteBinLine className="mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <RiReplyLine className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-3 text-sm font-medium text-gray-900">No replies yet</h3>
            <p className="mt-1 text-sm text-gray-500">Replies to your campaign emails will appear here.</p>
          </div>
        )}
      </div>

      {/* Schedule New Task */}
      <div className="bg-indigo-50 rounded-lg p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-medium text-gray-900">Ready to send another email?</h3>
            <p className="text-sm text-gray-600">Schedule a new task for this campaign</p>
          </div>
          <Link
            href={`/dashboard/outbounds/${params.outboundname}/newtask`}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
          >
            <RiCalendarLine className="mr-2" />
            Schedule New Task
          </Link>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'scheduled' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Scheduled
              <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {scheduledtasks.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'completed' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Completed
              <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {completedtasks.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'scheduled' ? (
            <>
              {scheduledtasks.length > 0 ? (
                <div className="space-y-4">
                  {scheduledtasks.map((task, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-all">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-gray-900">{task?.data?.taskname||task?.data?.task_name}</h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Scheduled
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{task?.data?.taskSubject||task?.data?.task_subject}</p>
                          <p className="text-sm text-green-700 mt-1">{task?.data?.smtp?.auth?.user || task?.data?.sender_email}</p>

                          {expandedTask === task.id && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500">Scheduled for</p>
                                  <p className="text-sm font-medium">{formatHumanReadable(task.nextRunAt)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Recipients</p>
                                  <p className="text-sm font-medium">{task.data.recipients.length}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2">
                          <button
                            onClick={() => toggleTaskExpansion(task?.id)}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-200"
                          >
                            {expandedTask === task.id ? 'Show Less' : 'Details'}
                          </button>
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md border border-indigo-100">
                              Edit
                            </button>
                            <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md border border-red-100">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <RiCalendarLine className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-3 text-sm font-medium text-gray-900">No scheduled tasks</h3>
                  <p className="mt-1 text-sm text-gray-500">Schedule your first email task to get started.</p>
                  <div className="mt-6">
                    <Link
                      href={`/dashboard/outbounds/${params.outboundname}/newtask`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <RiCalendarLine className="mr-2" />
                      Schedule Task
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {completedtasks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {completedtasks.map((task, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 max-w-xs">
                            <div className="font-medium text-gray-900">{task?.data?.taskname || task?.data?.task_name}</div>
                            <div className="text-sm text-gray-500 truncate">{task.data?.taskSubject || task.data.task_subject}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatHumanReadable(task.lastRunAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {task.data?.smtp?.auth?.user || task.data?.sender_email}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                              View
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              Resend
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <RiMailSendLine className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-3 text-sm font-medium text-gray-900">No completed tasks</h3>
                  <p className="mt-1 text-sm text-gray-500">Your scheduled tasks will appear here once sent.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmModal
        isOpen={deleteConfirm}
        onCancel={() => setDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Campaign"
        message="Are you sure you want to delete this campaign? All scheduled tasks will be cancelled and this action cannot be undone."
      />

      <SendReplyModal
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        reply={selectedReply}
        campaignId={selectedoutbound?.outbound_id}
      />

      <DeleteCampaignMemberModal
        isOpen={deleteMemberModalOpen}
        onClose={() => setDeleteMemberModalOpen(false)}
        member={selectedReply}
        campaignId={selectedoutbound?.outbound_id}
      />
    </div>
  );
}