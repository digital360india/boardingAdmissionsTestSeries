import React from "react";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[60vw] relative max-h-[90vh] overflow-y-scroll">
        <h2 className="text-xl font-bold mb-4">Add New Test</h2>
        <form onSubmit={handleAddTest} className="space-y-4">
          {/* Test Title */}
          <div>
            <label className="block text-gray-700">Test Title:</label>
            <input
              type="text"
              name="testTitle"
              value={newTest.testTitle}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Assign Teachers */}
          {/* <div>
            <label className="block text-gray-700">Assign Teachers to Test:</label>
            <div className="flex flex-col mt-2">
              {teachers.map((teacher) => (
                <label key={teacher.id} className="flex items-center">
                  <input
                    type="checkbox"
                    name="teacherAssigned"
                    value={teacher.id}
                    checked={newTest.teachersAssigned.includes(teacher.id)}
                    onChange={() => handleTeacherSelect(teacher.id)}
                    className="mr-2"
                  />
                  {teacher.name}
                </label>
              ))}
            </div>
          </div> */}

          {/* Duration */}
          <div>
            <label className="block text-gray-700">Duration:</label>
            <input
              type="text"
              name="duration"
              value={newTest.duration}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Test Description */}
          <div>
            <label className="block text-gray-700">Test Description:</label>
            <textarea
              name="testDescription"
              value={newTest.testDescription}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Select Subjects */}
          <div>
            <label className="block text-gray-700">Select Subjects:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {[
                "Math",
                "Chemistry",
                "Science",
                "English",
                "History",
                "Geography",
                "Physics",
              ].map((subject) => (
                <label key={subject} className="flex items-center">
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

          {/* Test Upload Date */}
          <div>
            <label className="block text-gray-700">Test Upload Date:</label>
            <input
              type="date"
              name="testUploadDate"
              value={newTest.testUploadDate}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Total Marks */}
          <div>
            <label className="block text-gray-700">Total Marks:</label>
            <input
              type="text"
              name="Totalmarks"
              value={newTest.Totalmarks}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-5">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Test
            </button>
            <button
              type="button"
              onClick={handleCloseDialog}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
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
