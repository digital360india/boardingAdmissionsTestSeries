"use client";
import React, { useState, useEffect } from "react";
import { db, storage } from "@/firebase/firebase";
import { addDoc, collection, updateDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import showError from "@/utils/functions/showError";
import "@/components/admin/ScrollbarCss.css";

const AddCourseDialog = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    courseName: "",
    heroImage: "",
    thumbnailImage: "",
    mobileViewImage: "",
    description: "",
    targetedSchools: [],
    targetedBoards: [],
    price: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [schoolsList, setSchoolsList] = useState([]);
  const [boardsList, setBoardsList] = useState([]);
  const router = useRouter();

   useEffect(() => {
        if (isOpen) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "auto";
        }
    
        // Cleanup function to reset overflow when component unmounts
        return () => {
          document.body.style.overflow = "auto";
        };
      }, [isOpen]);
  useEffect(() => {
    const fetchSchoolsAndBoards = async () => {
      try {
        const schoolsSnapshot = await getDocs(collection(db, "schools"));
        const fetchedSchools = schoolsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSchoolsList(fetchedSchools);

        const boardsSnapshot = await getDocs(collection(db, "boards"));
        const fetchedBoards = boardsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBoardsList(fetchedBoards);
      } catch (err) {
        setError("Failed to fetch schools or boards. Please try again.");
        showError(err.message);
        console.error("Error fetching data:", err);
      }
    };

    fetchSchoolsAndBoards();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e, type) => {
    const value = e.target.value;

    if (type === "schools") {
      setFormData((prevData) => ({
        ...prevData,
        targetedSchools: prevData.targetedSchools.includes(value)
          ? prevData.targetedSchools.filter((id) => id !== value)
          : [...prevData.targetedSchools, value],
      }));
    } else if (type === "boards") {
      setFormData((prevData) => ({
        ...prevData,
        targetedBoards: prevData.targetedBoards.includes(value)
          ? prevData.targetedBoards.filter((id) => id !== value)
          : [...prevData.targetedBoards, value],
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const { name } = e.target;

    if (!file) return;

    setLoading(true);
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        setError("Failed to upload image. Please try again.");
        console.error("Image upload error:", error);
        setLoading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prevData) => ({
          ...prevData,
          [name]: downloadURL,
        }));
        setLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      courseName,
      heroImage,
      thumbnailImage,
      mobileViewImage,
      description,
      targetedSchools,
      targetedBoards,
      price,
    } = formData;

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "courses"), {
        courseName,
        heroImage,
        thumbnailImage,
        mobileViewImage,
        description,
        targetedSchools,
        targetedBoards,
        createdAt: new Date(),
        price,
      });

      await updateDoc(docRef, { id: docRef.id });
      setSuccess("Course added successfully!");
      setFormData({
        courseName: "",
        heroImage: "",
        thumbnailImage: "",
        mobileViewImage: "",
        description: "",
        targetedSchools: [],
        targetedBoards: [],
        price: "",
      });
      router.refresh();
    } catch (err) {
      setError("Failed to add course. Please try again.");
      showError(err.message);
      console.error("Error adding course:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 text-sm rounded-lg"
      onClick={onClose}
    >
      <div
        className="bg-background00  rounded-lg shadow-lg max-w-5xl w-full  relative z-50 border-2 border-background05 "
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className=" bg-background05 p-4 text-white text-2xl font-semibold text-center rounded-t-lg">
          Add New Course
        </h2>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-2">
            <label className="block text-15px font-semibold text-neutral02">
              Course Name:
            </label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex gap-2">
            <div className="mb-2">
              <label className="block text-15px font-semibold text-neutral02">
                Hero Image:
              </label>
              <input
                type="file"
                name="heroImage"
                onChange={handleImageUpload}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-2">
              <label className="block text-15px font-semibold text-neutral02">
                Thumbnail Image:
              </label>
              <input
                type="file"
                name="thumbnailImage"
                onChange={handleImageUpload}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-2">
              <label className="block text-15px font-semibold text-neutral02">
                Mobile View Image:
              </label>
              <input
                type="file"
                name="mobileViewImage"
                onChange={handleImageUpload}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-15px font-semibold text-neutral02">
              Description:
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="mb-2">
            <label className="block text-15px font-semibold text-neutral02">
              Course Price:
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="flex justify-between">
            <div>
              <label className="block text-15px font-semibold text-neutral02">
                Schools Being Targeted:
              </label>
              <div className="mb-2 h-24  overflow-y-scroll custom-scrollbar border border-gray-300 p-2">
                {schoolsList.map((school) => (
                  <div key={school.id}>
                    <label>
                      <input
                        type="checkbox"
                        value={school.id}
                        checked={formData.targetedSchools.includes(school.id)}
                        onChange={(e) => handleCheckboxChange(e, "schools")}
                      />
                      {school.schoolName}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-15px font-semibold text-neutral02 ">
                Boards Being Targeted:
              </label>
              <div className="mb-2 h-24 overflow-y-scroll custom-scrollbar border border-gray-300 p-2">
                {boardsList.map((board) => (
                  <div key={board.id}>
                    <label>
                      <input
                        type="checkbox"
                        value={board.id}
                        checked={formData.targetedBoards.includes(board.id)}
                        onChange={(e) => handleCheckboxChange(e, "boards")}
                      />
                      {board.boardName}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex   justify-between pt-3">
            <button
              type="submit"
              className="bg-background05 text-white py-2 px-4 rounded-md"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Course"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[#9999A4] border-[#9999A4] py-2 px-4 rounded-md border"
            >
              Cancel
            </button>
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}
          {success && <p className="text-green-500 mt-4">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddCourseDialog;
