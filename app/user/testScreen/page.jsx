"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const hasResult = searchParams.get("reattempt");
  const [isChecked, setIsChecked] = useState(false);
  
  const questionTypes = [
    {
      color: "bg-green-500",
      label: "Answered",
      description: "Questions you have submitted an answer for"
    },
    {
      color: "bg-red-500",
      label: "Not Answered",
      description: "Questions you have seen but not answered"
    },
    {
      color: "bg-gray-300",
      label: "Not Visited",
      description: "Questions you haven't opened yet"
    },
    {
      color: "bg-orange-500",
      label: "Marked for Review",
      description: "Questions you want to review later"
    },
    {
      color: "bg-blue-900",
      label: "Answered & Marked for Review",
      description: "Questions you've answered but want to check again"
    }
  ];

  const handleAccept = () => {
    router.push(`/user/testScreen/${category}/${hasResult}`);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  if (category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full md:w-[70vw] lg:w-[50vw] border border-gray-200">
          <h1 className="text-4xl font-semibold text-center mb-6">Test Guidelines</h1>

          <div className="space-y-8">
            {/* Time Management Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Time Management</h2>
              <div className="bg-blue-50 p-4 rounded-lg shadow">
                <div className="flex justify-center space-x-8 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">00</div>
                    <div className="text-sm">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">18</div>
                    <div className="text-sm">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">51</div>
                    <div className="text-sm">Seconds</div>
                  </div>
                </div>
                <ul className="list-disc pl-6 space-y-2 text-lg">
                  <li>The timer at the top shows your remaining time.</li>
                  <li>The test will automatically submit when time runs out.</li>
                  <li>Plan your time wisely for all sections.</li>
                </ul>
              </div>
            </div>

            {/* Question Status Guide Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Question Status Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {questionTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow">
                    <div className={`w-10 h-10 rounded-full ${type.color} flex items-center justify-center text-white`}></div>
                    <div>
                      <div className="text-xl font-medium">{type.label}</div>
                      <div className="text-gray-600">{type.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Marking Scheme Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Marking Scheme</h2>
              <div className="bg-orange-50 text-lg p-4 rounded-lg shadow">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Correct Answer: +1 mark</li>
                  <li>Wrong Answer: -1 mark (Negative marking)</li>
                  <li>Unattempted: 0 marks</li>
                </ul>
              </div>
            </div>

            {/* Important Instructions Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Important Instructions</h2>
              <div className="bg-gray-50 text-lg p-4 rounded-lg shadow">
                <ul className="list-disc pl-6 space-y-2">
                  <li>You can change your answer at any time during the test.</li>
                  <li>Use the question palette to jump to any question.</li>
                  <li>Mark questions for review if you want to check them later.</li>
                  <li>Click Submit only when you want to finish the test.</li>
                  <li>Ensure a stable internet connection throughout the test.</li>
                  <li className="text-red-600 font-bold">
                    Note: Changing tabs or navigating away will terminate your test session. Please remain on this page until you finish the test.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Checkbox and Accept Button */}
          <div className="mt-8 flex flex-col items-center">
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <span className="font-medium">I have read all the above details</span>
            </label>

            <button
              onClick={handleAccept}
              disabled={!isChecked}
              className={`bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-8 rounded-lg shadow-lg transition-colors ${
                isChecked ? 'hover:from-blue-600 hover:to-teal-600' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-white bg-red-500 p-4 rounded-lg shadow">
          You are not allowed to take the test.
        </div>
      </div>
    );
  }
};

export default Page;
