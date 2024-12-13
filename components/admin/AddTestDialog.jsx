import React from "react";
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[35vw] relative max-h-[90vh] overflow-y-scroll">
      <div className="flex justify-between">
        <div className="text-xl font-bold mb-4">Create Test</div>
        <div className="mt-1 cursor-pointer" onClick={handleCloseDialog}><RxCross1 className="text-2xl text-[#EF4848]" /></div>
      </div>
        <form onSubmit={handleAddTest} className="space-y-4">
          {/* Test Title */}
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
            <label className="block text-gray-700">Select Subjects:</label>
            <div className="mt-2 border border-gray-300 rounded-md p-4 h-40 overflow-y-auto">
  <div className="grid grid-cols-2 gap-4">
    {[
      "Math",
      "Chemistry",
      "Science",
      "English",
      "History",
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
              type="text"
              name="Totalmarks"
              value={newTest.Totalmarks}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border-2 border-gray-300 rounded"
            />
          </div>
</div>
          {/* Test Description */}
        
          {/* Select Subjects */}
   

          {/* Test Upload Date */}
       

          {/* Total Marks */}
        

          {/* Buttons */}
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
