'use client';

import {
    RiArrowLeftLine, RiMailLine, RiUserLine, RiFileCopyLine, RiDeleteBinLine,
    RiSearchLine, RiCheckboxBlankLine, RiCheckboxFill, RiArrowDownSLine, RiArrowRightSLine,
    RiErrorWarningLine, RiLoader4Line
} from 'react-icons/ri';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiSumary } from '@/app/utils/apiSummary';
import useSelectedOutboundStore from "@/app/utils/store/selectedoutbound";
import DeleteConfirmModal from '../../../components/DeleteConfirmModal';
import toast from 'react-hot-toast';

export default function EmailListPage() {
     const setSelectedOutbound = useSelectedOutboundStore((state) => state.setSelectedOutbound);
    const { outboundname } = useParams();
    const [emailLists, setEmailLists] = useState([]);
    const [filteredLists, setFilteredLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copiedEmail, setCopiedEmail] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [emailToDelete, setEmailToDelete] = useState(null);
    const [collapsedGroups, setCollapsedGroups] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);
    const selectedoutbound = useSelectedOutboundStore((state) => state.selectedoutbound);

    const fetchEmailLists = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const initialCollapsedState = {};
            selectedoutbound.list_allocations.forEach(group => {
                initialCollapsedState[group.emailAssigned] = false;
            });

            setEmailLists(selectedoutbound.list_allocations);
            setFilteredLists(selectedoutbound.list_allocations);
            setCollapsedGroups(initialCollapsedState);
        } catch (err) {
            console.log('Failed to load email lists:', err);
            setError(err.message || 'Failed to load email lists');
            toast.error('Failed to load email lists');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedoutbound?.outbound_id) {
            fetchEmailLists();
        }
    }, [selectedoutbound?.outbound_id]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredLists(emailLists);
        } else {
            const filtered = emailLists.map(group => ({
                ...group,
                list: group.list.filter(email =>
                    email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    group.emailAssigned.toLowerCase().includes(searchTerm.toLowerCase())
                )
            })).filter(group => group.list.length > 0);
            setFilteredLists(filtered);
        }
    }, [searchTerm, emailLists]);

    const toggleGroupCollapse = (groupEmail) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [groupEmail]: !prev[groupEmail]
        }));
    };

    const copyToClipboard = (email) => {
        try {
            navigator.clipboard.writeText(email);
            setCopiedEmail(email);
            toast.success('Email copied to clipboard');
            setTimeout(() => setCopiedEmail(null), 2000);
        } catch (err) {
            console.error('Failed to copy email:', err);
            toast.error('Failed to copy email');
        }
    };

    const toggleEmailSelection = (email) => {
        setSelectedEmails(prev =>
            prev.includes(email)
                ? prev.filter(e => e !== email)
                : [...prev, email]
        );
    };

    const toggleGroupSelection = (groupEmail) => {
        const group = emailLists.find(g => g.emailAssigned === groupEmail);
        if (!group) {
            toast.error('Group not found');
            return;
        }

        const allGroupEmailsSelected = group.list.every(email => selectedEmails.includes(email));

        if (allGroupEmailsSelected) {
            setSelectedEmails(prev => prev.filter(email => !group.list.includes(email)));
        } else {
            const newSelections = new Set([...selectedEmails, ...group.list]);
            setSelectedEmails(Array.from(newSelections));
        }
    };

    const handleDeleteEmail = (email) => {
        setEmailToDelete(email);
        setDeleteConfirm(true);
    };

    const handleBulkDelete = () => {
        if (selectedEmails.length === 0) {
            toast.error('No emails selected');
            return;
        }
        setEmailToDelete(selectedEmails);
        setDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!emailToDelete) return;
        
        setIsDeleting(true);
        try {
            if (!selectedoutbound?.outbound_id) {
                throw new Error('No outbound campaign selected');
            }

            const updatedLists = emailLists.map(group => {
                const filteredList = group.list.filter(email =>
                    Array.isArray(emailToDelete)
                        ? !emailToDelete.includes(email)
                        : email !== emailToDelete
                );
                return {
                    ...group,
                    list: filteredList,
                    count: filteredList.length
                };
            }).filter(group => group.list.length > 0);

            const updateRequestBody = {
                outbound_id: selectedoutbound.outbound_id,
                field_name: "list_allocations",
                field_data: JSON.stringify(updatedLists)
            };

            const updateListResponse = await axios.post(apiSumary.update_outbound, updateRequestBody);
            
            if (!updateListResponse.data?.success) {
                throw new Error(updateListResponse.data?.message || 'Failed to update email list allocations');
            }

            const previousDeletedList = JSON.parse(selectedoutbound.deleted_email_list || "[]");
            const emailsToAdd = Array.isArray(emailToDelete) ? emailToDelete : [emailToDelete];
            const newDeletedEmailList = Array.from(new Set([...previousDeletedList, ...emailsToAdd]));

            const updateDeletedRequestBody = {
                outbound_id: selectedoutbound.outbound_id,
                field_name: "deleted_email_list",
                field_data: JSON.stringify(newDeletedEmailList)
            };

            const updateDeletedResponse = await axios.post(apiSumary.update_outbound, updateDeletedRequestBody);
            
            if (!updateDeletedResponse.data?.success) {
                throw new Error(updateDeletedResponse.data?.message || 'Failed to update deleted email list');
            }

             let newselectedoutbound= selectedoutbound
            newselectedoutbound.list_allocations = updatedLists
            console.log("NEW SELECTED OUTBOUND",newselectedoutbound)
            setSelectedOutbound(newselectedoutbound)

            setEmailLists(updatedLists);
            setFilteredLists(updatedLists);
            setSelectedEmails([]);

           
            
            const message = Array.isArray(emailToDelete) 
                ? `Deleted ${emailToDelete.length} emails successfully`
                : 'Email deleted successfully';
            toast.success(message);
            
        } catch (err) {
            console.error('Delete error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to delete email(s)';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
            setDeleteConfirm(false);
            setEmailToDelete(null);
        }
    };

    const totalRecipients = filteredLists.reduce((total, group) => total + group.list.length, 0);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <RiLoader4Line className="animate-spin h-12 w-12 text-indigo-500 mb-4" />
                <p className="text-gray-600">Loading recipient lists...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 ">
                <div className="text-center py-12">
                    <RiErrorWarningLine className="mx-auto h-12 w-12 text-red-500" />
                    <h3 className="mt-3 text-sm font-medium text-gray-900">Error loading email list</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                    <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                        <button
                            onClick={fetchEmailLists}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Retry
                        </button>
                        <Link
                            href={`/dashboard/outbounds/${outboundname}`}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700"
                        >
                            <RiArrowLeftLine className="mr-2" />
                            Back to Campaign
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-8 ">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6 sm:mb-8">
                <div>
                    <Link
                        href={`/dashboard/outbounds/${outboundname}`}
                        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-2 text-sm sm:text-base"
                    >
                        <RiArrowLeftLine className="mr-1" /> Back to campaign
                    </Link>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                        Recipient List for {selectedoutbound?.outbound_name}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {totalRecipients} total recipients
                    </p>
                </div>
            </div>

            {/* Search and Bulk Actions */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <RiSearchLine className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search recipients or sending emails..."
                        className="block w-full pl-8 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {selectedEmails.length > 0 && (
                    <div className="flex flex-col xs:flex-row xs:items-center gap-3">
                        <span className="text-xs sm:text-sm text-gray-700">
                            {selectedEmails.length} selected
                        </span>
                        <button
                            onClick={handleBulkDelete}
                            disabled={isDeleting}
                            className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? (
                                <RiLoader4Line className="animate-spin mr-1" />
                            ) : (
                                <RiDeleteBinLine className="mr-1" />
                            )}
                            Delete Selected
                        </button>
                    </div>
                )}
            </div>

            {/* Email List Groups */}
            <div className="space-y-4 sm:space-y-6">
                {filteredLists.map((group, groupIndex) => (
                    <div key={groupIndex} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        {/* Group Header - Mobile Optimized */}
                        <div
                            className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                            onClick={() => toggleGroupCollapse(group.emailAssigned)}
                        >
                            <div className="flex items-center min-w-0">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleGroupSelection(group.emailAssigned);
                                    }}
                                    className="mr-2 sm:mr-3 text-gray-400 hover:text-indigo-600 shrink-0"
                                    aria-label={group.list.every(email => selectedEmails.includes(email)) ? "Deselect all" : "Select all"}
                                >
                                    {group.list.every(email => selectedEmails.includes(email)) ? (
                                        <RiCheckboxFill className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                                    ) : (
                                        <RiCheckboxBlankLine className="h-4 w-4 sm:h-5 sm:w-5" />
                                    )}
                                </button>
                                <div className="flex items-center min-w-0">
                                    {collapsedGroups[group.emailAssigned] ? (
                                        <RiArrowRightSLine className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mr-2 shrink-0" />
                                    ) : (
                                        <RiArrowDownSLine className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mr-2 shrink-0" />
                                    )}
                                    <RiMailLine className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500 mr-2 shrink-0" />
                                    <h2 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                        {group.emailAssigned}
                                    </h2>
                                </div>
                            </div>
                            <div className="flex items-center ml-2">
                                <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 whitespace-nowrap">
                                    {group.list.length} {window.innerWidth < 640 ? '' : 'recipients'}
                                </span>
                            </div>
                        </div>

                        {/* Recipient List */}
                        {!collapsedGroups[group.emailAssigned] && (
                            <div className="divide-y divide-gray-200">
                                {group.list.map((email, emailIndex) => (
                                    <div key={emailIndex} className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50">
                                        <div className="flex items-center min-w-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleEmailSelection(email);
                                                }}
                                                className="mr-2 sm:mr-3 text-gray-400 hover:text-indigo-600 shrink-0"
                                                aria-label={selectedEmails.includes(email) ? "Deselect email" : "Select email"}
                                            >
                                                {selectedEmails.includes(email) ? (
                                                    <RiCheckboxFill className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                                                ) : (
                                                    <RiCheckboxBlankLine className="h-4 w-4 sm:h-5 sm:w-5" />
                                                )}
                                            </button>
                                            <RiUserLine className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2 sm:mr-3 shrink-0" />
                                            <span className="text-gray-700 text-sm sm:text-base truncate">{email}</span>
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyToClipboard(email);
                                                }}
                                                className="text-gray-400 hover:text-indigo-600 p-1 rounded-md"
                                                title="Copy email"
                                                aria-label="Copy email"
                                            >
                                                <RiFileCopyLine className="h-3 w-3 sm:h-4 sm:w-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteEmail(email);
                                                }}
                                                className="text-gray-400 hover:text-red-600 p-1 rounded-md"
                                                title="Delete email"
                                                aria-label="Delete email"
                                            >
                                                <RiDeleteBinLine className="h-3 w-3 sm:h-4 sm:w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredLists.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
                    <div className="text-center py-8 sm:py-12">
                        <RiMailLine className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                        <h3 className="mt-2 sm:mt-3 text-sm font-medium text-gray-900">
                            {searchTerm ? 'No matching recipients found' : 'No recipients found'}
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm text-gray-500">
                            {searchTerm
                                ? 'Try a different search term'
                                : 'This campaign doesn\'t have any recipients assigned yet.'}
                        </p>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            <DeleteConfirmModal
                isOpen={deleteConfirm}
                onCancel={() => {
                    setDeleteConfirm(false);
                    setEmailToDelete(null);
                }}
                onConfirm={confirmDelete}
                isProcessing={isDeleting}
                title={Array.isArray(emailToDelete) ? "Delete Selected Emails" : "Delete Email"}
                message={
                    Array.isArray(emailToDelete)
                        ? `Are you sure you want to delete ${emailToDelete.length} selected emails? This action cannot be undone.`
                        : `Are you sure you want to delete "${emailToDelete}" from this campaign? This action cannot be undone.`
                }
            />
        </div>
    );
}