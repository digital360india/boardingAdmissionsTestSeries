import React from "react";

const Information = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">{message}</h1>
        <p className="mt-4 text-xl">Please confirm to proceed.</p>
        <div className="mt-6 space-x-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Information;
