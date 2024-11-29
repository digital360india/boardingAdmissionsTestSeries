"use client";
import { UserContext } from "@/providers/userProvider";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
    dob: user?.dob || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("User not authenticated.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.id); 
      await updateDoc(userRef, formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-start  p-4">
      <div className="">
        <h2 className="text-3xl font-bold text-center text-blac2 mb-8">Edit Your Profile</h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-indigo-500 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Your Name"
            />
          </div>
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-indigo-500 font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Your Phone Number"
            />
          </div>
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-indigo-500 font-medium">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
