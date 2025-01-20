"use client";

import { uploadImage } from "@/utils/functions/imageControls";
import React, { useState } from "react";
import "@/components/admin/ScrollbarCss.css"
import { CiSearch } from "react-icons/ci";

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
  const [subjectSearch, setSubjectSearch] = useState("");
  const filteredSubjects = [
    "Math",
    "Chemistry",
    "Science",
    "English",
    "History",
    "General Awareness",
    "Hindi",
    "Geography",
    "Physics",
  ].filter((subject) =>
    subject.toLowerCase().includes(subjectSearch.toLowerCase())
  );


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
    <div className="absolute -top-4 left-0 flex items-center w-full bg-background00 z-50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[70vw] mx-auto">
        <div className="flex justify-between">
          <div className="text-xl font-bold mb-4">Create Test</div>
          
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="flex gap-12">
            <div>
              <label className="block text-15px font-semibold text-neutral02">
                Test Title:
              </label>
              <input
                type="text"
                name="testTitle"
                value={newTest.testTitle}
                onChange={handleInputChange}
                className="mt-1 block  p-2 border border-gray-300 rounded w-[47vw]"
                required
              />
            </div>

            <div>
              <label className="block text-15px font-semibold text-neutral02">
                Test Upload Date:
              </label>
              <input
                type="date"
                name="testUploadDate"
                value={newTest.testUploadDate}
                onChange={handleInputChange}
                className="mt-1 block p-2 border border-gray-300 w-[17vw] rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700">Test Description:</label>
            <input
              name="testDescription"
              value={newTest.testDescription}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border-2 border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-end text-[#AAAAAA] text-14px">
            <p>Max. 100 characters</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Test Questions:
            </label>
            <div className="relative flex space-x-4 items-center justify-center w-full bg-background05 bg-opacity-5 p-2 border-2 border-background05 border-dashed rounded-lg text-center">
              <img src="/Upload icon.svg" alt="Upload Icon" className="w-6" />
              <p>
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
              <p className="text-xs text-gray-400 mt-1">
                Supported formats: JPEG, PNG
              </p>
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                className="absolute opacity-0 cursor-pointer top-0 left-0 w-full h-full"
                style={{ pointerEvents: "none" }}
              />
            </div>
            {uploading && (
              <p className="text-sm text-gray-500 mt-2">Uploading PDF...</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">Select Subjects:</label>
            <div className="relative flex mb-2 justify-center items-center w-full border border-[#9999A4] rounded-xl p-2 pl-10 text-sm">
            <input
              type="search"
              placeholder="Search subjects..."
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              className="focus:outline-none"
            />
             <CiSearch />
            </div>
            <div className="mt-2 border-gray-300 rounded-md p-4 h-40 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-3 gap-4">
                {filteredSubjects.map((subject) => (
                  <label
                    key={subject}
                    className="flex items-center p-2 rounded-md "
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

          <div className="sticky bottom-0 bg-white">
          <div className="flex justify-between">
            <div>
              <label className="block text-15px text-neutral02">Duration:</label>
              <input
                type="text"
                name="duration"
                placeholder="Enter Test Duration..."
                value={newTest.duration}
                onChange={handleInputChange}
                className="mt-1 block w-[20vw] p-2 border-2 border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-15px text-neutral02">Total Marks:</label>
              <input
                type="number"
                placeholder="Total Marks"
                name="totalMarks"
                value={newTest.totalMarks}
                onChange={handleInputChange}
                className="mt-1 block w-[20vw] p-2 border-2 border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="flex justify-between gap-5 mt-4">
            <button
              type="submit"
              className="bg-background05 text-white px-8 py-2 rounded-md"
            >
              Create Test
            </button>
            <button
              type="button"
              onClick={handleCloseDialog}
              className=" text-[#9999A4] border border-[#9999A4] px-8 py-2 rounded-md mr-2"
            >
              Cancel
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestDialog;
