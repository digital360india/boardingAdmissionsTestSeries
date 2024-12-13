"use client";
import React, { useState, useEffect } from "react";
import AddUser from "./AddUser";
import AddAdmin from "./AddAdmin";
import AddTeacher from "./AddTeacher";
import { RxCross2 } from "react-icons/rx";

export default function AddProfile({ onClose, Type, user }) {
  const [type, setType] = useState(Type || ""); 

  useEffect(() => {
    if (Type) {
      setType(Type); 
    }
  }, [Type]);

  const handleChange = (event) => {
    setType(event.target.value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="relative w-[90vw] sm:w-[60vw] lg:w-[40vw] bg-white shadow-2xl rounded-xl p-6 border max-h-[90vh] overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <RxCross2 size={28} />
      </button>
  
      {/* Modal Content */}
      <div className="mt-4">
        {/* User Type Selection */}
        {!Type && (
          <div className="flex flex-col gap-4">
            <label
              htmlFor="userType"
              className="font-medium text-gray-700 text-lg"
            >
              Select User Type:
            </label>
            <select
              id="userType"
              value={type}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
        )}
  
        {/* Dynamic Content Based on Selected Type */}
        <div className="mt-6">
          {type === "user" && <AddUser userData={user} onClose={onClose} />}
          {type === "admin" && <AddAdmin userData={user} onClose={onClose} />}
          {type === "teacher" && <AddTeacher userData={user} onClose={onClose} />}
        </div>
      </div>
    </div>
  </div>
  
  );
}
