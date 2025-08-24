// components/DeleteConfirmModal.js
'use client';
 
import { FiX } from "react-icons/fi";

export default function DeleteConfirmModal({ isOpen, onCancel, onConfirm, title, message, loader }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <FiX size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
        <p className="text-sm text-gray-600 mb-5">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
          >
            {loader?"...Deleting":"Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
