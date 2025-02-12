"use client";
import { uploadImage } from "@/utils/functions/imageControls";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";
import "@/components/admin/ScrollbarCss.css";
const EditTestModal = ({
  isOpen,
  handleClose,
  editTest,
  teachers,
  handleEditInputChange,
  handleTeacherSelect,
  handleEditTest,
  handleDeleteSubject,
  handleEditSubjectChange,
}) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  const [loading, setloading] = useState(false);

  const handlePdfChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type === "application/pdf") {
      setUploading(true);
      setPdfFile(file);
      setSelectedFile(file);
      setShowPdf(true);
      setTimeout(() => {
        setUploading(false);
        
      }, 1500);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (pdfFile) {
        setloading(true);
        const pdfUrl = await uploadImage(pdfFile, "pdfTest");
        console.log(pdfUrl);
        setloading(false);
        editTest.testpdf = pdfUrl;
      }

      handleEditTest();
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setloading(false);
    }
  };

  const subjects = [
    "Math",
    "Chemistry",
    "Science",
    "English",
    "History",
    "Hindi",
    "General Awareness",
    "Geography",
    "Physics",
  ];

  const filteredSubjects = subjects.filter((subject) =>
    subject.toLowerCase().includes(filterText.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="absolute -top-8 left-0 w-full flex justify-center md:h-screen h-[105%] bg-background00 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full sm:w-[80vw] md:w-[60vw] relative max-h-[80vh] custom-scrollbar overflow-y-scroll">
        <div className="bg-background05 p-4">
          <h3 className="text-xl sm:text-2xl text-white font-semibold text-center">
            Edit Test Details
          </h3>
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-6 p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm sm:text-[14px] font-semibold text-neutral02">
                Test Title:
              </label>
              <input
                type="text"
                name="testTitle"
                value={editTest.testTitle}
                onChange={handleEditInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-sm sm:text-[14px] font-semibold text-neutral02">
                Test Upload Date:
              </label>
              <input
                type="date"
                name="testUploadDate"
                value={editTest.testUploadDate}
                onChange={handleEditInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm sm:text-[14px] text-neutral02">
              Test Description:
            </label>
            <input
              type="text"
              name="testDescription"
              value={editTest.testDescription}
              onChange={handleEditInputChange}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
            />
          </div>
          <div className="flex justify-end text-gray-500 text-xs sm:text-sm">
            <p>Max. 100 characters</p>
          </div>
          {!pdfFile && editTest.testpdf && (
            <p className="text-gray-600 mt-2">
              Current PDF:
              <a
                href={editTest.testpdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View PDF
              </a>
            </p>
          )}
          <div className="relative flex flex-col items-center justify-center w-full bg-background05 bg-opacity-5 p-4 border-2 border-background05 border-dashed rounded-lg text-center">
            {/* File Upload UI */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2 items-center border p-3 rounded-md">
                <img src="/Upload icon.svg" alt="Upload Icon" className="w-6" />
                <p className="text-sm">
                  <span className="font-medium cursor-pointer">
                    Drag & drop files
                  </span>{" "}
                  or{" "}
                  <label
                    htmlFor="file-upload"
                    className="text-background05 font-medium cursor-pointer underline"
                  >
                    Browse
                  </label>
                </p>
              </div>

              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handlePdfChange}
              />

              {/* Uploading State */}
              {uploading && (
                <p className="text-sm text-gray-500 mt-2">Uploading PDF...</p>
              )}

              {/* Display Uploaded File Name & PDF Preview */}
              {selectedFile && !uploading && (
                <div className="mt-2 border p-2 rounded-md shadow-md bg-gray-50 w-full">
                  <p className="text-sm text-gray-700">
                    Selected File: {selectedFile.name}
                  </p>
                  <button
                    onClick={() => setShowPdf(!showPdf)}
                    className="text-blue-500 font-medium underline text-sm mt-1"
                  >
                    {showPdf ? "Hide PDF" : "View PDF"}
                  </button>

                  {showPdf && (
                    <div className="mt-2">
                      <embed
                        src={URL.createObjectURL(selectedFile)}
                        type="application/pdf"
                        className="w-full h-64 rounded-md border"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-1">Supported format: PDF</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm sm:text-lg font-medium text-gray-700">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={editTest.duration}
                onChange={handleEditInputChange}
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-sm sm:text-lg font-medium text-gray-700">
                Total Marks
              </label>
              <input
                type="number"
                name="totalMarks"
                value={editTest.totalMarks}
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue = value ? parseInt(value, 10) : "";
                  handleEditInputChange({
                    target: {
                      name: e.target.name,
                      value: numericValue,
                    },
                  });
                }}
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm sm:text-[14px] text-neutral02">
              Select Subjects:
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2 text-sm mb-2">
              <input
                type="search"
                placeholder="Search subjects..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="flex-grow focus:outline-none"
              />
              <CiSearch />
            </div>
            <div className="border-gray-300 rounded-lg p-4 h-40 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredSubjects.map((subject) => (
                  <label
                    key={subject}
                    className="flex items-center p-2 rounded-md"
                  >
                    <input
                      type="checkbox"
                      name="subjects"
                      value={subject}
                      checked={editTest.subjects?.includes(subject) || false}
                      onChange={handleEditSubjectChange}
                      className="mr-2"
                    />
                    {subject}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm sm:text-lg font-medium text-gray-700">
              Selected Subjects:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-4">
              {editTest.subjects?.length ? (
                editTest.subjects.map((subject) => (
                  <div
                    key={subject}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                  >
                    <span className="text-gray-800">{subject}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubject(subject)}
                      className="ml-2 text-red-600 hover:text-red-800 transition"
                    >
                      <FaRegTrashAlt />
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-gray-500">No subjects selected</span>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              disabled={loading}
              type="submit"
              className={`bg-background05 text-sm sm:text-md text-white w-full sm:w-auto px-8 py-2 rounded-md transition-opacity 
    ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-80"}`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="text-gray-500 text-sm sm:text-md border border-gray-300 w-full sm:w-auto px-8 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTestModal;
