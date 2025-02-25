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

const CoursePackagesList = ({ coursePackages, onDelete }) => {
  const [editingPackage, setEditingPackage] = useState(null);
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
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Course Packages</h2>
      {coursePackagesState.length > 0 ? (
        <ul>
          {coursePackagesState.map((pkg) => (
            <li key={pkg.id} className="mb-4 border-b pb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{pkg.packageName}</h3>
                <div>
                  <button
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
                        targetedTestPackages: pkg.targetedTestPackages || [],
                        courses: pkg.courses || [],
                        schools: pkg.schools || [],
                      });
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-2">
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
                {pkg.image && (
                  <img
                    src={pkg.image}
                    alt={pkg?.packageName}
                    className="mt-2 w-full h-auto max-w-xs rounded-md"
                  />
                )}
              </div>
              {editingPackage === pkg.id && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-[60vw] h-[500px] ">
                    <h4 className="text-lg font-bold mb-4">Edit Package</h4>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleEdit(pkg.id);
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
                                    checked={editFormData.boards.includes(
                                      board.id
                                    )}
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
                          <label className="block text-gray-700">
                            Courses:
                          </label>
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
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No course packages available.</p>
      )}
    </div>
  );
};

export default CoursePackagesList;
