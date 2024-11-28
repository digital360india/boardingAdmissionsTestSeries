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
      <div className="w-[80vw] mx-auto bg-white shadow-lg rounded-lg p-8 mt-4 border-2 max-h-[90vh] overflow-y-auto">
        <div className="float-right">
          <RxCross2
            className="cursor-pointer"
            size={32}
            color="black"
            onClick={onClose}
          />
        </div>
        <div className="flex-1 flex-col mt-4">
          {!Type && (
            <div className="flex items-center gap-4">
              <label htmlFor="userType" className="font-bold">
                Select User Type:
              </label>
              <select
                id="userType"
                value={type}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2"
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
          {type === "user" && <AddUser  userData={user} onClose={onClose}/>}
          {type === "admin" && <AddAdmin   userData={user} onClose={onClose}/>}
          {type === "teacher" && <AddTeacher  userData={user} onClose={onClose}/>}
        </div>
      </div>
    </div>
  );
}
