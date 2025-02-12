"use client";

import { uploadImage } from "@/utils/functions/imageControls";
import React, { useState } from "react";
import "@/components/admin/ScrollbarCss.css";
import { CiSearch } from "react-icons/ci";

const AddTestDialog = ({
  isOpen,
  newTest,
  teachers,
  filteredSubjects,
  setSubjectSearch,
  subjectSearch,
  handleInputChange,
  handleTeacherSelect,
  handleSubjectChange,
  handleAddTest,
  handleCloseDialog,
}) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      setPdfPreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute -top-4 left-0 flex items-center w-full bg-background00 z-50">
      <div className="bg-white rounded-lg shadow-lg md:w-[70vw] w-[90vw] mx-auto">
        <div className="flex justify-between bg-background05 w-full rounded-t-lg p-4">
          <div className="text-[16px] font-medium text-white">Create Test</div>
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-4 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-12">
            <div className="w-full sm:w-1/2">
              <label className="block text-[14px] font-semibold text-neutral02">
                Test Title:
              </label>
              <input
                type="text"
                name="testTitle"
                placeholder="Enter Test Title..."
                value={newTest.testTitle}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-[14px] font-semibold text-neutral02">
                Test Upload Date:
              </label>
              <input
                type="date"
                name="testUploadDate"
                placeholder="Enter Test Upload Date..."
                value={newTest.testUploadDate}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-[14px] text-neutral02">
              Test Description:
            </label>
            <input
              name="testDescription"
              placeholder="Enter Test Description..."
              value={newTest.testDescription}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border-2 border-gray-300 rounded"
              rows="3"
            ></input>
          </div>
          <div className="flex justify-end text-[#AAAAAA] text-[12px]">
            <p>Max. 100 characters</p>
          </div>
          <div>
            <label className="block text-[14px] text-neutral02 font-medium">
              Test Questions:
            </label>
            <div className="flex flex-col items-center">
              {/* Upload Box */}
              <div className="relative flex flex-col items-center justify-center w-full bg-background05 bg-opacity-5 p-4 border-2 border-background05 border-dashed rounded-lg text-center">
                <div className="flex gap-2">
                  <img
                    src="/Upload icon.svg"
                    alt="Upload Icon"
                    className="w-6 mb-2"
                  />
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
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Supported formats: PDF
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

              {pdfPreview && (
                <div className="mt-4 w-full max-w-[500px] border custom-scrollbar border-gray-300 shadow-md rounded-lg">
                  <iframe src={pdfPreview} className="w-full h-[500px]" />
                  <p className="text-center text-sm text-gray-600 mt-2">
                    PDF Preview
                  </p>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-[14px] text-neutral02">
              Select Subjects:
            </label>
            <div className="relative flex items-center w-full border border-[#9999A4] rounded-xl p-2 text-sm mb-2">
              <input
                type="search"
                placeholder="Search subjects..."
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                className="flex-grow focus:outline-none"
              />
              <CiSearch />
            </div>
            <div className="border-gray-300 rounded-md p-4 h-40 overflow-y-auto custom-scrollbar">
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
          <div className="flex flex-col sm:flex-row sm:gap-8">
            <div className="w-full sm:w-1/2">
              <label className="block text-[14px] text-neutral02">
                Duration (in min):
              </label>
              <input
                type="text"
                name="duration"
                placeholder="Enter Test Duration..."
                value={newTest.duration}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border-2 border-gray-300 rounded"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-[14px] text-neutral02">
                Total Marks:
              </label>
              <input
                type="number"
                placeholder="Total Marks"
                name="totalMarks"
                value={newTest.totalMarks}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border-2 border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-background05 md:text-md text-sm text-white w-full sm:w-auto px-8 py-2 rounded-md 
          ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? "Submitting..." : "Create Test"}
            </button>
            <button
              type="button"
              onClick={handleCloseDialog}
              className="text-[#9999A4] md:text-md text-sm border border-[#9999A4] w-full sm:w-auto px-8 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestDialog;
