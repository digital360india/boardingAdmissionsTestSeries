"use client";
import React from "react";
import { useRouter } from "next/navigation";

const TestPackageCard = ({ packageData }) => {
  const router = useRouter();
  const {
    packageImage,
    packageName,
    createdBy,
    createdAt,
    packageDiscountedPrice,
    packagePrice,
    packageDescription,
    packageLiveDate,
    // tests,
  } = packageData;

  const handleViewPackage = () => {
    router.push(`/testPackage/${packageData.id}`);
  };

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white transition-transform duration-200 hover:scale-105 max-w-sm">
      <img
        src={packageImage}
        alt={packageName}
        className="w-full h-40 object-cover rounded-t-lg object-top"
      />
      <div className="min-h-[340px] overflow-y-auto">
        {" "}
        <div className="p-4">
          <h1 className="text-xl mb-2 font-semibold">{packageName}</h1>
          <p className="text-gray-600">
            <span className="text-black font-semibold">Created On: </span>{" "}
            {new Date(createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            <span className="text-black font-semibold"> Starting Date:</span>{" "}
            {new Date(packageLiveDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600 my-2">
            <span className="text-black font-semibold">
              Package Description:{" "}
            </span>{" "}
            {packageDescription}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div>
          <span className="text-xl font-bold text-green-600">
            ₹{packageDiscountedPrice}
          </span>
          <span className="text-sm text-gray-500 line-through ml-2">
            ₹{packagePrice}
          </span>
        </div>
      </div>
      <button
        onClick={handleViewPackage}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
      >
        View Package
      </button>
    </div>
  );
};

export default TestPackageCard;
