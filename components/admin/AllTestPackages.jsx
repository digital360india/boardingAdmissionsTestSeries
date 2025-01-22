"use client";
import React, { useContext, useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { doc } from "firebase/firestore";
import { TestContext } from "@/providers/testProvider";
import { UserContext } from "@/providers/userProvider";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "@/components/admin/ScrollbarCss.css";
import PackageTable from "./PackageTableComponent";
import { TestSeriesContext } from "@/providers/testSeriesProvider";
import { IoClose } from "react-icons/io5";
import { uploadImage } from "@/utils/functions/imageControls";
import showError from "@/utils/functions/showError";
import { CiSearch } from "react-icons/ci";

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
      const startingDate = editFormData.startingDate;
      const packageRef = doc(db, "testPackages", packageId);
      const updatedData = {
        ...editFormData,
        price: parseFloat(editFormData.price),
        discountedPrice: parseFloat(editFormData.discountedPrice),
        updatedAt: new Date().toISOString(),
        ...(user && { updatedBy: user.id }),
      };

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
      await updateTestPackage(packageId, updatedData);
      setEditingPackage(null);
      setImageFile(null);
      toast.success("Test package updated successfully!");
    } catch (err) {
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

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
      <div className="absolute w-full top-0 xl:h-auto h-full bg-background00 left-0 flex items-center justify-center">
      <div className="w-[90vw] sm:w-[80vw] md:w-[65vw] h-[80vh] bg-white rounded-lg custom-scrollbar shadow overflow-y-scroll border-2 border-background05">
        <div className="bg-background05 pl-4 py-4 sticky top-0 border-b-2 border-background04">
          <h4 className="text-2xl font-semibold text-white">Edit Package</h4>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEdit(e, editingPackage);
          }}
          className="space-y-4 px-4 mt-4 text-sm"
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="w-full sm:w-[48%]">
              <label className="block text-15px font-semibold text-neutral02">
                Package Name:
              </label>
              <input
                type="text"
                name="packageName"
                value={editFormData.packageName}
                onChange={handleEditChange}
                className="mt-1 block p-2 border border-gray-300 w-full rounded"
                required
              />
            </div>
            <div className="w-full sm:w-[48%]">
              <label className="block text-15px font-semibold text-neutral02">
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
                className="mt-1 block p-2 border border-gray-300 w-full rounded"
              />
            </div>
          </div>
    
          <div className="mb-4">
            <label className="block text-15px font-semibold text-neutral02">
              Package Description:
            </label>
            <textarea
              name="packageDescription"
              value={editFormData.packageDescription}
              onChange={handleEditChange}
              className="mt-1 block w-full h-[100px] p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="flex justify-end text-[#AAAAAA] text-[12px]">
          <p>Max. 100 characters</p>
        </div>
          <div className="mb-4">
            {editFormData.packageImage && (
              <div className="mb-4">
                <label className="block text-black font-medium mb-2">
                  Current Package Image:
                </label>
                <img
                  src={editFormData.packageImage}
                  alt="Package"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
    
            <div className="mb-4">
              <label className="block text-[18px] font-medium mb-2">Package Image</label>
              <div className="flex items-center justify-center w-full bg-background05 bg-opacity-5 p-4 md:border-2 border border-background05 border-dashed rounded-lg text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-blue-500"
                >
                  <img
                    src="/Upload icon.svg"
                    alt="Upload Icon"
                    className="w-5"
                  />
                  <p className="text-[16px] font-semibold">
                    Drag & drop files or{" "}
                    <span className="text-blue-500 underline">Browse</span>
                  </p>
                  <p className="text-xs text-gray-400 ml-2">
                    Supported formats: JPEG, PNG
                  </p>
                </label>
              </div>
            </div>
          </div>
    
          <div className="flex gap-10 flex-wrap">
            <div className="my-2 w-full sm:w-[48%]">
              <label className="block text-15px mb-2 text-neutral02">
                Package Price (without discount)
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={editFormData.price}
                onChange={handleEditChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
    
            <div className="w-full sm:w-[48%]">
              <label className="block my-2 text-15px text-neutral02">
                Discounted Price:
              </label>
              <input
                type="number"
                step="0.01"
                name="discountedPrice"
                value={editFormData.discountedPrice}
                onChange={handleEditChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
    
          <div className="mb-20 w-full">
            <h3 className="text-lg font-semibold mb-2">Test Subjects Selection</h3>
    
            <div className="relative flex mb-2 justify-center items-center w-full border border-gray-300 rounded-xl p-2 pl-10 text-sm">
              <input
                type="text"
                placeholder="Search test subjects..."
                className="focus:outline-none"
                value={searchTerm}
                onChange={handleSearchChange}
              />
               <CiSearch />
            </div>
            <div className="grid grid-cols-2 gap-4 overflow-y-scroll custom-scrollbar max-h-32 p-2">
              {tests
                .filter((course) =>
                  course.testTitle
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((course) => (
                  <label key={course.id} className="flex items-center">
                    <input
                      type="checkbox"
                      value={course.id}
                      checked={editFormData.tests.includes(course.id)}
                      onChange={(e) => handleTestSelection(e, course.id)}
                      className="accent-teal-600 w-5 mr-2 h-5 rounded-xl focus:ring-teal-500"
                    />
                    <span className="font-medium text-15px">{course.testTitle}</span>
                  </label>
                ))}
            </div>
          </div>
    
          <div className="space-y-4">
            <label className="block text-black font-medium text-lg">Test IDs:</label>
    
            {editFormData?.tests && editFormData.tests.length > 0 ? (
              <ul className="grid md:grid-cols-2 grid-cols-1 md:gap-x-5 gap-4 pr-4 list-disc pl-5 min-h-28 py-4 custom-scrollbar overflow-y-scroll bg-gray-100 rounded-lg shadow-sm">
                {editFormData.tests.map((testId, index) => {
                  const test = allTests?.find((t) => t.id === testId);
                  return (
                    <li
                      key={index}
                      className="text-gray-700 flex justify-between items-center space-x-2 bg-white p-2 rounded-lg shadow-sm hover:bg-gray-200"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{index + 1}.</span>
                        <span className="font-medium text-gray-700">
                          {test
                            ? test.testTitle
                            : `No title found for test ID: ${testId}`}
                        </span>
                      </div>
    
                      <button
                        onClick={() => handleDelete1(testId)}
                        className="ml-2 text-red-500 hover:text-red-700 transition-all duration-200 ease-in-out"
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
    
          <div className="flex justify-between items-center pr-2 pb-2 pt-2 pl-2 space-x-2 mt-10 sticky bottom-0 bg-white w-full">
            <button
              type="submit"
              className="bg-background05 text-white px-4 py-2 rounded-md"
            >
              Update Package
            </button>
            <button
              type="button"
              onClick={() => setEditingPackage(null)}
              className="border text-[#9999A4] border-[#9999A4] px-4 py-2 rounded-md"
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
