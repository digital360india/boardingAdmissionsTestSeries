"use client";
import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useRouter } from "next/navigation";

const LiveTestPage = () => {
  const [liveTests, setLiveTests] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();  // Hook to navigate between pages

  // Fetch live tests from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "livetests"), (snapshot) => {
      const tests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLiveTests(tests);
    });
    return () => unsubscribe();
  }, []);

  // Update the current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date()); // Update current time every second
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isTestActive = (test) => {
    const start = test.startDate.toDate(); // Convert Firebase Timestamp to Date object
    const end = test.endDate.toDate(); // Convert Firebase Timestamp to Date object
    return currentTime >= start && currentTime <= end; // Check if the test is active
  };

  const handleAttemptTest = (testId) => {
      router.push(`/user/testScreen/${testId}`);
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Live Tests</h1>
      {liveTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveTests.map((test) => (
            <div
              key={test.id}
              className="p-4 bg-white shadow-md rounded-md border border-blue-500"
            >
              <h2 className="text-xl font-semibold text-blue-600 mb-2">
                Test ID: {test.testId}
              </h2>
              <p className="text-gray-700">
                <strong>Created At:</strong>{" "}
                {new Date(test.createdAt.seconds * 1000).toLocaleString()} {/* Format timestamp */}
              </p>
              <p className="text-gray-700">
                <strong>Start Time:</strong>{" "}
                {new Date(test.startDate.seconds * 1000).toLocaleString()} {/* Format timestamp */}
              </p>
              <p className="text-gray-700">
                <strong>End Time:</strong>{" "}
                {new Date(test.endDate.seconds * 1000).toLocaleString()} {/* Format timestamp */}
              </p>
              <p className="text-gray-700 font-semibold">
                Status:{" "}
                {isTestActive(test) ? (
                  <span className="text-green-500">Active</span>
                ) : (
                  <span className="text-red-500">Inactive</span>
                )}
              </p>
              <button
                className={`mt-4 px-4 py-2 rounded-md ${isTestActive(test) ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 cursor-not-allowed"}`}
                onClick={() => handleAttemptTest(test.id)}
                disabled={!isTestActive(test)}
              >
                {isTestActive(test) ? "Attempt Test" : "Test Not Available"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-xl">Loading tests...</p>
      )}
    </div>
  );
};

export default LiveTestPage;
