'use client';

import { useState } from 'react';
import { RiCloseLine, RiSendPlaneLine } from 'react-icons/ri';
import axios from 'axios';
import { apiSumary } from '@/app/utils/apiSummary';
import toast from 'react-hot-toast';

export default function SendReplyModal({ isOpen, onClose, reply, campaignId }) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    console.log("REPLY: "+JSON.stringify(reply))
    try {
      const recipientEmail = extractEmail(reply.from);
      
      console.log('Sending reply to:', recipientEmail);
      console.log('Message:', message);
      console.log('Campaign ID:', campaignId);
      
      const payload = {
        outbound_id: campaignId,
        recipient: recipientEmail,
        message,
        originalMessageId: reply.id,
        thread_id:reply.threadId,
        send_from: reply.to,
        subject:reply.subject
      };

      console.log('Payload:', payload);
      
      const response = await axios.post(apiSumary.send_reply, payload);
      
      // Check if the response indicates success
      if (response.data && response.data.success) {
        toast.success(response.data.message)
        onClose();
        setMessage('');
      } else {
        throw new Error(response.data?.message || 'Failed to send reply');
      }
    } catch (error) {
      console.log('Error sending reply:', error);
      toast.error(error.message || 'Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const recipientEmail = extractEmail(reply?.from);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900">Send Reply</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <RiCloseLine size={24} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">To:</p>
            <p className="font-medium">{recipientEmail}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Type your reply here..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isSending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending || !message.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  'Sending...'
                ) : (
                  <>
                    <RiSendPlaneLine className="mr-2" />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}