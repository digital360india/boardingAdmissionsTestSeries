"use client";

import { uploadImage } from "@/utils/functions/imageControls";
import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";

const AddTestDialog = ({
  isOpen,
  newTest,
  teachers,
  handleInputChange,
  handleTeacherSelect,
  handleSubjectChange,
  handleAddTest,
  handleCloseDialog,
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
        newTest.testpdf = pdfUrl;
      }
      handleAddTest();
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[35vw] relative max-h-[90vh] overflow-y-scroll">
        <div className="flex justify-between">
          <div className="text-xl font-bold mb-4">Create Test</div>
          <div className="mt-1 cursor-pointer" onClick={handleCloseDialog}>
            <RxCross1 className="text-2xl text-[#EF4848]" />
          </div>
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Test Title:</label>
            <input
              type="text"
              name="testTitle"
              value={newTest.testTitle}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border-2 border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Test Description:</label>
            <textarea
              name="testDescription"
              value={newTest.testDescription}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border-2 border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Test Upload Date:</label>
            <input
              type="date"
              name="testUploadDate"
              value={newTest.testUploadDate}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border-2 border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Upload Test PDF:</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="mt-1 block w-full"
              required
            />
            {uploading && <p>Uploading PDF...</p>}
          </div>

          <div>
            <label className="block text-gray-700">Select Subjects:</label>
            <div className="mt-2 border border-gray-300 rounded-md p-4 h-40 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Math",
                  "Chemistry",
                  "Science",
                  "English",
                  "History",
                  "General Awareness",
                  "Hindi",
                  "Geography",
                  "Physics",
                ].map((subject) => (
                  <label
                    key={subject}
                    className="flex items-center border border-gray-200 p-2 rounded-md bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      name="subjects"
                      value={subject}
                      checked={newTest.subjects.includes(subject)}
                      onChange={handleSubjectChange}
                      className="mr-2"
                    />
                    {subject}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <label className="block text-gray-700">Duration:</label>
              <input
                type="text"
                name="duration"
                value={newTest.duration}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border-2 border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Total Marks:</label>
              <input
                type="number"
                name="totalMarks"
                value={newTest.totalMarks}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border-2 border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="flex justify-end gap-5">
            <button
              type="button"
              onClick={handleCloseDialog}
              className="bg-[#2C2C2C] text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#5D5FEF] text-white px-4 py-2 rounded-md"
            >
              Create Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestDialog;
