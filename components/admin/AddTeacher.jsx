"use client";
import React, { useState, useRef, useContext, useEffect } from "react";
import { auth, db } from "@/firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { UserContext } from "@/providers/userProvider";
import { toast } from "react-toastify";
import { uploadImage } from "@/utils/functions/imageControls";
import { ProfileContext } from "@/providers/profileProvider";
import showError from "@/utils/functions/showError";
import { sendOtp } from "@/utils/functions/sendOtp";
import { isAdult } from "@/utils/functions/isAdult";
import { generateVerificationCode} from "@/utils/functions/generateVerificationCode";

export default function AddTeacher({ userData, onClose }) {
  const { user } = useContext(UserContext);
  const { addUser, editUser } = useContext(ProfileContext);
  const initialData = {
    name: "",
    email: "",
    dob: "",
    designation: "",
    photoURL: null,
    address: "",
    subject: "",
    experience: "",
    yearOfJoining: "",
    phoneNumber: "",
    
  };
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        ...initialData,
        name: userData.name,
        email: userData.email,
        dob: userData.dob,
        designation: userData.designation,
        phoneNumber: userData.phoneNumber,
        subject: userData.subject,
        experience: userData.experience,
        yearOfJoining: userData.yearOfJoining,
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

    if (!isAdult(formData.dob)) {
      toast.error("Teacher must be at least 18 years old.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const {
        email,
        name,
        dob,
        phoneNumber,
        designation,
        experience,
        yearOfJoining,
        address,
        subject,
      } = formData;

      const verificationCode = generateVerificationCode();

      let photoURLURL = "";
      if (formData.photoURL) {
        photoURLURL = await uploadImage(formData.photoURL, "profilephoto");
      }

      if (userData) {
        const updatedTeacherData = {
          ...userData,
          name,
          email,
          dob,
          phoneNumber,
          designation,
          experience,
          yearOfJoining,
          address,
          subject,
          photoURL: formData.photoURL
            ? await getUpdatedPhotoURL()
            : userData.photoURL,
          updatedAt: new Date().toISOString(),
          updatedBy: user?.id,
        };

        console.log("Updated Teacher Data:", updatedTeacherData);

        try {
          await editUser(userData, updatedTeacherData);
          toast.success("Teacher updated successfully!");
          onClose();
        } catch (error) {
          showError(error.message);
          console.error("Error updating teacher:", error);
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          "defaultPassword"
        );
        const profile = userCredential.user;

        const documentId = profile.uid;
        const userDataToSave = {
          id: documentId,
          name,
          email,
          dob,
          phoneNumber,
          designation,
          experience,
          yearOfJoining,
          address,
          subject,
          createdAt: new Date().toISOString(),
          createdBy: user?.id,
          role: "teacher",
          photoURL: photoURLURL,
          testIds: [],
          verificationCode,
          
          isVerified: false,
        };
        await addUser(profile, userDataToSave);
        await updateProfile(profile, {
          displayName: name,
          photoURL: photoURLURL,
        });

        toast.success("Teacher added successfully!");
        resetForm();
      }
    } catch (error) {
      console.error(
        "Error during teacher creation or email verification:",
        error
      );
      if (error.message === "Failed to send verification email.") {
        toast.warning(
          "Teacher added, but verification email could not be sent."
        );
      } else {
        toast.error("An error occurred during the operation.");
      }
    } finally {
      setFormData(initialData);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setLoading(false);
      onClose();
    }
  };

  const resetForm = () => {
    setFormData(initialData);
    setSelectedPackage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full mx-auto max-h-[80vh] overflow-y-scroll">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        {userData ? "Edit Teacher" : "Add Teacher"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1   focus:ring-gray-500"
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
              placeholder="File Size <= 100kb"
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
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1   focus:ring-gray-500"
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
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1   focus:ring-gray-500"
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
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1   focus:ring-gray-500"
              required
            />
          </div>
        </div>

        {/* Row 3: Experience, Subject, Year of Joining */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-semibold">
              Experience (Years)
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1   focus:ring-gray-500"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-semibold">Subject</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1   focus:ring-gray-500"
              required
            >
              <option value="">Select Subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-semibold">
              Year of Joining
            </label>
            <input
              type="text"
              name="yearOfJoining"
              value={formData.yearOfJoining}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1   focus:ring-gray-500"
              required
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-semibold">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1   focus:ring-gray-500"
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
