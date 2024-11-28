import React from "react";

const TestCard = ({ test, isEnrolled }) => {
  return (
    <li className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">{test.testTitle}</h3>
      <p className="text-gray-600">{test.testDescription}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-lg font-bold text-green-600">
          {test.discountedPrice ? `₹${test.discountedPrice}` : `Free`}
        </span>
        <span className="text-gray-500">Duration: {test.duration} minutes</span>
      </div>
      <button
        className={`mt-4 w-full py-2 rounded-lg ${
          isEnrolled
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Start Test
      </button>
    </li>
  );
};

export default TestCard;
