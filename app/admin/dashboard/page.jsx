"use client";
import React, { useContext } from "react";
import { TestSeriesContext } from "@/providers/testSeriesProvider";
import { TestContext } from "@/providers/testProvider";
import { UserContext } from "@/providers/userProvider";
import Image from "next/image";

const Page = () => {
  const { allTests } = useContext(TestSeriesContext);
  const { testPackages } = useContext(TestContext);
  const { user } = useContext(UserContext);

  const userDetails = [
    { label: "Admin Name", value: user?.displayName || "Admin" },
    { label: "E-mail", value: user?.email || "Email not provided" },
    {
      label: "Phone number",
      value: user?.phoneNumber || "Phone number not available",
    },
    { label: "Address", value: user?.address || "Address not available" },
  ];

  const statsData = [
    { count: allTests.length, label: "Total Tests" },
    { count: testPackages.length, label: "Total Test Packages" },
  ];

  return (
    <div className=" flex flex-col p-6">
      <div className="flex space-x-4 mb-4">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-[#075D70] w-[146px] h-[86px] lg:w-[243px] lg:h-[143px] text-white lg:p-[20px] rounded-lg shadow-sm flex flex-col items-center justify-center"
          >
            <p className="text-[25px] lg:text-[45px] font-bold">{stat.count}</p>
            <h3 className="text-sm lg:text-xl font-semibold mb-2">{stat.label}</h3>
          </div>
        ))}
      </div>

      <div className="w-full h-[260px]  mb-8">
        <div className="px-8 py-4 bg-[#075D70] w-fit text-white rounded-t-lg ">
          <p className="text-sm lg:text-[20px] font-semibold">Admin Information</p>
        </div>
        <div className="border border-[#9999A4] bg-[#F8FAFB] rounded-b-lg rounded-tr-lg p-4 space-y-4">
          <div className="flex justify-between w-full items-center ">
            <div className="hidden lg:block">
            {user?.photoURL && user.photoURL.trim() !== "" ? (
              <div className="w-24 h-24 ml-12 bg-gray-200 rounded-full overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                <Image
                  src={user.photoURL}
                  alt="User Avatar"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            ) : (
              <div className="w-24 h-24 ml-12 bg-gray-200 rounded-full overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                <Image
                  src="/navbar.svg"
                  alt="Default Avatar"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            )}
            </div>
            <p className="text-[#9999A4] text-[18px]">
              <span>Created At:</span>
              {user?.createdAt
                ? new Date(user?.createdAt).toLocaleDateString()
                : new Date(user?.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-col justify-between space-y-6 lg:space-y-4 pb-8">
            <div className="space-y-2 lg:w-[70%] xl:w-[40%] text-[18px] lg:pl-12">
              {userDetails.map((item, index) => (
                <div key={index} className="flex flex-col lg:flex-row justify-between">
                  <p className="text-[#9999A4]">{item.label}</p>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
