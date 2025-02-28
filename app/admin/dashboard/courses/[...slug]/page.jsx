"use client";
import React, { useEffect, useRef, useState } from "react";
import { db } from "@/firebase/firebase";
import { doc, getDoc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDocs, collection } from "firebase/firestore";
import { FiPenTool, FiVideo } from "react-icons/fi";
import { MdAutoDelete, MdDelete, MdEdit, MdFolderDelete } from "react-icons/md";
import { FaWindowClose } from "react-icons/fa";
import "@/components/admin/ScrollbarCss.css";

const CoursePage = () => {
  const router = useRouter();
  const currentPage = usePathname();
  const pathArray = currentPage.split("/");
  const uniqueID = pathArray[pathArray.length - 1];
  const fileInputRef = useRef(null);
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newChapter, setNewChapter] = useState({
    chapterName: "",
    lectures: [],
  });
  const [meetingDate, setMeetingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [inputKey, setInputKey] = useState(Date.now()); // Key to force re-render
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const [videoLink, setVideoLink] = useState("");
  const [schoolsList, setSchoolsList] = useState([]);
  const [boardsList, setBoardsList] = useState([]);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(null);
  const [selectedLectureIndex, setSelectedLectureIndex] = useState(null);
  const [isEditingLecture, setIsEditingLecture] = useState(false);
  const [showLectureDialog, setShowLectureDialog] = useState(false);
  const [newLectureDescription, setNewLectureDescription] = useState("");
  const [lectureData, setLectureData] = useState({
    name: "",
    videoUrl: "",
    pdfs: [],
  });
  const [deletingLecture, setDeletingLecture] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const docRef = doc(db, "courses", uniqueID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const courseData = docSnap.data();

          setCourse({
            ...courseData,
            targetedSchools: courseData.targetedSchools || [],
            targetedBoards: courseData.targetedBoards || [],
          });
        } else {
          setError("Course not found");
        }
      } catch (err) {
        setError("Failed to fetch course data.");
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
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
        console.error("Error fetching data:", err);
      }
    };

    fetchSchoolsAndBoards();
    fetchCourse();
  }, [uniqueID]);

  useEffect(() => {
    if (deletingLecture) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [deletingLecture]);
  const handleCourseUpdate = async () => {
    try {
      const docRef = doc(db, "courses", uniqueID);
      await updateDoc(docRef, course);
      alert("Course updated successfully");
    } catch (err) {
      console.error("Error updating course:", err);
      alert("Failed to update course");
    }
  };

  const handleDeleteLecture = async (chapterIndex, lectureIndex) => {
    try {
      const updatedChapters = [...course.chapters];
      updatedChapters[chapterIndex].lectures.splice(lectureIndex, 1);

      const docRef = doc(db, "courses", uniqueID);
      await updateDoc(docRef, { chapters: updatedChapters });

      setCourse((prev) => ({ ...prev, chapters: updatedChapters }));

      alert("Lecture deleted successfully");
      setDeletingLecture(null);
    } catch (err) {
      console.error("Error deleting lecture:", err);
      alert("Failed to delete lecture");
    }
  };
  const handleAddChapter = async () => {
    if (newChapter.chapterName.trim() === "") {
      alert("Chapter name cannot be empty");
      return;
    }

    try {
      const filteredLectures = newChapter.lectures.filter(
        (lecture) =>
          lecture.name.trim() !== "" ||
          lecture.pdfs.some((pdf) => pdf.trim() !== "")
      );

      const updatedChapters = [
        ...(course.chapters || []),
        { ...newChapter, lectures: filteredLectures },
      ];
      const docRef = doc(db, "courses", uniqueID);
      await updateDoc(docRef, { chapters: updatedChapters });
      setCourse((prev) => ({ ...prev, chapters: updatedChapters }));
      setNewChapter({
        chapterName: "",
        lectures: [],
      });
      alert("Chapter added successfully");
    } catch (err) {
      console.error("Error adding chapter:", err);
      alert("Failed to add chapter");
    }
  };
  const handleDeletePdf = async (chapterIndex, lectureIndex, pdfIndex) => {
    try {
      const courseRef = doc(db, "courses", uniqueID);
      const courseSnap = await getDoc(courseRef);

      if (courseSnap.exists()) {
        const courseData = courseSnap.data();
        const updatedChapters = [...courseData.chapters];

        // Remove the PDF from the PDFs array
        const updatedPdfs = updatedChapters[chapterIndex].lectures[
          lectureIndex
        ].pdfs.filter((pdf, index) => index !== pdfIndex);

        // Update the lecture with the new PDFs array
        updatedChapters[chapterIndex].lectures[lectureIndex].pdfs = updatedPdfs;

        // Update the document in Firestore
        await updateDoc(courseRef, { chapters: updatedChapters });

        // Update the course and lectureData state
        setCourse((prevCourse) => ({
          ...prevCourse,
          chapters: updatedChapters,
        }));

        // Update the lectureData to reflect the deletion
        setLectureData((prevData) => ({
          ...prevData,
          pdfs: updatedPdfs,
        }));

        console.log("PDF deleted successfully");
      } else {
        setError("No such document!");
      }
    } catch (err) {
      console.error("Error deleting PDF:", err);
    }
  };
  const handleAddVideoLink = async (
    chapterIndex,
    lectureIndex,
    link,
    meetingDate,
    startTime,
    endTime
  ) => {
    try {
      const courseRef = doc(db, "courses", uniqueID);
      const courseSnap = await getDoc(courseRef);

      if (courseSnap.exists()) {
        const courseData = courseSnap.data();
        const updatedChapters = [...courseData.chapters];
        const lecture = updatedChapters[chapterIndex].lectures[lectureIndex];
        lecture.videoLink = link;
        lecture.meetingDate = meetingDate;
        lecture.startTime = startTime;
        lecture.endTime = endTime;
        await updateDoc(courseRef, { chapters: updatedChapters });
        const chapterName = updatedChapters[chapterIndex].chapterName;
        const lectureName =
          updatedChapters[chapterIndex].lectures[lectureIndex].name;
        const lectureTime = new Date().toISOString();
        const teacherName = courseData.facultyname || "";
        const courseID = uniqueID;
        const startDateTime = new Date(
          `${meetingDate}T${startTime}`
        ).toISOString();
        const endDateTime = new Date(`${meetingDate}T${endTime}`).toISOString();
        const liveLectureRef = collection(db, "liveLecture");
        await addDoc(liveLectureRef, {
          chapterName,
          courseID,
          lectureName,
          lectureTime,
          teacherName,
          link,
          startDateTime,
          endDateTime,
        });
        setMeetingDate("");
        setStartTime("");
        setEndTime("");
        alert(
          "Video link, start time, and end time added, and live lecture created successfully"
        );
      } else {
        console.error("No such course document!");
      }
    } catch (err) {
      console.error("Error adding video link, times, and live lecture:", err);
    }
  };

  const addLectureField = () => {
    setNewChapter({
      ...newChapter,
      lectures: [
        ...newChapter.lectures,
        { name: "", videoUrl: "", creationDate: "", pdfs: [] },
      ],
    });
  };
  const handleLectureEdit = (chapterIndex, lectureIndex) => {
    const lectureToEdit = course.chapters[chapterIndex].lectures[lectureIndex];
    setLectureData({ ...lectureToEdit });
    setSelectedChapterIndex(chapterIndex);
    setSelectedLectureIndex(lectureIndex);
    setIsEditingLecture(true);
  };
  const openModal = (chapterIndex, lectureIndex) => {
    setVideoLink(
      course.chapters[chapterIndex].lectures[lectureIndex].videoLink || ""
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSaveVideoLink = (
    index,
    lIndex,
    videoLink,
    meetingDate,
    startTime,
    endTime
  ) => {
    handleAddVideoLink(
      index,
      lIndex,
      videoLink,
      meetingDate,
      startTime,
      endTime
    );
    setVideoLink("");
    closeModal();
  };

  const handleSaveLecture = async () => {
    if (selectedChapterIndex === null || selectedLectureIndex === null) return;

    const updatedChapters = [...course.chapters];
    updatedChapters[selectedChapterIndex].lectures[selectedLectureIndex] = {
      ...lectureData,
    };
    try {
      const docRef = doc(db, "courses", uniqueID);
      await updateDoc(docRef, { chapters: updatedChapters });
      setCourse((prev) => ({ ...prev, chapters: updatedChapters }));
      alert("Lecture updated successfully");
      setIsEditingLecture(false);
    } catch (err) {
      console.error("Error updating lecture:", err);
      alert("Failed to update lecture");
    }
  };
  const handleFileUpload = async (file) => {
    if (!file) return null;

    const storage = getStorage();
    const fileRef = ref(storage, `lectures/${file.name}`);
    await uploadBytes(fileRef, file);

    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  };

  const handleAddpdfs = async (chapterIndex, lectureIndex, type, file) => {
    try {
      const courseRef = doc(db, "courses", uniqueID);
      const courseSnap = await getDoc(courseRef);

      if (courseSnap.exists()) {
        const courseData = courseSnap.data();
        const updatedChapters = [...courseData.chapters];
        const newPdfUrl = await handleFileUpload(file);
        if (newPdfUrl) {
          updatedChapters[chapterIndex].lectures[lectureIndex].pdfs.push(
            newPdfUrl
          );
          await updateDoc(courseRef, { chapters: updatedChapters });
          setCourse((prevCourse) => ({
            ...prevCourse,
            chapters: updatedChapters,
          }));
          console.log("update");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          setInputKey(Date.now());
        } else {
          console.error("Failed to upload the file.");
        }
      } else {
        setError("No such document!");
      }
    } catch (err) {
      console.error("Error updating lecture PDFs:", err);
    }
  };

  const handleAddLecture = async (index, field, value) => {
    const updatedLectures = [...newChapter.lectures];

    if (field === "file") {
      const videoUrl = await handleFileUpload(value);
      updatedLectures[index] = { ...updatedLectures[index], videoUrl };
    } else if (field === "pdfs") {
      const pdfUrls = await Promise.all(
        Array.from(value).map((file) => handleFileUpload(file))
      );
      updatedLectures[index] = { ...updatedLectures[index], pdfs: pdfUrls };
    } else {
      updatedLectures[index] = { ...updatedLectures[index], [field]: value };
    }

    setNewChapter({ ...newChapter, lectures: updatedLectures });
  };

  const handleCheckboxChange = async (e, type) => {
    const value = e.target.value;
    const docRef = doc(db, "courses", uniqueID);

    try {
      if (type === "schools") {
        const updatedSchools = course.targetedSchools.includes(value)
          ? course.targetedSchools.filter((id) => id !== value)
          : [...course.targetedSchools, value];
        setCourse((prevCourse) => ({
          ...prevCourse,
          targetedSchools: updatedSchools,
        }));
        await updateDoc(docRef, { targetedSchools: updatedSchools });
      } else if (type === "boards") {
        const updatedBoards = course.targetedBoards.includes(value)
          ? course.targetedBoards.filter((id) => id !== value)
          : [...course.targetedBoards, value];

        setCourse((prevCourse) => ({
          ...prevCourse,
          targetedBoards: updatedBoards,
        }));

        await updateDoc(docRef, { targetedBoards: updatedBoards });
      }
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Failed to update course. Please try again.");
    }
  };

  const handleDeleteCourse = async () => {
    try {
      const docRef = doc(db, "courses", uniqueID);
      await deleteDoc(docRef);
      alert("Course deleted successfully");
      router.push("/admin/dashboard/courses");
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Failed to delete course");
    }
  };

  const handleChapterClick = (index) => {
    setSelectedChapterIndex(index);
    setShowLectureDialog(true);
    addLectureField();
  };

  const handleAddLectureToChapter = async () => {
    if (selectedChapterIndex === null) return;
    try {
      const updatedChapters = [...course.chapters];
      updatedChapters[selectedChapterIndex].lectures = [
        ...(updatedChapters[selectedChapterIndex].lectures || []),
        ...newChapter.lectures,
      ];
      const docRef = doc(db, "courses", uniqueID);
      await updateDoc(docRef, { chapters: updatedChapters });
      setCourse((prev) => ({ ...prev, chapters: updatedChapters }));
      setShowLectureDialog(false);
      setNewChapter({
        chapterName: "",
        lectures: [],
      });
      alert("Lectures added successfully");
    } catch (err) {
      console.error("Error adding lectures:", err);
      alert("Failed to add lectures");
    }
  };

  if (loading)
    return <div className="text-center py-6 text-gray-600">Loading...</div>;
  if (error)
    return <div className="text-center py-6 text-red-600">{error}</div>;
  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        {" "}
        <h1 className="text-2xl font-extrabold mb-6 text-gray-900">
          Edit Course
        </h1>
        <button
          onClick={handleCourseUpdate}
          className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-800 transition-colors"
        >
          Save{" "}
        </button>
      </div>
      <div className="md:flex justify-between md:gap-10 ">
        <div className="mb-4 md:w-[50%]">
          <label className="block text-15px font-semibold text-neutral02 mb-2">
            Course Name:
          </label>
          <input
            type="text"
            value={course.courseName || ""}
            onChange={(e) =>
              setCourse({ ...course, courseName: e.target.value })
            }
            className="border border-gray-300 p-4 md:h-16 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4 md:w-[50%]">
          <label className="block text-15px font-semibold text-neutral02 mb-2">
            Description:
          </label>
          <textarea
            value={course.description || ""}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
            className="border border-gray-300 p-3 rounded-lg w-full h-28 md:h-16 custom-scrollbar overflow-y-scroll resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="md:flex justify-between md:gap-10 mb-5">
        <div className="md:w-[50%]">
          <h2 className="text-15px font-semibold text-neutral02 mb-2">
            Targeted Schools :{" "}
          </h2>
          <div className="flex flex-col max-h-28 overflow-y-scroll custom-scrollbar  rounded-md border border-gray-300 p-2">
            {schoolsList.map((school) => (
              <label key={school.id} className="mr-4">
                <input
                  type="checkbox"
                  value={school.id}
                  checked={course.targetedSchools.includes(school.id)}
                  onChange={(e) => handleCheckboxChange(e, "schools")}
                  className="mr-2"
                />
                <span className="text-15px font-semibold text-neutral02">
                  {school.schoolName}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="md:w-[50%]">
          <h2 className="text-15px font-semibold text-neutral02 mt-4 md:mt-0 mb-2">
            Targeted Boards :{" "}
          </h2>
          <div className="flex flex-col max-h-28 overflow-y-scroll rounded-md custom-scrollbar border border-gray-300 p-2">
            {boardsList.map((board) => (
              <label key={board.id} className="mr-4">
                <input
                  type="checkbox"
                  value={board.id}
                  checked={course.targetedBoards.includes(board.id)}
                  onChange={(e) => handleCheckboxChange(e, "boards")}
                  className="mr-2"
                />
                <span className="text-15px font-semibold text-neutral02">
                  {board.boardName}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
        Add Chapter
      </h2>
      <div className="mb-6">
        <label className="block text-15px font-semibold text-neutral02 mb-2">
          Chapter Name:
        </label>
        <input
          type="text"
          value={newChapter.chapterName}
          onChange={(e) =>
            setNewChapter({ ...newChapter, chapterName: e.target.value })
          }
          className="border border-gray-300 p-4 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-x-4">
        <button
          onClick={handleAddChapter}
          className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Add Chapter
        </button>

        <button
          onClick={handleDeleteCourse}
          className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors mt-4"
        >
          Delete Course
        </button>
      </div>

      {showLectureDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-4">
              Add Lectures to Chapter
            </h3>
            {newChapter.lectures.map((lecture, idx) => (
              <div key={idx} className="mb-6">
                <label className="block text-gray-700 text-md font-medium mb-2">
                  Lecture Name: {idx}
                </label>
                <input
                  type="text"
                  value={lecture.name}
                  onChange={(e) =>
                    handleAddLecture(idx, "name", e.target.value)
                  }
                  className="border border-gray-300 p-4 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="block text-gray-700 text-md font-medium mb-2 mt-4">
                  Description:
                </label>
                <textarea
                  value={newLectureDescription}
                  onChange={(e) => setNewLectureDescription(e.target.value)}
                  className="border border-gray-300 p-4 rounded-lg w-full h-32 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block text-gray-700 text-md font-medium mb-2 mt-4">
                  Upload Video:
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    handleAddLecture(idx, "file", e.target.files[0])
                  }
                  className="border border-gray-300 p-4 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {lecture.videoUrl && (
                  <div className="mt-2">
                    <label className="block text-gray-700 text-md font-medium mb-2">
                      Video URL:
                    </label>
                    <a
                      href={lecture.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Watch Video
                    </a>
                  </div>
                )}
                <label className="block text-gray-700 text-lg font-medium mb-2 mt-4">
                  PDFs:
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) => handleAddLecture(e.target.files)}
                  className="border border-gray-300 p-4 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {lecture.pdfs && lecture.pdfs.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-lg font-medium">Uploaded PDFs:</h4>
                    <ul>
                      {lecture.pdfs.map((pdfUrl, pdfIdx) => (
                        <li key={pdfIdx} className="text-blue-500">
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            PDF {pdfIdx + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={handleAddLectureToChapter}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Lectures to Chapter
              </button>
              <button
                onClick={() => {
                  setShowLectureDialog(false);
                  setNewLectureDescription(""); // Reset lecture description
                  setNewChapter({ lectures: [] }); // Reset lectures array
                }}
                className="bg-red-600 text-white p-2 rounded-lg ml-2 hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Chapters</h2>
        <ul>
          {course.chapters?.map((chapter, index) => (
            <li
              key={index}
              className="mb-4 p-4 border border-gray-300 rounded-lg"
            >
              <div className="flex justify-between items-center">
                {" "}
                <h3 className="text-xl font-semibold">{chapter.chapterName}</h3>
                <button
                  onClick={() => handleChapterClick(index)}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors mt-2"
                >
                  <FiPenTool />{" "}
                </button>
              </div>
              {chapter.lectures && (
                <ul className="mt-2">
                  {chapter.lectures.map((lecture, lIndex) => (
                    <li key={lIndex} className="mb-2">
                      <div className="flex justify-between items-center bg-blue-300 p-2 rounded-lg">
                        {" "}
                        <div className="font-medium">
                          {lIndex + 1}. {lecture.name}
                        </div>
                        <div className="flex justify-center items-center gap-5">
                          <button
                            onClick={() => openModal(index, lIndex)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                          >
                            Add Video Link
                          </button>
                          <a
                            href={lecture.videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500 text-2xl mt-1 hover:{} bg-blue-900 p-1 rounded-md hover:underline"
                          >
                            <FiVideo />
                          </a>
                          <label className="block mb-4">
                            <span className="text-gray-700">Add PDFs</span>
                            <input
                              type="file"
                              ref={fileInputRef}
                              key={inputKey} // Key ensures a new input element is created after reset
                              onChange={(e) =>
                                handleAddpdfs(
                                  index,
                                  lIndex,
                                  "file",
                                  e.target.files[0]
                                )
                              }
                              className="mt-1 block w-full p-2 border rounded"
                            />
                          </label>
                          <button
                            // onClick={() => handleDeleteLecture(index, lIndex)}
                            onClick={() =>
                              setDeletingLecture({
                                chapterIndex: index,
                                lectureIndex: lIndex,
                              })
                            }
                            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors mt-2"
                          >
                            <MdDelete className="w-6 h-6" />
                          </button>
                          <button
                            onClick={() => handleLectureEdit(index, lIndex)}
                            className="edit-button"
                          >
                            <MdEdit />
                          </button>
                        </div>
                        {showModal && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                              <h2 className="text-lg font-semibold mb-4">
                                Add Video Link
                              </h2>

                              {/* Video Link Input */}
                              <label className="block text-gray-700 text-md font-medium mb-2 mt-4">
                                Video Link:
                              </label>
                              <input
                                type="text"
                                value={videoLink}
                                onChange={(e) => setVideoLink(e.target.value)}
                                className="border border-gray-300 p-4 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />

                              {/* Date Input */}
                              <label className="block text-gray-700 text-md font-medium mb-2 mt-4">
                                Date:
                              </label>
                              <input
                                type="date"
                                value={meetingDate}
                                onChange={(e) => setMeetingDate(e.target.value)}
                                className="border border-gray-300 p-4 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />

                              {/* Start Time Input */}
                              <label className="block text-gray-700 text-md font-medium mb-2 mt-4">
                                Start Time:
                              </label>
                              <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="border border-gray-300 p-4 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />

                              {/* End Time Input */}
                              <label className="block text-gray-700 text-md font-medium mb-2 mt-4">
                                End Time:
                              </label>
                              <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="border border-gray-300 p-4 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />

                              {/* Save Button */}
                              <button
                                onClick={() =>
                                  handleSaveVideoLink(
                                    index,
                                    lIndex,
                                    videoLink,
                                    meetingDate,
                                    startTime,
                                    endTime
                                  )
                                }
                                className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                              >
                                Save
                              </button>

                              {/* Cancel Button */}
                              <button
                                onClick={closeModal}
                                className="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-2"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="poppins text-xl p-1">PDF Files</div>
                      {lecture.pdfs &&
                        lecture.pdfs.map((pdf, pIndex) => (
                          <div key={pIndex} className=" pl-8  flex gap-5 ">
                            <a
                              href={pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              PDF FILE NO. {pIndex + 1}{" "}
                            </a>
                            <button
                              onClick={() =>
                                handleDeletePdf(index, lIndex, pIndex)
                              }
                              className="text-red-500 hover:underline"
                            >
                              <MdAutoDelete />
                            </button>
                          </div>
                        ))}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {deletingLecture && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-background06 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete this package?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeletingLecture(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleDeleteLecture(
                    deletingLecture.chapterIndex,
                    deletingLecture.lectureIndex
                  )
                }
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingLecture && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4 sm:mx-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 text-lg">Lecture Name</span>
              <button onClick={() => setIsEditingLecture(false)}>
                <FaWindowClose className="text-red-400 text-2xl" />
              </button>
            </div>
            <input
              type="text"
              value={lectureData.name}
              onChange={(e) =>
                setLectureData({
                  ...lectureData,
                  name: e.target.value,
                })
              }
              placeholder="Lecture Name"
              className="mb-4 p-2 border rounded w-full"
            />
            <span className="text-gray-700 text-lg">Lecture Video Link</span>
            <input
              type="text"
              value={lectureData.videoLink}
              onChange={(e) =>
                setLectureData({
                  ...lectureData,
                  videoLink: e.target.value,
                })
              }
              placeholder="Video Link"
              className="mb-4 p-2 border rounded w-full"
            />

            {lectureData.pdfs && lectureData.pdfs.length > 0 && (
              <div className="mb-4">
                <span className="text-gray-700 block mb-2">Existing PDFs</span>
                <ul className="list-disc pl-5">
                  {lectureData.pdfs.map((pdf, index) => (
                    <li key={index} className="mb-1">
                      <a
                        href={pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        {pdf.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={handleSaveLecture}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Save Lecture
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
