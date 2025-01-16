"use client";
import React, { useEffect } from 'react';

const DeletePopup = ({ isOpen, onClose, onConfirm }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'auto'; 
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-20 z-50">
      <div className="bg-white rounded-lg border-2 p-8 w-11/12 md:w-1/3 shadow-xl transition-transform transform hover:scale-105">
        <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">
          <span className="text-red-500">Warning!</span> Are you sure you want to delete this package?
        </h2>
        <p className="text-gray-600 text-center mb-6">
          This action cannot be undone. Please confirm if you wish to proceed.
        </p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={onClose} 
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md shadow hover:bg-gray-400 transition duration-200 transform hover:-translate-y-1"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="bg-red-500 text-white px-5 py-2 rounded-md shadow hover:bg-red-600 transition duration-200 transform hover:-translate-y-1"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
