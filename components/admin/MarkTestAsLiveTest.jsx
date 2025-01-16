"use client";
import React, { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const MakeLiveTest = ({ testId }) => {
  const [step, setStep] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleConfirmInitial = () => setStep(1);
  const handleInfoConfirm = () => setStep(2);
  const handleCancel = () => setStep(0);

  const handleSubmitDates = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      alert("Start date must be before the end date.");
      return;
    }

    setStep(3);
  };

  const handleFinalConfirmation = async () => {
    try {
      const startTimestamp = Timestamp.fromDate(new Date(startDate));
      const endTimestamp = Timestamp.fromDate(new Date(endDate));
      const createdAt = Timestamp.fromDate(new Date()); 
      await addDoc(collection(db, "livetests"), {
        testId,
        startDate: startTimestamp,
        endDate: endTimestamp,
        createdAt: createdAt,
      });

      alert("Test has been made live successfully!");
      setStep(0); 
    } catch (error) {
      console.error("Error adding live test:", error);
      alert("Failed to make the test live. Please try again.");
    }
  };

  return (
    <div>
      {step === 0 && (
        <div className="flex items-center justify-center h-[200px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Make Test Live</h1>
            <p className="mt-4 text-lg">Do you want to make this test live?</p>
            <div className="mt-6 space-x-4">
              <button
                onClick={handleConfirmInitial}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex items-center justify-center h-[200px]">
          <div className="text-center">
            <h1 className="text-xl font-bold text-red-600">
              Important Information
            </h1>
            <p className="mt-4 text-lg">
              If the test is made live, it will not be added to the main test
              package and will be hidden until the test is manually removed from
              the live test option. Do you want to proceed?
            </p>
            <div className="mt-6 space-x-4">
              <button
                onClick={handleInfoConfirm}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Proceed
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Set Test Live Date and Time
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700">Start Date and Time:</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">End Date and Time:</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleSubmitDates}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="text-center">
            <h1 className="text-xl font-bold text-red-600">
              Are you sure you want to make this test live?
            </h1>
            <div className="mt-6 space-x-4">
              <button
                onClick={handleFinalConfirmation}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Confirm
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MakeLiveTest;
