"use client";
import React from "react";
import { useRouter } from "next/navigation";

const TestPackageCard = ({ packageData }) => {
  const router = useRouter();
  const {
    packageImage,
    packageName,
    createdBy,
    dateOfCreation,
    discountedPrice,
    price,
    packageDescription,
    startingDate,
    studentsEnrolled
  } = packageData;

  const handleViewPackage = () => {
    router.push(`/testPackage/${packageData.id}`);
  };

  return (
    <div className="border rounded-lg shadow-lg p-5 bg-white transition-transform duration-200 hover:scale-105 max-w-sm mx-auto overflow-hidden">
      {/* Image Section */}
      <div className="relative w-full h-48 overflow-hidden rounded-t-lg mb-4">
        {packageImage ? (
          <img
            src={packageImage}
            alt={packageName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-gray-200 text-gray-600">
            <span>No Image Available</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col h-full justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2 truncate">{packageName}</h1>
        <div className="flex flex-col mb-4">
        <p className="text-gray-600">
            <span className="font-semibold text-black">Student Enrolled:</span> {studentsEnrolled}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-black">Created By:</span> {createdBy}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-black">Created On:</span> {new Date(dateOfCreation).toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-black">Starting Date:</span> {new Date(startingDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600 mt-2">
            <span className="font-semibold text-black">Description:</span> {packageDescription}
          </p>
        </div>

        {/* Pricing Section */}
        <div className="flex justify-between items-center border-t pt-2 mt-2">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-green-600">₹{discountedPrice}</span>
            <span className="text-sm text-gray-500 line-through ml-2">₹{price}</span>
          </div>
        </div>

        {/* View Button */}
        <button
          onClick={handleViewPackage}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring focus:ring-blue-300"
        >
          View Package
        </button>
      </div>
    </div>
  );
};

export default TestPackageCard;
