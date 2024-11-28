import React from "react";
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
  if (!isOpen) return null;

  return (
    <div
      style={{ margin: "0px" }}
      className="fixed inset-0 z-40 flex items-center overflow-y-scroll h-screen justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
    >
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-xl transform transition-all duration-300 ease-in-out">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Edit Test Details
        </h3>
        <form onSubmit={handleEditTest} className="space-y-6">
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
              Assign Teacher:
            </label>
            <div className="flex flex-col mt-2">
              {teachers.map((teacher) => (
                <label key={teacher.id} className="flex items-center">
                  <input
                    type="checkbox"
                    name="teacherAssigned"
                    value={teacher.id}
                    checked={editTest.teachersAssigned.includes(teacher.id)}
                    onChange={() => handleTeacherSelect(teacher.id)}
                    className="mr-2"
                  />
                  {teacher.name}
                </label>
              ))}
            </div>
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
                name="testLiveDate"
                value={editTest.testLiveDate}
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
                onChange={handleEditInputChange}
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
              {editTest.subjects.length ? (
                editTest.subjects.map((subject) => (
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
              className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition duration-200 ease-in-out"
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
