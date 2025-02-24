"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { auth } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { UserContext } from "@/providers/userProvider";
import { toast } from "react-toastify";
import DateInputDialog from "./DateInputForPackages";
import { TestContext } from "@/providers/testProvider";
import { ProfileContext } from "@/providers/profileProvider";
import { uploadImage } from "@/utils/functions/imageControls";
import showError from "@/utils/functions/showError";
import { generateVerificationCode } from "@/utils/functions/generateVerificationCode";
import { MdDelete } from "react-icons/md";

export default function AddUser({ userData, onClose }) {
  const { user } = useContext(UserContext);
  const { testPackages } = useContext(TestContext);
  const { addUser, editUser } = useContext(ProfileContext);

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    dob: "",
    photoURL: null,
    phoneNumber: "",
    mytestpackages: [],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [availableTestPackages, setAvailableTestPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (testPackages && testPackages.length > 0) {
      setAvailableTestPackages(testPackages);
    }

    if (userData) {
      setFormData({
        ...userData,
        photoURL: null,
      });
    }
  }, [testPackages, userData]);

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

  const handleSelectTestPackage = (e) => {
    const selectedPackageId = e.target.value;
    const selectedPkg = availableTestPackages.find(
      (pkg) => pkg.id === selectedPackageId
    );

    if (selectedPkg) {
      setSelectedPackage(selectedPkg);
      setIsDialogOpen(true);
    }
  };

  const handleConfirmDates = (dateOfExpiration, dateOfPurchase) => {
    if (selectedPackage) {
      const { id, price, packageName } = selectedPackage;
      const packageWithDates = {
        dateOfExpiration,
        dateOfPurchase,
        packageId: id,
        price: price,
        packageName,
      };

      setFormData((prevState) => ({
        ...prevState,
        mytestpackages: [...prevState.mytestpackages, packageWithDates],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let userCredential;

    try {
      const { email, displayName, dob, phoneNumber } = formData;

      if (!userData) {
       
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          "defaultPassword"
        );
        const profile = userCredential.user;

        let photoURLURL = "";
        if (formData.photoURL) {
          photoURLURL = await uploadImage(formData.photoURL, "profilephoto");
        }
        
        const verificationCode = generateVerificationCode();
        const newUser = {
          id: profile.uid,
          displayName,
          email,
          dob,
          phoneNumber,
          createdAt: new Date().toISOString(),
          createdBy: user?.id,
          role: "user",
          photoURL: photoURLURL,
          mytestpackages: formData.mytestpackages,

          maxScores: [],
          myResults: [],
          myScores: [],
          verificationCode,

          isVerified: false,
        };

        try {
          await addUser(profile, newUser);
          toast.success("User added successfully!");
        } catch (error) {
          console.error("Error during user creation or email sending:", error);

          if (error.message === "Failed to send verification email.") {
            toast.warning(
              "User added, but verification email could not be sent."
            );
          } else {
            toast.error("Error occurred during user creation.");
          }
        } finally {
          onClose();
        }
      } else {
        const updatedUserData = {
          ...userData,
          displayName,
          dob,
          phoneNumber,
          photoURL: formData.photoURL
            ? await getUpdatedPhotoURL()
            : userData.photoURL,
          mytestpackages: formData.mytestpackages,

          updatedAt: new Date().toISOString(),
          updatedBy: user?.id,
        };
        await editUser(userData, updatedUserData);
        toast.success("User updated successfully!");
        onClose();
      }

      resetForm();
    } catch (err) {
      showError(err.message);
      toast.error("Error adding/updating user");
      console.error("Error adding/updating user: ", err);
      setLoading(false);

      if (userCredential) {
        try {
          await auth.currentUser.delete();
        } catch (deleteError) {
          showError(deleteError.message);
          toast.error("Error deleting user");
          console.error("Error deleting user: ", deleteError);
        }
      }
    }
    setLoading(false);
  };

  const getUpdatedPhotoURL = async () => {
    if (formData.photoURL) {
      return await uploadImage(formData.photoURL, "profilephoto");
    }
    return userData.photoURL;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      dob: "",
      photoURL: null,
      phoneNumber: "",
      mytestpackages: [],
    });
    setSelectedPackage(null);
    fileInputRef.current.value = "";
  };

  const handleDeletePackage = (index) => {
    const updatedPackages = formData.mytestpackages.filter(
      (pkg, i) => i !== index
    );
    setFormData({ ...formData, mytestpackages: updatedPackages });
  };

  return (
    <div className="w-full mx-auto max-h-[80vh]">
      <h2 className="text-3xl font-bold py-4 text-center text-gray-800">
        {userData ? "Edit User Details" : "Add User"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 p-1">
        <div className="flex gap-10 justify-evenly">
          <div className="flex flex-col space-y-2 w-[50%]">
            <label className="text-gray-600 font-semibold">Name</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              className="p-2 border border-gray-300  rounded-lg focus:outline-none "
              required
            />
          </div>

          {userData ? (
            <div className="flex flex-col space-y-2 w-[50%]">
              <label className="text-gray-600 font-semibold">Email</label>
              <input
                value={formData.email}
                className="p-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
                readOnly
                disabled
              />
            </div>
          ) : (
            <div className="flex flex-col space-y-2 w-[50%]">
              <label className="text-gray-600 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="p-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
                required
              />
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col space-y-2 w-[47%]">
            <label className="text-gray-600 font-semibold">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
              required
            />
          </div>
          <div className="flex flex-col space-y-2 w-[46%]">
            <label className="text-gray-600 font-semibold">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
              required
            />
          </div>
        </div>
        <div className="flex flex-col space-y-2 w-[100%]">
          <label className="text-gray-600 font-semibold">Profile Photo</label>
          <input
            type="file"
            placeholder="File Size <= 100kb"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="px-2 py-1 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex justify-between ">
          <div className="flex flex-col space-y-2 w-[100%]">
            <label className="text-gray-600 font-semibold">
              Select Test Package
            </label>
            <div>
              <select
                name="mytestpackages"
                onChange={handleSelectTestPackage}
                className="p-2 border border-gray-300 w-[100%] rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
              >
                <option value="">Select a package</option>
                {availableTestPackages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.packageId} {pkg.packageName} = ₹{pkg.price}
                  </option>
                ))}
              </select>

              <DateInputDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleConfirmDates}
              />
              <div className="border mt-4 p-4 rounded-lg space-y-4 w-[100%]">
                <h4 className="font-semibold text-lg">
                  Selected Test Packages:
                </h4>
                <ul className="list-disc pl-6 space-y-2">
                  {formData?.mytestpackages.map((pkg, index) => (
                    <li
                      key={index}
                      className="text-gray-700 flex justify-between items-center"
                    >
                      {/* Package Details */}
                      <div>
                        <span className="font-bold">{pkg.packageName}</span> = ₹
                        {pkg.price}
                      </div>
                      {/* Delete Icon */}
                      <button
                        className="text-red-500 hover:text-red-700 p-1"
                        onClick={() => handleDeletePackage(index)}
                      >
                        <MdDelete size={20} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
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
