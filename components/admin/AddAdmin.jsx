"use client";
import React, { useState, useRef, useContext, useEffect } from "react";
import { auth } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { UserContext } from "@/providers/userProvider";
import { toast } from "react-toastify";
import { uploadImage } from "@/utils/functions/imageControls";
import { ProfileContext } from "@/providers/profileProvider";
import showError from "@/utils/functions/showError";
import { sendOtp } from "@/utils/functions/sendOtp";
import { isAdult } from "@/utils/functions/isAdult";
import { generateVerificationCode } from "@/utils/functions/generateVerificationCode";

export default function AddAdmin({ userData, onClose }) {
  const { user } = useContext(UserContext);
  const { addUser, editUser } = useContext(ProfileContext);
  const initialData = {
    displayName: "",
    email: "",
    dob: "",
    photoURL: null,
    designation: "",
    phoneNumber: "",
    address: "",
  };
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        displayName: userData.displayName,
        email: userData.email,
        dob: userData.dob,
        photoURL: null,
        designation: userData.designation,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      photoURL: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isAdult(formData.dob)) {
      toast.error("Admin must be at least 18 years old.");
      setLoading(false);
      return;
    }

    const { email, displayName, dob, phoneNumber, photoURL, designation, address } =
      formData;
   
    try {
      let documentId;

      if (userData) {
        documentId = userData.id;
        let photoURLURL = userData.photoURL;

        if (formData.photoURL) {
          photoURLURL = await uploadImage(formData.photoURL, "profilephoto");
        }
        console.log("Updated photo URL:", photoURLURL);

        const userDataToUpdate = {
          displayName,
          email,
          dob,
          phoneNumber,
          designation,
          address,
          updatedAt: new Date().toISOString(),
          updatedBy: user?.id,
          photoURL: photoURLURL,
        };

        try {
          await editUser(userData, userDataToUpdate);
          toast.success("User updated successfully!");
          onClose();
        } catch (error) {
          console.error("Error updating user:", error);
          toast.error("Failed to update user. Please try again.");
        }
      } else {
        let userCredential;
        try {
          userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            "defaultPassword"
          );
          const profile = userCredential.user;
          documentId = profile.uid;

          let photoURLURL = "";
          if (formData.photoURL) {
            try {
              photoURLURL = await uploadImage(
                formData.photoURL,
                "profilephoto"
              );
              console.log("Photo uploaded:", photoURLURL);
            } catch (uploadError) {
              console.error("Error uploading photo:", uploadError);
              toast.error("Error uploading profile picture.");
              return;
            }
          }

          const newUserData = {
            id: documentId,
            displayName,
            email,
            dob,
            phoneNumber,
            designation,
            address,
            createdAt: new Date().toISOString(),
            createdBy: user?.id,
            role: "admin",
            photoURL: photoURLURL,
            verificationCode,
            
            isVerified: false,
          };
          try {
            await addUser(profile, newUserData);
            toast.success("Admin added successfully!");
          } catch (addUserError) {
            console.error("Error adding user to database:", addUserError);
            toast.error("Failed to add admin.");
            return;
          }
        } catch (error) {
          console.error(
            "Error during user creation or email verification:",
            error
          );
          showError(error.message);
          setLoading(false);
          if (userCredential) {
            try {
              await auth.currentUser.delete();
            } catch (deleteError) {
              console.error("Error deleting user:", deleteError);
            }
          }
          return;
        }
      }
    } catch (err) {
      console.error("Error during form submission:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setFormData(initialData);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="w-full mx-auto max-h-[80vh] overflow-y-scroll">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        {userData ? "Edit Admin" : "Add Admin"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-semibold">Name</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none "
              required
            />
          </div>
          {userData ? (
            <div className="flex flex-col space-y-2">
              <label className="text-gray-600 font-semibold">Email</label>
              <input
                value={formData.email}
                className="p-2 border border-gray-300 rounded-lg"
                disabled
                readOnly
              />
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <label className="text-gray-600 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1   focus:ring-gray-500"
                required
              />
            </div>
          )}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-semibold">Profile Photo</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="px-2 py-1 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-semibold">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none "
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-semibold">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none "
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-semibold">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none "
              required
            />
          </div>
        </div>

        {/* Row 3: Address */}
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-semibold">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none "
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className={`w-[200px] bg-green-500 hover:bg-green-600 text-white font-semibold p-2 rounded-lg transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Loading.." : "Submit"}{" "}
          </button>
        </div>
      </form>
    </div>
  );
}
