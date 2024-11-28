import React from 'react';
import ReactDOM from 'react-dom';

export default function ErrorPage({ message, onClose }) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="text-gray-700 mt-4">{message}</p>
          <button
            onClick={onClose}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body // Renders the popup to the body
  );
}
