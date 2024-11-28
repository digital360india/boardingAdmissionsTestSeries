"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { FiPhoneCall } from "react-icons/fi";
import { AdminDataContext } from "@/providers/adminDataProvider";
import Loading from "../loading";
import { IoLocation } from "react-icons/io5";

const HeroSection = () => {
  const { adminData, loading } = useContext(AdminDataContext);
  if (loading) {
    <Loading />;
  }
  return (
    <>
      <div className="overflow-hidden">
        <div className="relative flex justify-center items-center mb-[200px]">
          <img
            src={adminData?.bannerImageUrl}
            className="w-full lg:rounded-b-[40px] h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px] object-cover shadow-lg shadow-gray-300 drop-shadow-2xl  "
            alt="Business Banner"
          />

          <div className="absolute -bottom-[43%] sm:-bottom-20 md:-bottom-24 lg:-bottom-32 z-10 md:bg-gradient-to-r from-white to-gray-100 bg-white border border-gray-200 shadow-2xl rounded-3xl w-11/12 sm:w-3/4 md:w-4/5 lg:w-[900px] xl:w-[1078px] pb-8 pt-4 sm:p-8 md:p-10 ">
            <div className="flex flex-col sm:flex-row justify-between items-center md:gap-6 ">
              <img
                src={adminData?.logo}
                className="h-20 w-20 sm:h-24 sm:w-24 object-contain rounded-full border border-gray-100"
                alt="Business Logo"
              />

              <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
                  {adminData?.businessName}
                </h1>
                <div className="flex justify-start items-center gap-2 md:mt-2 text-gray-600">
                  <IoLocation />
                  <p className="text-sm sm:text-base font-medium text-gray-700">
                    {adminData?.city},{adminData?.country}
                  </p>
                  {adminData?.googleLocation && (
                    <Link href={adminData?.googleLocation} passHref>
                      <p className="text-blue-500 underline text-xs sm:text-sm md:ml-2">
                        (View on Map)
                      </p>
                    </Link>
                  )}
                  <button className="flex items-center ">
                    <FiPhoneCall className="text-background04 hover:-translate-y-2 hover:text-green-400" />
               
                  </button>
                </div>
                <p className="text-sm sm:text-base  text-gray-500 md:mt-2 hidden sm:block leading-relaxed">
                  {adminData?.about}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
