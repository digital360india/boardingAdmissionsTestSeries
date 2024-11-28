"use client";
import React, { useContext, useRef, useState, useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import DeletePopup from "./DeletePopup";
import { toast } from "react-toastify";
import { TestSeriesContext } from "@/providers/testSeriesProvider";
import { PiDotsThreeBold } from "react-icons/pi";
import showError from "@/utils/functions/showError";

const ActionButton = ({ onClick, title, Icon, color }) => (
  <button
    onClick={onClick}
    className={` mx-3 flex my-2 justify-between items-center after:z-50 ${color} `}
  >
    <Icon size={28} />
    <p>{title}</p>
  </button>
);

const TestTable = ({
  tests,
  results,
  searchActive,
  handleAddQuestions,
  handleOpenEditDialog,
}) => {
  const [deletePopup, setDeletePopup] = useState(false);
  const [packageIdToDelete, setPackageIdToDelete] = useState(null);
  const { handleDelete } = useContext(TestSeriesContext);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = (testId) => {
    setOpenDropdownId((prevId) => (prevId === testId ? null : testId));
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setOpenDropdownId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleConfirmDelete = async () => {
    if (packageIdToDelete) {
      try {
        await handleDelete(packageIdToDelete);
        setDeletePopup(false);
        setPackageIdToDelete(null);
        toast.success("Test package deleted successfully!");
      } catch (err) {
        console.error("Error deleting test package:", err);
        showError(err.message);
        toast.error("Failed to delete test package.");
      }
    }
  };

  const handleOpenDeletePopUp = async (id) => {
    setDeletePopup(true);
    setPackageIdToDelete(id);
  };

  return (
    <div className="rounded-md shadow-md">
      <table className="min-w-full border-collapse rounded-md">
        <thead className="bg-gray-300">
          <tr className="text-medium">
            <th className="border p-4 text-left">Test Title</th>
            <th className="border p-4 text-left">Duration (in min)</th>
            <th className="border p-4 text-left">Test Start Date</th>
            <th className="border p-4 text-left">Total Marks</th>
            <th className="border p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(searchActive ? results : tests).map((test, index) => (
            <tr
              key={test.id}
              className={`duration-100 border-b ${
                index % 2 !== 0 ? `bg-gray-100` : `bg-white`
              } hover:bg-slate-300 text-lg`}
            >
              <td className="border p-2 w-fit">
                {test.testTitle || "Untitled Test"}
              </td>
              <td className="border p-2 w-20">{test.duration || "N/A"}</td>
              <td className="border text-sm p-4 w-32">
                {test.testLiveDate || "N/A"}
              </td>
              <td className="border p-2 w-14">{test.totalMarks || "N/A"}</td>
              <td>
                <div className="relative inline-block">
                  <button
                    onClick={() => toggleDropdown(test.id)}
                    className="text-black px-4 py-2 rounded-full flex items-center justify-center"
                  >
                    <PiDotsThreeBold className="text-[35px]" />
                  </button>

                  {openDropdownId === test.id && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50"
                    >
                      <ActionButton
                        onClick={() => {
                          handleAddQuestions(test.id);
                          setOpenDropdownId(null);
                        }}
                        title="Add Questions"
                        Icon={IoIosAddCircle}
                        color="text-yellow-500"
                      />
                      <hr className="border-gray-200" />
                      <div className="ml-1">
                        <ActionButton
                          onClick={() => {
                            handleOpenEditDialog(test);
                            setOpenDropdownId(null);
                          }}
                          title="Edit"
                          Icon={FaEdit}
                          color="text-blue-500"
                        />
                      </div>
                      <hr className="border-gray-200" />
                      <ActionButton
                        onClick={() => {
                          handleOpenDeletePopUp(test.id);
                          setOpenDropdownId(null);
                        }}
                        title="Delete"
                        Icon={MdDelete}
                        color="text-red-500"
                      />
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DeletePopup
        isOpen={deletePopup}
        onClose={() => setDeletePopup(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default TestTable;
