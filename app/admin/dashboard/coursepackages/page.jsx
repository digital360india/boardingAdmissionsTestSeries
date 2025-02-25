"use client";
import React, { useState, useEffect, useContext } from "react";
import { db, storage } from "@/firebase/firebase";
import { collection, getDocs, addDoc, updateDoc } from "firebase/firestore";
import CoursePackagesList from "@/components/admin/AllCoursePackages";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { TestSeriesContext } from "@/providers/testSeriesProvider";
import { TestContext } from "@/providers/testProvider";

const Page = () => {
  const [courses, setCourses] = useState([]);
  const [schools, setSchools] = useState([]);
  const [boards, setBoards] = useState([]);
  const [coursePackages, setCoursePackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    packageName: "",
    price: "",
    discountedPrice: "",
    startingDate: "",
    thumbnailImage: "",
  });
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedTestPackage, setSelectedTestPackage] = useState([]);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");
  const [testPackageSearch, setTestPackageSearch] = useState("");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [thumbnailImageFile, setThumbnailImageFile] = useState(null);
  const { testPackages } = useContext(TestContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const courseList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(courseList);
      } catch (err) {
        setError("Failed to fetch courses. Please try again.");
        console.error("Error fetching courses:", err);
      }
    };

    const fetchSchools = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "schools"));
        const schoolList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSchools(schoolList);
      } catch (err) {
        setError("Failed to fetch schools. Please try again.");
        console.error("Error fetching schools:", err);
      }
    };

    const fetchBoards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "boards"));
        const boardList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBoards(boardList);
      } catch (err) {
        setError("Failed to fetch boards. Please try again.");
        console.error("Error fetching boards:", err);
      }
    };

    const fetchCoursePackages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "coursePackages"));
        const packageList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCoursePackages(packageList);
      } catch (err) {
        setError("Failed to fetch course packages. Please try again.");
        console.error("Error fetching course packages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
    fetchSchools();
    fetchBoards();
    fetchCoursePackages();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCourseSelection = (e, courseId) => {
    if (e.target.checked) {
      setSelectedCourses([...selectedCourses, courseId]);
    } else {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    }
  };

  const handleTestPackageSelection = (e, testpackageID) => {
    if (e.target.checked) {
      setSelectedTestPackage([...selectedTestPackage, testpackageID]);
    } else {
      setSelectedTestPackage(
        selectedTestPackage.filter((id) => id !== testpackageID)
      );
    }
  };

  const handleSchoolSelection = (e, schoolId) => {
    if (e.target.checked) {
      setSelectedSchools([...selectedSchools, schoolId]);
    } else {
      setSelectedSchools(selectedSchools.filter((id) => id !== schoolId));
    }
  };

  const handleBoardSelection = (e, boardId) => {
    if (e.target.checked) {
      setSelectedBoards([...selectedBoards, boardId]);
    } else {
      setSelectedBoards(selectedBoards.filter((id) => id !== boardId));
    }
  };

  const handlePackageCreation = async (e) => {
    e.preventDefault();

    let thumbnailImageUrl = "";
    if (thumbnailImageFile) {
      const storageRef = ref(storage, `thumbnails/${thumbnailImageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, thumbnailImageFile);

      try {
        await uploadTask;
        thumbnailImageUrl = await getDownloadURL(storageRef);
      } catch (err) {
        console.error("Error uploading thumbnail image:", err);
        setError("Failed to upload thumbnail image. Please try again.");
        return;
      }
    }

    try {
      const docRef =  await addDoc(collection(db, "coursePackages"), {
        ...formData,
        price: parseFloat(formData.price),
        discountedPrice: parseFloat(formData.discountedPrice),
        startingDate: new Date(formData.startingDate).toISOString(),
        dateOfCreation: new Date().toISOString(),
        testPackages: selectedTestPackage,
        courses: selectedCourses,
        schools: selectedSchools,
        boards: selectedBoards,
        thumbnailImage: thumbnailImageUrl,
      });

      await updateDoc(docRef, { id: docRef.id });

      const querySnapshot = await getDocs(collection(db, "coursePackages"));
      const packageList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCoursePackages(packageList);

      setFormData({
        packageName: "",
        price: "",
        discountedPrice: "",
        startingDate: "",
        thumbnailImage: "",
      });
      setSelectedCourses([]);
      setSelectedTestPackage([]);
      setSelectedSchools([]);
      setSelectedBoards([]);
      setThumbnailImageFile(null);
      setIsModalOpen(false);
      alert("Course package created successfully!");
    } catch (err) {
      console.error("Error creating course package:", err);
      setError("Failed to create course package. Please try again.");
    }
  };
  const handleFileChange = (e) => {
    setThumbnailImageFile(e.target.files[0]); // Set the file
  };
  const handleDelete = async (packageId) => {
    try {
      await getDocs(collection(db, "coursePackages"));
      setCoursePackages((prevPackages) =>
        prevPackages.filter((pkg) => pkg.id !== packageId)
      );
    } catch (err) {
      console.error("Error updating course packages:", err);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const filteredSchools = schools.filter((school) =>
    school.schoolName.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  return (
    <div className="p-4">
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition "
      >
        Create Course Package
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[80vw] relative max-h-screen overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Create Course Package</h2>
            <form onSubmit={handlePackageCreation}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="mb-4 w-1/2">
                  <label className="block text-gray-700">Package Name:</label>
                  <input
                    type="text"
                    name="packageName"
                    value={formData.packageName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4 w-1/2">
                  <label className="block text-gray-700">
                    Thumbnail Image:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="mb-4 w-1/4">
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
                <div className="mb-4  w-1/4">
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
                <div className="mb-4  w-1/4">
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
              <div className="flex gap-4">
                <div className="mb-4 flex flex-col h-48 w-1/4 border p-2 rounded">
                  <h3 className="text-lg font-semibold mb-2">
                    Select Courses:
                  </h3>
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="mb-2 p-2 border border-gray-300 rounded"
                  />
                  <div className="h-32 overflow-y-auto">
                    {loading ? (
                      <p>Loading courses...</p>
                    ) : error ? (
                      <p className="text-red-500">{error}</p>
                    ) : (
                      <div className="space-y-2">
                        {filteredCourses.map((course) => (
                          <div
                            key={course.id}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCourses.includes(course.id)}
                              onChange={(e) =>
                                handleCourseSelection(e, course.id)
                              }
                            />
                            <span>{course.courseName}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-4 flex flex-col h-48 w-1/4 border p-2 rounded">
                  <h3 className="text-lg font-semibold mb-2">
                    Select Test Package:
                  </h3>
                  <input
                    type="text"
                    placeholder="Search test packages..."
                    value={testPackageSearch}
                    onChange={(e) => setTestPackageSearch(e.target.value)}
                    className="mb-2 p-2 border border-gray-300 rounded"
                  />
                  <div className="h-32 overflow-y-auto">
                    {loading ? (
                      <p>Loading test packages...</p>
                    ) : error ? (
                      <p className="text-red-500">{error}</p>
                    ) : (
                      <div className="space-y-2">
                        {testPackages.map((testpackage) => (
                          <div
                            key={testpackage.id}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={selectedTestPackage.includes(
                                testpackage.id
                              )}
                              onChange={(e) =>
                                handleTestPackageSelection(e, testpackage.id)
                              }
                            />
                            <span>{testpackage.packageName}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-4 flex flex-col h-48  w-1/4 border p-2 rounded">
                  <h3 className="text-lg font-semibold mb-2">
                    Select Schools:
                  </h3>
                  <input
                    type="text"
                    placeholder="Search schools..."
                    value={schoolSearch}
                    onChange={(e) => setSchoolSearch(e.target.value)}
                    className="mb-2 p-2 border border-gray-300 rounded"
                  />
                  <div className="h-32 overflow-y-auto">
                    {loading ? (
                      <p>Loading schools...</p>
                    ) : error ? (
                      <p className="text-red-500">{error}</p>
                    ) : (
                      <div className="space-y-2">
                        {filteredSchools.map((school) => (
                          <div
                            key={school.id}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSchools.includes(school.id)}
                              onChange={(e) =>
                                handleSchoolSelection(e, school.id)
                              }
                            />
                            <span>{school.schoolName}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-4 w-1/4 h-48 border p-2 rounded">
                  <h3 className="text-lg font-semibold mb-2">Select Boards:</h3>
                  <div className="space-y-2 h-32 overflow-y-scroll">
                    {boards.map((board) => (
                      <div key={board.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedBoards.includes(board.id)}
                          onChange={(e) => handleBoardSelection(e, board.id)}
                        />
                        <span>{board.boardName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
              >
                Create Package
              </button>
            </form>
          </div>
        </div>
      )}

      <CoursePackagesList
        coursePackages={coursePackages}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Page;
