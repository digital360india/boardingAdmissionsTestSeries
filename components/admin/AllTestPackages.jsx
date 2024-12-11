"use client";
import React, { useContext, useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { doc } from "firebase/firestore";
import { TestContext } from "@/providers/testProvider";
import { UserContext } from "@/providers/userProvider";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify"; // Ensure correct imports

import PackageTable from "./PackageTableComponent";
import { TestSeriesContext } from "@/providers/testSeriesProvider";
import { IoClose } from "react-icons/io5";
import { uploadImage } from "@/utils/functions/imageControls";
import showError from "@/utils/functions/showError";

const TestPackagesList = () => {
  const { user } = useContext(UserContext);
  const { testPackages, updateTestPackage } = useContext(TestContext);
  const { allTests } = useContext(TestSeriesContext);
  const [editingPackage, setEditingPackage] = useState(null);
  const [tests, settests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    packageName: "",
    price: "",
    discountedPrice: "",
    dateOfCreation: "",
    packageImage: "",
    tests: [],
    packageDescription: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    // Convert the value back to a Date object if the input is for startingDate
    const newValue = name === "startingDate" ? new Date(value) : value;

    setEditFormData({
      ...editFormData,
      [name]: newValue,
    });
  };

  useEffect(() => {
    if (allTests.length > 0) {
      settests(allTests);
    } else {
      console.log("No tests available");
    }
  }, [allTests]);

  const handleEdit = async (e, packageId) => {
    try {
      // Validate starting date if necessary
      const startingDate = editFormData.startingDate;
  
      const packageRef = doc(db, "testPackages", packageId);
      const updatedData = {
        ...editFormData,
        price: parseFloat(editFormData.price),
        discountedPrice: parseFloat(editFormData.discountedPrice),
        updatedAt: new Date().toISOString(),
        ...(user && { updatedBy: user.id }),
      };
  
      // Handle image upload if a new image is provided
      if (imageFile) {
        if (imageFile.size <= 100 * 1024) {
          const imageUrl = await uploadImage(imageFile, "packages");
          updatedData.packageImage = imageUrl;
        } else {
          toast.error("File size should be 100KB or smaller.");
          setImageFile(null);
          return;
        }
      }
  
      // Update the test package in the database
      await updateTestPackage(packageId, updatedData);
  
      // Reset the form and states
      setEditingPackage(null);
      setImageFile(null);
  
      // Success toast
      toast.success("Test package updated successfully!");
    } catch (err) {
      // Error toast and error logging
      toast.error("Failed to update course package. Please try again.");
      console.error("Error updating course package:", err);
      showError(err.message);
    }
  };
  

  const handleTestSelection = (e, testId) => {
    const { checked } = e.target;

    setEditFormData((prevFormData) => {
      let updatedTests;

      if (checked) {
        updatedTests = [...prevFormData.tests, testId];
      } else {
        updatedTests = prevFormData.tests.filter((id) => id !== testId);
      }

      return {
        ...prevFormData,
        tests: updatedTests,
      };
    });
  };

  const openModal1 = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
  };

  const closeModal1 = () => {
    setShowModal(false);
    setSelectedPackage(null);
  };

  const openModal = (pkgId) => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPackage(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleDelete1 = (testId) => {
    setEditFormData((prevData) => ({
      ...prevData,
      tests: prevData.tests.filter((id) => id !== testId),
    }));
  };
  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* <h2 className="text-3xl font-bold text-gray-800 mb-4">Test Packages</h2> */}

      <PackageTable
        isModalOpen={isModalOpen}
        openModal={openModal}
        openModal2={openModal1}
        setEditFormData={setEditFormData}
        setEditingPackage={setEditingPackage}
        setIsModalOpen={setIsModalOpen}
        testPackages={testPackages}
      />
      {editingPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
          <div className="relative w-[50vw] h-[80vh]  bg-white  rounded-lg shadow overflow-y-scroll border-2 border-background04">
            <div className="flex justify-between items-center pl-4 pt-5 sticky top-0 bg-white border-b-2 border-background04">
              <h4 className="text-2xl font-semibold text-background04 ">
                Edit Package
              </h4>{" "}
              <div className=" ">
                <button
                  onClick={() => setEditingPackage(false)}
                  className="text-red-400 text-3xl"
                >
                  <IoClose />
                </button>
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEdit(e, editingPackage);
              }}
              className="space-y-4 pl-4 mt-4 text-sm "
            >
              <div className="mb-4 flex justify-start items-center gap-2">
                <label className="block text-black font-semibold">
                  Package Name :
                </label>
                <input
                  type="text"
                  name="packageName"
                  value={editFormData.packageName}
                  onChange={handleEditChange}
                  className="mt-1 block  p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-black font-semibold">
                  Package Description:
                </label>
                <textarea
                  name="packageDescription"
                  value={editFormData.packageDescription}
                  onChange={handleEditChange}
                  className="mt-1 block w-full h-[100px] p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div className="flex justify-start items-center gap-10">
                {" "}
                <div className="flex flex-col gap-4 justify-center items-start">
                  <h4 className="text-medium font-semibold text-black ">
                    Packages Pricings :
                  </h4>{" "}
                  <div className="flex gap-1 justify-star items-center">
                    <label className="block text-black font-semibold">
                      Price:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditChange}
                      className="block pl-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div className=" flex gap-1 justify-star items-center">
                    <label className="block text-black font-medium">
                      Discounted Price:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="discountedPrice"
                      value={editFormData.discountedPrice}
                      onChange={handleEditChange}
                      className=" block pl-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div className="flex gap-1 justify-start items-center">
                    <label className="block text-black font-medium">
                      Starting Date:
                    </label>
                    <input
                      type="date"
                      name="startingDate"
                      value={editFormData.startingDate || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          startingDate: e.target.value,
                        })
                      }
                      className="block pl-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                </div>
                {editFormData.packageImage && (
                  <div className="mb-4">
                    <label className="block text-black font-medium">
                      Current Package Image:
                    </label>
                    <img
                      src={editFormData.packageImage}
                      alt="Package"
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-black font-medium">
                  Upload New Package Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="">
                <label className="block text-black font-medium">
                  Test IDs:
                </label>
                {editFormData?.tests && editFormData.tests.length > 0 ? (
                  <ul className="grid grid-cols-2 gap-x-5 pr-4 list-disc pl-5 min-h-28 py-4 overflow-y-scroll bg-gray-100">
                    {editFormData.tests.map((testId, index) => {
                      const test = allTests?.find((t) => t.id === testId);
                      return (
                        <li
                          key={index}
                          className="text-gray-700 flex justify-between items-center"
                        >
                          <div>
                            <span className="w-3">{index + 1}, </span>
                            {test
                              ? test.testTitle
                              : `No title found for test ID: ${testId}`}
                          </div>
                          <button
                            onClick={() => handleDelete1(testId)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <FaRegTrashAlt />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="font-semibold text-lg text-gray-700">
                    No Test IDs available for this package.
                  </p>
                )}
              </div>

              <div className="mb-20 ">
                <h3 className="text-lg font-semibold mb-2">Select tests:</h3>
                <div className="space-y-2 overflow-y-scroll max-h-32 bg-gray-100 p-2">
                  {tests.map((course) => (
                    <label key={course.id} className="flex items-center">
                      <input
                        type="checkbox"
                        value={course.id}
                        checked={editFormData.tests.includes(course.id)}
                        onChange={(e) => handleTestSelection(e, course.id)}
                        className="mr-2"
                      />
                      {course.testTitle}
                    </label>
                  ))}
                </div>
              </div>
              <div className="h-14"></div>
              <div className="flex justify-between items-center pr-2 pb-2 pt-2 pl-2  space-x-2 mt-10 sticky bottom-0 bg-white  w-full ">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Update Package
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <div className="flex justify-between items-start">
              {" "}
              <h3 className="text-lg font-bold mb-4">Package Details</h3>
              <button onClick={() => setShowModal(false)}>
                <IoClose className="text-red-600 text-xl" />
              </button>
            </div>
            {selectedPackage && (
              <table className="min-w-full bg-white border border-gray-300">
                <tbody>
                  <tr className="even:bg-gray-100 hover:bg-gray-300">
                    <td className="py-2 px-4 border-b border-r border-gray-300">
                      <strong>Package Name:</strong>
                    </td>
                    <td className="min-w-fit py-2 px-4 border-b border-gray-300">
                      {selectedPackage?.packageName}
                    </td>
                  </tr>
                  <tr className="even:bg-gray-100 hover:bg-gray-300">
                    <td className="py-2 px-4 border-b border-r border-gray-300">
                      <strong>Price:</strong>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      ₹{selectedPackage?.price}
                    </td>
                  </tr>
                  <tr className="even:bg-gray-100 hover:bg-gray-300">
                    <td className="py-2 px-4 border-b border-r border-gray-300">
                      <strong>Discounted Price:</strong>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      ₹{selectedPackage?.discountedPrice}
                    </td>
                  </tr>
                  <tr className="even:bg-gray-100 hover:bg-gray-300">
                    <td className="py-2 px-4 border-b border-r border-gray-300">
                      <strong>Date of Creation:</strong>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      {new Date(selectedPackage?.startingDate).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="even:bg-gray-100 hover:bg-gray-300">
                    <td className="py-2 px-4 border-b border-r border-gray-300">
                      <strong>Students Enrolled:</strong>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      {selectedPackage?.studentsEnrolled?.length || "0"}
                    </td>
                  </tr>
                  {/* <tr className="even:bg-gray-100 hover:bg-gray-300">
                    <td className="py-2 px-4 border-b border-r border-gray-300">
                      <strong>Package Description:</strong>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                   { selectedPackage?.packageDescription}
                    </td>
                  </tr> */}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPackagesList;
