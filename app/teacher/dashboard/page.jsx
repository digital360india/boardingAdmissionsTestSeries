"use client";
import { UserContext } from "@/providers/userProvider";
import React, { useContext } from "react";
import { FaMapMarkerAlt, FaBirthdayCake, FaPhone, FaUser, FaEnvelope, FaBriefcase, FaBook } from "react-icons/fa";

const Page = () => {
  const { user } = useContext(UserContext);
  
  return (
    <div className="p-6  min-h-screen flex flex-col items-center">
      <div className="max-w-full w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <FaUser className="text-4xl text-blue-600 mr-4" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Hello, {user?.name}</h2>
            <p className="text-gray-600">{user?.designation} - {user?.subject}</p>
          </div>
        </div>
        
        <hr className="my-4 border-t-2 border-gray-300" />
        
        <div className="space-y-4 text-gray-800">
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-xl text-gray-500 mr-3" />
            <div>
              <span className="font-semibold">Address: </span>{user?.address || "Not available"}
            </div>
          </div>
          
          <div className="flex items-center">
            <FaEnvelope className="text-xl text-gray-500 mr-3" />
            <div>
              <span className="font-semibold">Email: </span>{user?.email}
            </div>
          </div>
          
          <div className="flex items-center">
            <FaPhone className="text-xl text-gray-500 mr-3" />
            <div>
              <span className="font-semibold">Phone: </span>{user?.phoneNumber || "Not available"}
            </div>
          </div>
          
          <div className="flex items-center">
            <FaBirthdayCake className="text-xl text-gray-500 mr-3" />
            <div>
              <span className="font-semibold">Date of Birth: </span>{user?.dob || "Not available"}
            </div>
          </div>
          
          <div className="flex items-center">
            <FaBriefcase className="text-xl text-gray-500 mr-3" />
            <div>
              <span className="font-semibold">Experience: </span>{user?.experience || "0"} years
            </div>
          </div>
          
          <div className="flex items-center">
            <FaBook className="text-xl text-gray-500 mr-3" />
            <div>
              <span className="font-semibold">Subject: </span>{user?.subject}
            </div>
          </div>
          
          <div className="flex items-center">
            <FaUser className="text-xl text-gray-500 mr-3" />
            <div>
              <span className="font-semibold">Created By ID: </span>{user?.createdBy}
            </div>
          </div>
          
          <div className="flex items-center">
            <FaUser className="text-xl text-gray-500 mr-3" />
            <div>
              <span className="font-semibold">Role: </span>{user?.role}
            </div>
          </div>
          
          <div className="flex items-center">
            <FaUser className="text-xl text-gray-500 mr-3" />
            <div>
              <span className="font-semibold">Teacher ID: </span>{user?.id}
            </div>
          </div>
          
          <div className="flex items-center">
            <FaUser className="text-xl text-gray-500 mr-3" />
            <div>
              <span className="font-semibold">Tests Assigned: </span>{user?.testIDs?.length || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
