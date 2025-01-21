"use client";
import React, { useState, useEffect, useContext } from "react";
import { db } from "@/firebase/firebase";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import TestPackagesList from "@/components/admin/AllTestPackages";
import { UserContext } from "@/providers/userProvider";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TestSeriesContext } from "@/providers/testSeriesProvider";
import Loading from "@/app/loading";
import { TestContext } from "@/providers/testProvider";
import { uploadImage } from "@/utils/functions/imageControls";
import { CiSearch } from "react-icons/ci";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTests, setSelectedTests] = useState([]);

  const filteredTests = tests.filter((course) =>
    course.testTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTestSelection = (e, id) => {
    if (e.target.checked) {
      setSelectedTests((prevSelectedTests) => [...prevSelectedTests, id]);
    } else {
      setSelectedTests((prevSelectedTests) =>
        prevSelectedTests.filter((testId) => testId !== id)
      );
    }
  };

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
        tests: selectedTests,
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

      setFormData({
        packageName: "",
        price: "",
        discountedPrice: "",
        startingDate: "",
        packageImage: null,
        packageDescription: "",
      });
      setImagePreview(null);
      setSelectedTests([]);
      setImageFile(null);
      toast.success("Test package created successfully!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating Test package:", err);
      toast.error("Failed to create Test package. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalToggle = () => {
    if (isModalOpen) {
      // Modal is being closed, reset form states
      setSelectedTests([]); // Clear selected tests
      setFormState(initialFormState); // Reset other form fields if necessary
    }
    setIsModalOpen(!isModalOpen);
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
    setSelectedTests([]);
    setImageFile(null);
    setIsModalOpen(false);
  };
  return (
    <div className="p-4 relative">
      <ToastContainer />
      <div className="flex justify-between mb-6 ">
        <div className="text-[28px] font-medium ">Test Packages</div>
        <div
          className="flex bg-[#5D5FEF] cursor-pointer items-center text-white rounded-lg pl-1 pr-3"
          onClick={handleModalToggle}
        >
          <div className="text-[26px] px-2">+</div>
          <button className="my-auto">Create Test Package</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="absolute top-0 left-0 flex items-center w-full md:h-screen h-full bg-background00 ">
          <div className="w-[85vw] md:mx:0 mx-auto -mt-10">
            <div className="bg-white  mx-auto rounded-lg shadow-lg md:w-[66vw]  relative max-h-[78vh] ">
              <div className="bg-background05 p-3 h-14 rounded-t-lg ">
                <h2 className="text-xl font-medium text-background01 ">
                  Create Test Package
                </h2>
              </div>
              <div className="md:px-6 px-4 bg-background06 overflow-y-scroll max-h-[74vh] border border-[#9999A4] rounded-b-lg">
                <form onSubmit={handlePackageCreation}>
                  <div className="md:flex items-center xl:gap-12 lg:gap-10">
                    <div className="mb-4 mt-4">
                      <label className="block text-15px font-semibold text-neutral02">
                        Package Name:
                      </label>
                      <input
                        type="text"
                        name="packageName"
                        value={formData.packageName}
                        onChange={handleInputChange}
                        placeholder="Enter Name"
                        className="mt-1 block  p-2 border border-gray-300 w-full rounded xl:w-[45vw] lg:w-[43vw]"
                        required
                      />
                    </div>
                    <div className="md:mb-0 mb-4">
                      <label className="block text-15px font-semibold text-neutral02">
                        Starting Date:
                      </label>
                      <input
                        type="date"
                        name="startingDate"
                        value={formData.startingDate}
                        onChange={handleInputChange}
                        className="mt-1 block p-2 border border-gray-300 md:w-[14vw] w-full rounded"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-15px font-semibold text-neutral02">
                      Package Description:
                    </label>
                    <input
                      name="packageDescription"
                      value={formData.packageDescription}
                      onChange={handleInputChange}
                      placeholder="Enter Package Description"
                      className="mt-1 block p-2 border border-gray-300 rounded h-10 w-full"
                      required
                    />
                  </div>
                  <div className="flex justify-end text-[#AAAAAA] text-14px">
                    <p>Max. 100 characters</p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-18px font-medium mb-2">
                      Package Image
                    </label>
                    <div className="flex items-center justify-center w-full bg-background05 bg-opacity-5 p-2 md:border-2 border border-background05 border-dashed rounded-lg text-center">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer md:flex gap-4 items-center text-gray-500 hover:text-blue-500"
                      >
                        <div className="flex items-center gap-2">
                        <img src="/Upload icon.svg" alt="" className="w-6" />
                        <p className="text-16px font-semibold">
                          Drag & drop files or{" "}
                          <span className="text-background05 underline">
                            Browse
                          </span>
                        </p>
                        </div>
                        <p className="text-xs text-gray-400">
                          Supported formats: JPEG, PNG
                        </p>
                      </label>
                    </div>

                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Selected Package"
                        className="mt-4 h-32 w-32 object-cover border border-gray-300 rounded"
                      />
                    )}
                  </div>

                  <div className="md:flex w-full gap-4">
                    <div className="md:w-[35%] ">
                      <div className="mb-4">
                        <label className="block text-15px text-neutral02">
                          Package Price (without discount)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="price"
                          value={formData.price}
                          placeholder="Price"
                          onChange={handleInputChange}
                          className="mt-1 block md:w-[20vw] w-full  p-2 border border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-15px text-neutral02">
                          Discounted Price:
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="discountedPrice"
                          value={formData.discountedPrice}
                          onChange={handleInputChange}
                          placeholder="Discounted Price"
                          className="mt-1 block md:w-[20vw] w-full p-2 border border-gray-300 rounded"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4 md:w-[65%]">
                      <h3 className="text-15px font-semibold text-neutral02 mb-2">
                        Test Subjects Selection
                      </h3>
                      <div className="relative flex mb-2 justify-center items-center w-full border border-gray-300 rounded-xl p-2 pl-10 text-sm">
                        <input
                          type="text"
                          placeholder="Search subject here..."
                          className="focus:outline-none"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <CiSearch />
                      </div>
                      <div className="grid md:grid-cols-2 grid-cols-1 md:mt-0 mt-4 gap-4 overflow-y-scroll max-h-48">
                        {filteredTests.map((course) => (
                          <label
                            key={course.id}
                            className="flex items-center space-x-2 text-gray-800 text-sm"
                          >
                            <input
                              type="checkbox"
                              value={course.id}
                              checked={selectedTests.includes(course.id)}
                              onChange={(e) =>
                                handleTestSelection(e, course.id)
                              }
                              className="accent-teal-600 w-5 h-5 rounded-xl focus:ring-teal-500"
                            />
                            <span className="font-medium">
                              {course.testTitle}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-b-lg sticky bottom-0 border-gray-300">
                 
<div className="flex justify-between py-4  bg-background06  ">

                    <button
                      type="submit"
                      className={`bg-background05 md:text:md  text-sm text-white px-2 md:px-6 py-2 rounded-md 
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={isLoading}
                    >
                      {isLoading ? "loading..." : "Create Package"}
                    </button>
                    <button
                      type="button"
                      onClick={handleOnClose}
                      className=" text-[#9999A4] md:text:md text-sm border border-[#9999A4] px-6 py-2 rounded-md mr-2"
                    >
                      Cancel
                    </button>
</div>
                    </div>
               
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <TestPackagesList />
    </div>
  );
};

export default Page;
