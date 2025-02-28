"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/firebase/firebase";
import {
  doc,
  deleteDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { CiClock2 } from "react-icons/ci";
import { MdGroups, MdDelete, MdEdit } from "react-icons/md";

const CoursePackagesList = ({ coursePackages, onDelete, setIsModalOpen }) => {
  const [editingPackage, setEditingPackage] = useState(null);
  const [deletingPackage, setDeletingPackage] = useState(null);

  const [editFormData, setEditFormData] = useState({
    packageName: "",
    price: "",
    discountedPrice: "",
    studentsEnrolled: "",
    startingDate: "",
    boards: [],
    schools: [],
    targetedTestPackages: [],
    courses: [],
  });
  const [boards, setBoards] = useState([]);
  const [schools, setSchools] = useState([]);
  const [testPackages, setTestPackage] = useState([]);
  const [courses, setCourses] = useState([]);
  const [coursePackagesState, setCoursePackagesState] =
    useState(coursePackages);

  useEffect(() => {
    if (editingPackage || deletingPackage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [editingPackage, deletingPackage]);
  const fetchBoardsAndSchools = async () => {
    try {
      const boardsSnapshot = await getDocs(collection(db, "boards"));
      const schoolsSnapshot = await getDocs(collection(db, "schools"));
      const testPackagesSnapshot = await getDocs(
        collection(db, "testPackages")
      );
      const courseSnapshot = await getDocs(collection(db, "courses"));

      const boardsData = boardsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const schoolsData = schoolsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const coursesData = courseSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const testPackageData = testPackagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestPackage(testPackageData);
      setCourses(coursesData);
      setBoards(boardsData);
      setSchools(schoolsData);
    } catch (err) {
      console.error("Error fetching boards and schools:", err);
    }
  };

  const fetchCoursePackages = async () => {
    try {
      const packagesSnapshot = await getDocs(collection(db, "coursePackages"));
      const packagesData = packagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCoursePackagesState(packagesData);
    } catch (err) {
      console.error("Error fetching course packages:", err);
    }
  };

  useEffect(() => {
    fetchBoardsAndSchools();
    fetchCoursePackages();
  }, []);

  useEffect(() => {
    setCoursePackagesState(coursePackages);
  }, [coursePackages]);

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setEditFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value),
      }));
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };

  const handleEdit = async (packageId) => {
    try {
      const packageRef = doc(db, "coursePackages", packageId);
      await updateDoc(packageRef, {
        ...editFormData,
        price: parseFloat(editFormData.price),
        discountedPrice: parseFloat(editFormData.discountedPrice),
        studentsEnrolled: parseInt(editFormData.studentsEnrolled, 10),
        startingDate: new Date(editFormData.startingDate).toISOString(),
      });
      setEditingPackage(null);
      fetchCoursePackages();
    } catch (err) {
      console.error("Error updating course package:", err);
      alert("Failed to update course package.");
    }
  };

  const handleDelete = async (packageId) => {
    try {
      await deleteDoc(doc(db, "coursePackages", packageId));
      fetchCoursePackages();
      onDelete(packageId);
      setDeletingPackage(null);
    } catch (err) {
      console.error("Error deleting course package:", err);
      alert("Failed to delete course package.");
    }
  };

  const getBoardName = (boardId) =>
    boards.find((board) => board.id === boardId)?.boardName || "Unknown";
  const getSchoolName = (schoolId) =>
    schools.find((school) => school.id === schoolId)?.schoolName || "Unknown";
  const getTestPackageName = (testpackageID) =>
    testPackages.find((testpackage) => testpackage.id === testpackageID)
      ?.packageName || "Unknown";
  const getCourseName = (courseId) =>
    courses.find((course) => course.id === courseId)?.courseName || "Unknown";

  return (
    <div className="  min-h-screen  px-4 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between pb-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 ">
            Course Packages
          </h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 transition "
          >
            <span className="font-bold text-[20px]">+</span> Create Course
            Package
          </button>
        </div>
        <div className="">
          {coursePackagesState.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coursePackagesState.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl relative z-0"
                >
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={pkg?.image ? pkg.image : "/navbar.svg"}
                      alt={pkg?.packageName}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="p-5 ">
                    <div className="mb-10">
                      <h3 className="text-xl font-bold text-[#151D48] line-clamp-2">
                        {pkg.packageName}
                      </h3>

                      <div className="flex flex-col gap-1 text-right">
                        <span className="text-gray-500 line-through">
                          ₹{pkg.price}
                        </span>

                        <span className="text-xl font-bold text-green-600">
                          ₹{pkg.discountedPrice}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center">
                          <CiClock2 />
                          <span className="ml-2 text-gray-600">
                            Starting:{" "}
                            {new Date(pkg.startingDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <MdGroups />

                          <span className="ml-2 text-gray-600">
                            {pkg.studentsEnrolled} Students Enrolled
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4 space-y-2">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500">
                            Targeted Boards:
                          </h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(pkg.boards || []).map((boardId) => (
                              <span
                                key={boardId}
                                className="inline-block bg-[#075D70] text-white text-xs px-2 py-1 rounded"
                              >
                                {getBoardName(boardId)}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-500">
                            Targeted Test Packages:
                          </h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(pkg.targetedTestPackages || []).map((testId) => (
                              <span
                                key={testId}
                                className="inline-block bg-[#075D70] text-white text-xs px-2 py-1 rounded"
                              >
                                {getTestPackageName(testId)}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-500">
                            Courses:
                          </h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(pkg.courses || []).map((courseId) => (
                              <span
                                key={courseId}
                                className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                              >
                                {getCourseName(courseId)}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-500">
                            Targeted Schools:
                          </h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(pkg.schools || []).map((schoolId) => (
                              <span
                                key={schoolId}
                                className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                              >
                                {getSchoolName(schoolId)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="absolute left-6 bottom-5">
                        <div className="flex gap-4">
                          <div
                            onClick={() => {
                              setEditingPackage(pkg.id);
                              setEditFormData({
                                packageName: pkg.packageName,
                                price: pkg.price,
                                discountedPrice: pkg.discountedPrice,
                                studentsEnrolled: pkg.studentsEnrolled,
                                startingDate: new Date(pkg.startingDate)
                                  .toISOString()
                                  .split("T")[0],
                                boards: pkg.boards || [],
                                targetedTestPackages:
                                  pkg.targetedTestPackages || [],
                                courses: pkg.courses || [],
                                schools: pkg.schools || [],
                              });
                            }}
                            className="text-yellow-500   cursor-pointer hover:text-yellow-600 border border-yellow-500 rounded-md"
                          >
                            <MdEdit className="w-6 h-6" />
                          </div>
                          <div
                            // onClick={() => handleDelete(pkg.id)}
                            onClick={() => setDeletingPackage(pkg.id)}
                            className=" text-red-500 hover:text-red-600 cursor-pointer font-bold border border-red-500 rounded-md"
                          >
                            <MdDelete className="w-6 h-6" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="mt-2">
                     <p>
                      <strong>Price:</strong> ₹{pkg.price}
                    </p>
                    <p>
                      <strong>Discounted Price:</strong>₹{pkg.discountedPrice}
                    </p> 
                     <p>
                      <strong>Students Enrolled:</strong> {pkg.studentsEnrolled}
                    </p>
                     <p>
                      <strong>Starting Date:</strong>{" "}
                      {new Date(pkg.startingDate).toLocaleDateString()}
                    </p> 
                     <p>
                      <strong>Targeted Boards:</strong>{" "}
                      {(pkg.boards || []).map(getBoardName).join(", ")}
                    </p> 
                     <p>
                      <strong>Targeted Test Packages:</strong>{" "}
                      {(pkg.targetedTestPackages || [])
                        .map(getTestPackageName)
                        .join(", ")}
                    </p> 
                     <p>
                      <strong>Targeted Courses:</strong>{" "}
                      {(pkg.courses || []).map(getCourseName).join(", ")}
                    </p> 
                     <p>
                      <strong>Targeted Schools:</strong>{" "}
                      {(pkg.schools || []).map(getSchoolName).join(", ")}
                    </p> 
                  </div>*/}
                </div>
              ))}
            </div>
          ) : (
            <p>No course packages available.</p>
          )}
          {/* {editingPackage && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 bg-white">
                <div
                  className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                  aria-hidden="true"
                ></div>{" "}
                <h4 className="text-lg font-bold mb-4">Edit Package</h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEdit(editingPackage);
                  }}
                >
                  <div className="flex justify-between">
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Package Name:
                      </label>
                      <input
                        type="text"
                        name="packageName"
                        value={editFormData.packageName}
                        onChange={handleEditChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Price:</label>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={editFormData.price}
                        onChange={handleEditChange}
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
                        value={editFormData.discountedPrice}
                        onChange={handleEditChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Number of Students Enrolled:
                      </label>
                      <input
                        type="number"
                        name="studentsEnrolled"
                        value={editFormData.studentsEnrolled}
                        onChange={handleEditChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Starting Date:
                      </label>
                      <input
                        type="date"
                        name="startingDate"
                        value={editFormData.startingDate}
                        onChange={handleEditChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Targeted Boards:
                      </label>
                      <div className="mt-2">
                        {boards.map((board) => (
                          <div key={board.id}>
                            <label>
                              <input
                                type="checkbox"
                                name="boards"
                                value={board.id}
                                checked={editFormData.boards.includes(board.id)}
                                onChange={handleEditChange}
                                className="mr-2"
                              />
                              {board.boardName}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4 ">
                      <label className="block text-gray-700">
                        Targeted Schools:
                      </label>
                      <div className="mt-2 overflow-y-scroll h-[150px]">
                        {schools.map((school) => (
                          <div key={school.id}>
                            <label>
                              <input
                                type="checkbox"
                                name="schools"
                                value={school.id}
                                checked={editFormData.schools.includes(
                                  school.id
                                )}
                                onChange={handleEditChange}
                                className="mr-2"
                              />
                              {school.schoolName}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4 ">
                      <label className="block text-gray-700">
                        Test Packages:
                      </label>
                      <div className="mt-2 overflow-y-scroll h-[150px]">
                        {testPackages.map((testpackage) => (
                          <div key={testpackage.id}>
                            <label>
                              <input
                                type="checkbox"
                                name="targetedTestPackages"
                                value={testpackage.id}
                                checked={editFormData.targetedTestPackages.includes(
                                  testpackage.id
                                )}
                                onChange={handleEditChange}
                                className="mr-2"
                              />
                              {testpackage.packageName}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4 ">
                      <label className="block text-gray-700">Courses:</label>
                      <div className="mt-2 overflow-y-scroll h-[150px]">
                        {courses.map((course) => (
                          <div key={course.id}>
                            <label>
                              <input
                                type="checkbox"
                                name="courses"
                                value={course.id}
                                checked={editFormData.courses.includes(
                                  course.id
                                )}
                                onChange={handleEditChange}
                                className="mr-2"
                              />
                              {course.courseName}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingPackage(null)}
                      className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )} */}

          {editingPackage && (
            <div className="fixed inset-0 z-50 overflow-y-auto ">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ">
                <div className="fixed inset-0 bg-black/50 transition-opacity"></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                  &#8203;
                </span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
                  {/* <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"> */}
                  <div className="bg-white ">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <h3 className="text-2xl leading-6 font-semibold text-center text-white bg-background05 p-4">
                          Edit Package
                        </h3>
                        <div className="px-4 pt-5 pb-4 sm:p-4 sm:pb-4">
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleEdit(editingPackage);
                            }}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                              <div>
                                <label className="block text-15px font-semibold text-neutral02">
                                  Package Name
                                </label>
                                <input
                                  type="text"
                                  name="packageName"
                                  value={editFormData.packageName}
                                  onChange={handleEditChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3  sm:text-sm"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-15px font-semibold text-neutral02">
                                  Price (₹)
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  name="price"
                                  value={editFormData.price}
                                  onChange={handleEditChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3  sm:text-sm"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-15px font-semibold text-neutral02">
                                  Discounted Price (₹)
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  name="discountedPrice"
                                  value={editFormData.discountedPrice}
                                  onChange={handleEditChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3  sm:text-sm"
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div>
                                <label className="block text-15px font-semibold text-neutral02">
                                  Students Enrolled
                                </label>
                                <input
                                  type="number"
                                  name="studentsEnrolled"
                                  value={editFormData.studentsEnrolled}
                                  onChange={handleEditChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3  sm:text-sm"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-15px font-semibold text-neutral02">
                                  Starting Date
                                </label>
                                <input
                                  type="date"
                                  name="startingDate"
                                  value={editFormData.startingDate}
                                  onChange={handleEditChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3  sm:text-sm"
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                              <div>
                                <label className="block text-15px font-semibold text-neutral02 mb-2">
                                  Targeted Boards
                                </label>
                                <div className="border border-gray-300 rounded-md p-3 h-48 overflow-y-auto custom-scrollbar">
                                  {boards.map((board) => (
                                    <div
                                      key={board.id}
                                      className="flex items-start mb-2"
                                    >
                                      <input
                                        type="checkbox"
                                        id={`board-${board.id}`}
                                        name="boards"
                                        value={board.id}
                                        checked={editFormData.boards.includes(
                                          board.id
                                        )}
                                        onChange={handleEditChange}
                                        className="mt-1 h-4 w-4 accent-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                      />
                                      <label
                                        htmlFor={`board-${board.id}`}
                                        className="ml-2 block text-sm text-gray-700"
                                      >
                                        {board.boardName}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="block text-15px font-semibold text-neutral02 mb-2">
                                  Targeted Schools
                                </label>
                                <div className="border border-gray-300 rounded-md p-3 h-48 overflow-y-auto custom-scrollbar">
                                  {schools.map((school) => (
                                    <div
                                      key={school.id}
                                      className="flex items-start mb-2"
                                    >
                                      <input
                                        type="checkbox"
                                        id={`school-${school.id}`}
                                        name="schools"
                                        value={school.id}
                                        checked={editFormData.schools.includes(
                                          school.id
                                        )}
                                        onChange={handleEditChange}
                                        className="mt-1 h-4 w-4 accent-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                      />
                                      <label
                                        htmlFor={`school-${school.id}`}
                                        className="ml-2 block text-sm text-gray-700"
                                      >
                                        {school.schoolName}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="block text-15px font-semibold text-neutral02 mb-2">
                                  Test Packages
                                </label>
                                <div className="border border-gray-300 rounded-md p-3 h-48 overflow-y-auto custom-scrollbar">
                                  {testPackages.map((testpackage) => (
                                    <div
                                      key={testpackage.id}
                                      className="flex items-start mb-2"
                                    >
                                      <input
                                        type="checkbox"
                                        id={`test-${testpackage.id}`}
                                        name="targetedTestPackages"
                                        value={testpackage.id}
                                        checked={editFormData.targetedTestPackages.includes(
                                          testpackage.id
                                        )}
                                        onChange={handleEditChange}
                                        className="mt-1 h-4 w-4 accent-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                      />
                                      <label
                                        htmlFor={`test-${testpackage.id}`}
                                        className="ml-2 block text-sm text-gray-700"
                                      >
                                        {testpackage.packageName}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="block text-15px font-semibold text-neutral02 mb-2">
                                  Courses
                                </label>
                                <div className="border border-gray-300 rounded-md p-3 h-48 overflow-y-auto custom-scrollbar">
                                  {courses.map((course) => (
                                    <div
                                      key={course.id}
                                      className="flex items-start mb-2"
                                    >
                                      <input
                                        type="checkbox"
                                        id={`course-${course.id}`}
                                        name="courses"
                                        value={course.id}
                                        checked={editFormData.courses.includes(
                                          course.id
                                        )}
                                        onChange={handleEditChange}
                                        className="mt-1 h-4 w-4 accent-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                      />
                                      <label
                                        htmlFor={`course-${course.id}`}
                                        className="ml-2 block text-sm text-gray-700"
                                      >
                                        {course.courseName}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="mt-8 flex justify-between">
                              <button
                                type="button"
                                onClick={() => setEditingPackage(null)}
                                className="mr-3 inline-flex justify-center py-2 px-4 border shadow-sm text-sm font-medium rounded-md text-[#9999A4] border-[#9999A4] "
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-background05"
                              >
                                Save Changes
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {deletingPackage && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="bg-background06 p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                <p className="mb-6">
                  Are you sure you want to delete this package?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setDeletingPackage(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deletingPackage)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePackagesList;
