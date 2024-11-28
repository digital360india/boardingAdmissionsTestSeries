"use client";
import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export default function Verification({ user }) {
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationColor, setVerificationColor] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (user) {
      if (user?.isVerified) {
        setVerificationMessage("Verified User");
        setVerificationColor("text-green-500");
      }
    }
  }, [user]);

  const handleReverification = (e) => {
    const inputValue = e.target.value;

    if (user?.verificationCode === inputValue) {
      setIsVerified(true);
      setVerificationMessage("Verification successful!");
      setVerificationColor("text-green-500");
    } else {
      setIsVerified(false);
      setVerificationMessage("Verification failed! Code does not match.");
      setVerificationColor("text-red-500");
    }
  };

  const handleSubmit = async () => {
    if (!isVerified) {
      setVerificationMessage("Cannot submit. Verification failed.");
      setVerificationColor("text-red-500");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.id);
      await updateDoc(userDocRef, {
        isVerified: true,
      });
      setVerificationMessage("Reverification updated successfully!");
      setVerificationColor("text-green-500");
      setTimeout(() => {
        window.location.reload(); // Reload the page after successful verification
      }, 1000);
    } catch (error) {
      console.error("Error updating verification:", error);
      setVerificationMessage("Failed to update verification. Try again.");
      setVerificationColor("text-red-500");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-gray-100">
    <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-sm transform transition-all duration-500 hover:scale-105">
      {user && !user?.isVerified ? (
        <>
          <h2 className="text-3xl font-extrabold text-primar text-center mb-4">Verify Your Account</h2>
          <p className=" text-gray-600 text-center mb-6">
            Enter the 6-digit code sent to your email to complete the verification process.
          </p>
          <div className="flex flex-col space-y-4">
            <div className="relative group">
              <label className="text-sm text-gray-700 font-medium">Verification Code</label>
              <input
                type="text"
                onChange={handleReverification}
                placeholder="Enter code"
                className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            
            </div>
            {verificationMessage && (
              <span className={`text-sm font-medium transition-colors duration-300 ${verificationColor}`}>
                {verificationMessage}
              </span>
            )}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 active:scale-95 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!isVerified}
            >
              Submit
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <span className="text-green-600 text-lg font-semibold">
            Verified User
          </span>
          <p className="text-sm text-gray-500 mt-2">
            Your account is successfully verified.
          </p>
          <div className="mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-green-500 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5 4.5a9 9 0 11-7.5-7.5"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  </div>
  
  );
}
