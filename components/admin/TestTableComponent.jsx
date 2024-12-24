"use client";
import React, { useContext, useRef, useState, useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { FaArrowLeft, FaArrowRight, FaEdit } from "react-icons/fa";
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
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil((searchActive ? results.length : tests.length) / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = (searchActive ? results : tests).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
 
    <div className="rounded-md shadow-md bg-white">
    <table className="min-w-full border-collapse rounded-md">
      <thead className="text-[#000000CC] text-18px">
        <tr className="text-18px">
          <th className="p-4 text-left">Test Title</th>
          <th className="p-4 text-left">Duration (in min)</th>
          <th className="p-4 text-left">Test Start Date</th>
          <th className="p-4 text-left">Total Marks</th>
          <th className="p-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData.map((test, index) => (
          <tr
            key={test.id}
            className={`duration-100 ${
              index % 2 !== 0 ? `bg-white` : `bg-white`
            } hover:bg-slate-300 text-base sm:text-sm md:text-base`}
          >
            <td className="p-2 w-1/4 sm:w-1/3 md:w-1/4 lg:w-1/4">
              {test.testTitle || "Untitled Test"}
            </td>
            <td className="p-2 w-1/6 sm:w-1/4 md:w-1/6 lg:w-1/6 ">
              {test.duration || "N/A"}
            </td>
            <td className="p-2 w-1/6 sm:w-1/4 md:w-1/6 lg:w-1/6 text-sm ">
              {test.testUploadDate || "N/A"}
            </td>
            <td className="p-2 w-1/6 sm:w-1/4 md:w-1/6 lg:w-1/6 ">
              {test.totalMarks || "N/A"}
            </td>
            <td className="p-2 w-1/6 sm:w-1/4 md:w-1/6 lg:w-1/6 ">
              <div className="relative inline-block">
                <button
                  onClick={() => toggleDropdown(test.id)}
                  className={`${
                    openDropdownId === test.id
                      ? "rounded-full border p-1 w-10 h-10"
                      : "text-black w-10 h-10 flex items-center justify-center"
                  }`}
                >
                  <PiDotsThreeBold className="text-[30px] sm:text-[25px] border-gray-200 md:text-[30px]" />
                </button>

                {openDropdownId === test.id && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-1 w-48 bg-white border-gray-300 rounded-md shadow-lg z-50"
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

  <div className="flex justify-center gap-4 items-center mt-4">
  <button
    className="px-4 py-2 flex gap-3 items-center"
    disabled={currentPage === 1}
    onClick={() => handlePageChange(currentPage - 1)}
  >
    <FaArrowLeft />
    Previous
  </button>
  <div className="flex gap-2">
    {Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      if (
        page <= 3 || 
        page > totalPages - 2 || 
        (page >= currentPage - 1 && page <= currentPage + 1) 
      ) {
        return (
          <button
            key={page}
            className={`px-4 py-2 rounded ${
              currentPage === page ? "bg-gray-800 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        );
      }

      if (
        (page === 4 && currentPage > 4) || 
        (page === totalPages - 2 && currentPage < totalPages - 3) 
      ) {
        return (
          <span key={page} className="px-4 py-2">
            ...
          </span>
        );
      }

      return null;
    })}
  </div>
  <button
    className="px-4 py-2 flex items-center gap-3"
    disabled={currentPage === totalPages}
    onClick={() => handlePageChange(currentPage + 1)}
  >
    Next <FaArrowRight />
  </button>
</div>

   
</>
  );
};

export default TestTable;
