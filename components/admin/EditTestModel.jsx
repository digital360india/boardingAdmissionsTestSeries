'use client';
import { uploadImage } from "@/utils/functions/imageControls";
import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

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

  if (!isOpen) return null;
  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (pdfFile) {
        setUploading(true);
        const pdfUrl = await uploadImage(pdfFile, "pdfTest");
        setUploading(false);
        editTest.testpdf = pdfUrl; 
      }

      handleEditTest();
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setUploading(false);
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[60vw] relative max-h-[90vh] overflow-y-scroll">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Edit Test Details
        </h3>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Test Title
            </label>
            <input
              type="text"
              name="testTitle"
              value={editTest.testTitle}
              onChange={handleEditInputChange}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">
              Upload Test PDF:
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="mt-2 block w-full"
            />
            {uploading && <p>Uploading PDF...</p>}
            {!pdfFile && editTest.testpdf && (
              <p className="text-gray-600 mt-2">
                Current PDF:{" "}
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
          </div>
          
          <div className="flex space-x-4">
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={editTest.duration}
                onChange={handleEditInputChange}
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Upload Date
              </label>
              <input
                type="date"
                name="testUploadDate"
                value={editTest.testUploadDate}
                onChange={handleEditInputChange}
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">
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
                className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out"
              />
            </div>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              name="testDescription"
              value={editTest.testDescription}
              onChange={handleEditInputChange}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out"
            />
          </div>
          <div>
            <p>Selected subjects:</p>
            <div className="grid grid-cols-2 gap-4 mt-2 max-h-40 overflow-y-scroll">
              {editTest.subjects?.length ? (
                editTest.subjects?.map((subject) => (
                  <div
                    key={subject}
                    className="flex justify-between items-center"
                  >
                    <span>{subject}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubject(subject)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <FaRegTrashAlt />
                    </button>
                  </div>
                ))
              ) : (
                <span>None</span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Select Subjects:
            </label>
            <div className="flex flex-wrap gap-4 mt-2">
              {[
                "Math",
                "Chemistry",
                "Science",
                "English",
                "History",
                "Hindi",
                "General Awareness",
                "Geography",
                "Physics",
              ].map((subject) => (
                <label key={subject} className="flex items-center">
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
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition duration-200 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition duration-200 ease-in-out"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTestModal;
