"use client";
import React, { useContext, useState } from "react";
import DeletePopup from "./DeletePopup";
import { TestContext } from "@/providers/testProvider";
import { toast } from "react-toastify";
import showError from "@/utils/functions/showError";

const PackageTable = ({
  testPackages,
  openModal,
  openModal2,
  setEditingPackage,
  setEditFormData,
  isModalOpen,
  setIsModalOpen,
}) => {
  const { handleDelete } = useContext(TestContext);
  const [packageIdToDelete, setPackageIdToDelete] = useState(null);

  const handleEditClick = (pkg) => {
    setEditingPackage(pkg.id);
    setEditFormData({
      packageName: pkg.packageName,
      packageDescription: pkg.packageDescription,
      price: pkg.price,
      tests: pkg.tests,
      discountedPrice: pkg.discountedPrice,
      startingDate: new Date(pkg.startingDate).toLocaleDateString(),
    });
  };

  const openDeleteModal = (id) => {
    setPackageIdToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (packageIdToDelete) {
      try {
        await handleDelete(packageIdToDelete);
        setIsModalOpen(false);
        setPackageIdToDelete(null);
        toast.success("Test package deleted successfully!");
      } catch (err) {
        console.error("Error deleting test package:", err);
        showError(err.message);
        toast.error("Failed to delete test package.");
      }
    }
  };

  const renderActions = (pkg) => (
    <div className="flex space-x-2">
       <button
        onClick={() => openDeleteModal(pkg.id)}
        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
      >
        Delete
      </button>
      <button
        onClick={() => handleEditClick(pkg)}
        className="bg-[#1DA913] text-white px-3 py-1 rounded-md"
      >
        Edit
      </button>
     
      <button
        onClick={() => openModal2(pkg)}
        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
      >
        View Details
      </button>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white ">
        <thead>
          <tr className=" text-black font-medium text-18px">
            <th className="py-3 px-4  text-left font-normal ">
              Sr.no
            </th>
            <th className="py-3 px-4  text-left font-normal ">
              Package Name
            </th>
            <th className="py-3 px-4  text-left font-normal ">
              Price
            </th>
            <th className="py-3 px-4  text-left font-normal ">
              Student Enrolled
            </th>
            <th className="py-3 px-4  text-left font-normal ">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {testPackages.map((pkg, index) => (
            <tr key={pkg.id} className="hover:bg-gray-300">
              <td className="py-2 px-4  text-left font-normal ">
                {index + 1}
              </td>
              <td className="py-2 px-4  text-left font-normal ">
                {pkg.packageName}
              </td>
              <td className="py-2 px-4  text-left font-normal ">
                {pkg.discountedPrice ? (
                  <>
                    <span className="text-black">₹{pkg.discountedPrice} </span>
                    <span className="line-through text-[#4E4E4EB2]">
                      {" "}
                      ₹{pkg.price}
                    </span>
                  </>
                ) : (
                  <span className="text-black">₹{pkg.price}</span>
                )}
              </td>
              <td className="py-2 px-4  text-center font-normal ">
                {Array.isArray(pkg.studentEnrolled) &&
                pkg.studentEnrolled.length > 0
                  ? pkg.studentEnrolled.length
                  : 0}
              </td>

              <td className="py-2 px-4  text-left font-normal ">
                {renderActions(pkg)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeletePopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default PackageTable;
