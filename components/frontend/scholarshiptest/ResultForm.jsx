import React from "react";

export default function ResultForm({
  userDetails,
  setUserDetails,
  handleFormSubmit,
  loading,
}) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full border border-gray-200">
      <p className="text-xl font-semibold text-center mb-4">Get your Result</p>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            value={userDetails.name}
            onChange={(e) =>
              setUserDetails({ ...userDetails, name: e.target.value })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            value={userDetails.email}
            onChange={(e) =>
              setUserDetails({ ...userDetails, email: e.target.value })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-gray-700">Phone Number</label>
          <input
            id="phone"
            type="tel"
            value={userDetails.phone}
            onChange={(e) =>
              setUserDetails({ ...userDetails, phone: e.target.value })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-8 rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-600 transition-colors"
          disabled={loading} 
        >
          {loading ? "Loading..." : "View Full Result"}
        </button>
      </form>
    </div>
  );
}
