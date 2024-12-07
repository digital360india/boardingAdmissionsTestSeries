"use client";
import React, { useState, useEffect, useContext } from "react";
import { db } from "@/firebase/firebase";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import TestPackagesList from "@/components/admin/AllTestPackages";
import { UserContext } from "@/providers/userProvider";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TestSeriesContext } from "@/providers/testSeriesProvider";
import Loading from "@/app/loading";
import { TestContext } from "@/providers/testProvider";
import { uploadImage } from "@/utils/functions/imageControls";
import showError from "@/utils/functions/showError";

const Page = () => {
  const { user } = useContext(UserContext);
  const { allTests } = useContext(TestSeriesContext);
  const { addPackage } = useContext(TestContext);
  const router = useRouter();
  const [tests, settests] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    packageName: "",
    price: "",
    startingDate: "",
    createdAt: "",
    createdBy: "",
    updatedBy: "",
    updatedAt: "",
    packageImage: null,
    discountedPrice: "",
    studentsEnrolled: [],
    packageDescription: "",
    tests: [],
    studentFeedBack: [],
  });
  const [selectedtests, setSelectedtests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (allTests.length > 0) {
      setLoading(true);
      settests(allTests);
      setLoading(false);
    } else {
      setError("No tests available");
    }
  }, [allTests]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 102400) {
      setImageFile(file);
      setFormData((prevData) => ({
        ...prevData,
        packageImage: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      alert("File size <= 100kb");
      setImageFile(null);
      setFormData((prevData) => ({
        ...prevData,
        packageImage: null,
      }));
      event.target.value = "";
    }
  };

  const handletestselection = (e, courseId) => {
    if (e.target.checked) {
      setSelectedtests([...selectedtests, courseId]);
    } else {
      setSelectedtests(selectedtests.filter((id) => id !== courseId));
    }
  };

  const handlePackageCreation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (!user || !user.id) {
      console.error("User is not defined or does not have an ID:", user);
      toast.error("User is not authenticated. Please log in.");
      setIsLoading(false);
      return;
    }
  
    try {
      let imageUrl = "";
  
      if (imageFile) {
        imageUrl = await uploadImage(formData.packageImage, "packages");
      }
  
      const packageData = {
        ...formData,
        price: parseFloat(formData.price),
        discountedPrice: parseFloat(formData.discountedPrice),
        startingDate: formData.startingDate,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
        tests: selectedtests,
        packageImage: imageUrl || "",
      };
  
      const docRef = await addPackage(packageData);
      const userRef = doc(db, "users", user.id);
  
      await updateDoc(userRef, {
        packageIDs: arrayUnion(docRef.id),
      });
  
      await updateDoc(docRef, {
        id: docRef.id,
      });
  
      // Reset form fields
      setFormData({
        packageName: "",
        price: "",
        discountedPrice: "",
        startingDate: "",
        packageImage: null,
        packageDescription: "",
      });
      setImagePreview(null);
      setSelectedtests([]);
      setImageFile(null);
      toast.success("Test package created successfully!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating Test package:", err);
      showError(err.message);
      toast.error("Failed to create Test package. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleModalToggle = () => {
    setIsModalOpen(true);
  };
  const handleOnClose = () => {
    setFormData({
      packageName: "",
      price: "",
      discountedPrice: "",
      startingDate: "",
      packageImage: null,
      packageDescription: "",
    });
    setImagePreview(null);
    setSelectedtests([]);
    setImageFile(null);
    setIsModalOpen(false);
  };
  return (
    <div className="p-4">
      <button
        onClick={handleModalToggle}
        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
      >
        Create Test Package
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[60vw] relative">
            <button
              onClick={handleOnClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Create Test Package</h2>
            <form onSubmit={handlePackageCreation}>
              <div className="mb-4">
                <label className="block text-gray-700">Package Name:</label>
                <input
                  type="text"
                  name="packageName"
                  value={formData.packageName}
                  onChange={handleInputChange}
                  className="mt-1 block  p-2 border border-gray-300 rounded w-[67%]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Package Description:
                </label>
                <textarea
                  name="packageDescription"
                  value={formData.packageDescription}
                  onChange={handleInputChange}
                  className="mt-1 block p-2 border border-gray-300 rounded h-32 w-[67%]"
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700">Price:</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Discounted Price:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Starting Date:</label>
                  <input
                    type="date"
                    name="startingDate"
                    value={formData.startingDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  Upload Package Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  placeholder="File Size <= 100kb"
                  onChange={handleImageUpload}
                  className="mt-1 block p-2 border border-gray-300 rounded w-[40%]"
                />

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Selected Package"
                    className="mt-2 h-32 w-32 object-cover border border-gray-300 rounded"
                  />
                )}
              </div>
              <div className="mb-4 h-32 overflow-y-scroll">
                <h3 className="text-lg font-semibold mb-2">Select tests:</h3>
                <div className="space-y-2">
                  {tests.map((course) => (
                    <label key={course.id} className="flex items-center">
                      <input
                        type="checkbox"
                        value={course.id}
                        onChange={(e) => handletestselection(e, course.id)}
                        className="mr-2"
                      />
                      {course.testTitle}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleOnClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-blue-500 text-white px-4 py-2 rounded-md 
                    ${
                      isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-600"
                    }`}
                  disabled={isLoading}
                >
                  {isLoading ? <Loading /> : "Create Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <TestPackagesList />
    </div>
  );
};

export default Page;
