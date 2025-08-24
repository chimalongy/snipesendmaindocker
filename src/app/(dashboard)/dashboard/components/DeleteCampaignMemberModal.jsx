'use client';

import { RiCloseLine, RiDeleteBinLine } from 'react-icons/ri';
import { useState } from 'react';
import axios from 'axios';
import { apiSumary } from '@/app/utils/apiSummary';

export default function DeleteCampaignMemberModal({
  isOpen,
  onClose,
  member,
  campaignId
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to extract just the email address from the from field
  const extractEmail = (fromString) => {
    // Pattern to match email in format: "Name" <email@example.com>
    const emailMatch = fromString.match(/<([^>]+)>/);
    if (emailMatch && emailMatch[1]) {
      return emailMatch[1];
    }
    // If no match, return the original string
    return fromString;
  };

  const handleDeleteMember = async () => {
    setIsDeleting(true);
    console.log(member)


    try {

      let memberEmail = ""

      if (member.receiver && member.receiver !== "") {
        memberEmail = member.receiver
      }
      else if(!member.receiver) {
        memberEmail = extractEmail(member.from);
      }

console.log(memberEmail) 


      console.log('Deleting member:', memberEmail);
      console.log('Campaign ID:', campaignId);

      let payload = {

        outbound_id: campaignId,
        email_to_remove: memberEmail,
        emailassigned: member.to,
        member_detail: JSON.stringify(member)
      }

      console.log("PAYLAOD")
      console.log(payload)


      // Example API call:
      const response = await axios.post(apiSumary.delete_campaign_member, payload
      );

      // Check if the response indicates success
      if (response.data && response.data.success) {
        //alert('Member removed successfully');
        onClose();
      } else {
        throw new Error(response.data?.response.data.message || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      //alert(error.message || 'Failed to remove member');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  let memberEmail = ""

    if (member.receiver && member.receiver !== "") {
        memberEmail = member.receiver
      }
      else if(!member.receiver) {
        memberEmail = extractEmail(member.from);
      }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900">Remove Member</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
            disabled={isDeleting}
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Member Email:</p>
            <p className="font-medium">{memberEmail}</p>
          </div>

          <p className="text-sm text-gray-700 mb-6">
            Are you sure you want to remove this member from the campaign? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteMember}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDeleting}
            >
              <RiDeleteBinLine className="mr-2" />
              {isDeleting ? 'Removing...' : 'Remove Member'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}