"use client";
import React, { useContext } from "react";
import { TestSeriesContext } from "@/providers/testSeriesProvider";
import { TestContext } from "@/providers/testProvider";
import { UserContext } from "@/providers/userProvider";
import Image from "next/image"; // Image optimization for performance

const Page = () => {
  const { allTests } = useContext(TestSeriesContext);
  const { testPackages } = useContext(TestContext);
  const { user } = useContext(UserContext);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col p-6">
      {/* Header Section */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* User Information Card */}
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8 flex flex-col lg:flex-row gap-8">
        {user?.photoURL ? (
          <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <Image
              src={user?.photoURL || "/default-avatar.png"}
              alt="User Avatar"
              width={96}
              height={96}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        ) : (
          <></>
        )}

        {/* User Details */}
        <div className="flex flex-col justify-between space-y-6 lg:space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              {user?.name || "Admin"}
            </h2>
            <p className="text-gray-700 text-lg">
              {user?.designation || "Designation not available"}
            </p>
            <p className="text-gray-600">
              {user?.email || "Email not provided"}
            </p>
            <p className="text-gray-600">
              {user?.phoneNumber || "Phone number not available"}
            </p>
            <p className="text-gray-600">
              {user?.address || "Address not available"}
            </p>
          </div>

          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <strong>Role:</strong> {user?.role || "N/A"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {user?.createdAt
                ? new Date(user?.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
           
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Total Tests
          </h3>
          <p className="text-4xl font-bold text-gray-600">{allTests.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Total Test Packages
          </h3>
          <p className="text-4xl font-bold text-gray-600">
            {testPackages.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
