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
      src: "/initialstate.png",
      description:
        "During initial time of the test Answer upload button would be disable and appear as faded",
    },
    {
      src: "/uploadstate.png",
      description:
        "During the remaining 15 min of the test the button would be activated and  student can upload his/her answer file in the pdf format",
    },
    {
      src: "/uploadedstate.png",
      description:
        "After the Answer PDF will be successfully uploaded the student can submit the test by clicking on Submit button below it",
    },
  ];

  const handleAccept = () => {
    router.push(`/user/testScreen/${category}/${hasResult}`);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  if (category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-2 lg:p-8 bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-2 lg:p-8 w-full md:w-[70vw]  border border-gray-200">
          <h1 className="text-2xl lg:text-4xl font-semibold text-center mb-6">
            Test Guidelines
          </h1>

          <div className="space-y-8">
            <div>
              <h2 className="text-lg lg:text-2xl font-semibold mb-4">Time Management</h2>
              <div className="bg-blue-50 p-4 rounded-lg shadow">
                <div className="flex justify-center space-x-3 lg:space-x-8 mb-4">
                  <div className="text-center">
                    <div className="text-xl lg:text-3xl font-bold">00</div>
                    <div className="text-sm">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl lg:text-3xl font-bold">18</div>
                    <div className="text-sm">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl lg:text-3xl font-bold">51</div>
                    <div className="text-sm">Seconds</div>
                  </div>
                </div>
                <ul className="list-disc pl-6 space-y-2 text-lg">
                  <li>The timer at the top shows your remaining time.</li>
                  <li>
                    The test will automatically submit when time runs out.
                  </li>
                  <li>Plan your time wisely for all sections.</li>
                </ul>
              </div>
            </div>
            <div>
              <h2 className="text-lg lg:text-2xl font-semibold mb-4">
                Answer Upload Instructions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {questionTypes.map((type, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-4 p-4"
                  >
                    <img src={type.src} alt={type.label} />
                    <div className="text-gray-600">{type.description}</div>
                  </div>
                ))}
              </div>
              <p className="text-red-600 ">
                Note : It is strongly recommended that students verify the file
                name they upload in the answer panel to ensure further
                inconvinenece.
              </p>
            </div>

            <div>
              <h2 className="text-lg lg:text-2xl font-semibold mb-4">
                Important Instructions
              </h2>
              <div className="bg-gray-50 text-lg p-4 rounded-lg shadow">
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    You can change your answer at any time during the test.
                  </li>
                  <li>Use the question palette to jump to any question.</li>
                  <li>
                    Mark questions for review if you want to check them later.
                  </li>
                  <li>Click Submit only when you want to finish the test.</li>
                  <li>
                    Ensure a stable internet connection throughout the test.
                  </li>
                  <li className="text-red-600 font-bold">
                    Note: Changing tabs or navigating away will terminate your
                    test session. Please remain on this page until you finish
                    the test.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="mr-2 rounded-lg"
              />
              <span className="font-medium text-background05">
                I accept all the above terms and conditions
              </span>
            </label>

            <button
              onClick={handleAccept}
              disabled={!isChecked}
              className={`bg-background05 text-white py-3 px-8 rounded-2xl shadow-lg transition-colors ${
                isChecked
                  ? "hover:from-blue-600 hover:to-teal-600"
                  : "opacity-50 cursor-not-allowed"
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
