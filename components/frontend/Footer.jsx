"use client";
import React, { useContext } from "react";
import { AdminDataContext } from "@/providers/adminDataProvider";
export default function Footer() {
  const {adminData} = useContext(AdminDataContext)
  return (
    <footer className="bg-[#4c7bea] text-white pb-36 pt-24">
      <div className="px-4 sm:px-6 lg:px-20 mx-auto flex flex-col lg:flex-row justify-between lg:items-start">
        {/* Logo and Contact Info */}
        <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-28 mb-6 md:mb-0">
          <div className="mb-4 flex justify-center lg:justify-start">
            <div className="rounded-full p-2">
              <img
                src={adminData?.logo || "default-logo-url.jpg"}
                className="w-28 h-28 rounded-full"
                alt="Institute Logo"
              />
            </div>
          </div>
          <div className="space-y-1 text-center lg:text-left">
            <h3 className="font-bold">
              {adminData?.businessName || "Institute Name"}
            </h3>
            <p className="text-sm">
              Address: {adminData?.address || "Default Address"}
            </p>
            <p className="text-sm">City: {adminData?.city || "Default City"}</p>
            <p className="text-sm">
              Phone number: {adminData?.phoneNumber || "Default Phone"}
            </p>
            <p className="text-sm">
              Zip code: {adminData?.zipCode || "Default Zip"}
            </p>
          </div>
        </div>

        {/* Policy Links */}
        <div className="flex flex-col space-y-4 text-center md:text-left">
          <a
            target="_blank"
            download={adminData?.termsAndConditions}
            href={adminData?.termsAndConditions}
            className="hover:underline"
          >
            Terms and Conditions
          </a>
          <a
            target="_blank"
            download={adminData?.privacyPolicy}
            href={adminData?.privacyPolicy}
            className="hover:underline"
          >
            Privacy Policy
          </a>
          <a
            target="_blank"
            download={adminData?.returnPolicy}
            href={adminData?.returnPolicy}
            className="hover:underline"
          >
            Return Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
