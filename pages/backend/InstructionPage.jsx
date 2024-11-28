import React from "react";

const InstructionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-4">
        <h2 className="text-2xl font-bold mb-4">Instructions</h2>
        <p className="mb-4">
          Please read the following instructions carefully before starting the test:
          {/* Add your instructions here */}
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Accept and Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;
    