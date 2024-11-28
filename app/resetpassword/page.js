"use client"
import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import showError from "@/utils/functions/showError";

const HandleResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const auth = getAuth();
    
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
      showError(err.message);
      console.error("Error sending reset email: ", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Reset Password</h2>
        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleResetPassword} className="space-y-6">
          <label className="block text-gray-700 font-medium">
            Enter your email address:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </label>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300"
          >
            Send Reset Email
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Remember your password? <a href="/login" className="text-blue-500 font-semibold hover:underline">Log in</a>
        </div>
      </div>
    </div>
  );
};

export default HandleResetPassword 
