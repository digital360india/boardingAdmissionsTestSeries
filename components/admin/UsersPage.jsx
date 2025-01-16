"use client";
import React, { useState, useContext } from "react";
import { ProfileContext } from "@/providers/profileProvider";
import showError from "@/utils/functions/showError";
import DeletePopup from "@/components/admin/DeletePopup";
import { FaEdit } from "react-icons/fa";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { MdBlock, MdDeleteSweep } from "react-icons/md";
import { PiDotsThreeBold } from "react-icons/pi";
import { toast } from "react-toastify";
import AddProfile from "./AddProfile";

const UserTable = ({
  users,
  handleUserClick,
  toggleDropdown,
  openDropdownId,
  handleEditForm,
  handleDeleteClick,
}) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr className="text-18px text-[#000000CC]">
          <th className="text-left p-2">S.No</th>
          <th className="text-left p-2">Name</th>
          <th className="text-left p-2">Email</th>
          <th className="text-left p-2">Role</th>
          <th className="text-left p-2">Verification</th>
          <th className="text-left p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={user.id} className="hover:bg-gray-100 cursor-pointer">
            <td className=" px-1">{index + 1}</td>
            <td className=" px-1" onClick={() => handleUserClick(user)}>
              {user.displayName || "No Name"}
            </td>
            <td className=" px-1">{user.email || "No Email"}</td>
            <td className=" px-1">{user.role || "No Role"}</td>
            <td className=" px-1">
              {user.isVerified ? (
                <span className="text-green-500">Verified</span>
              ) : (
                <span className="text-red-500">Not Verified</span>
              )}
            </td>
            <td className=" flex space-x-2">
              <div className="relative inline-block">
                <button
                  onClick={() => toggleDropdown(user.id)}
                  className={`${
                    openDropdownId === user.id
                      ? "rounded-full border p-1 w-[39px] h-[39px]"
                      : "text-black w-10 h-10 flex items-center justify-center"
                  }`}
                >
                  <PiDotsThreeBold className="text-[30px] sm:text-[25px] border-gray-200 md:text-[30px]" />
                </button>

                {openDropdownId === user.id && (
                  <div className="absolute left-0 w-36 bg-white border rounded shadow-lg z-50">
                    <button
                      onClick={() => {
                        handleEditForm(user.role, user.id);
                        toggleDropdown(null);
                      }}
                      className="w-full flex gap-2 items-center text-left text-blue-500 px-4 py-2 rounded-t hover:text-blue-600"
                    >
                      <FaEdit className="text-[30px]" />
                      Edit
                    </button>
                    <hr />
                    <button
                      onClick={() => toggleDropdown(null)}
                      className="w-full flex gap-2 items-center text-left text-yellow-500 px-4 py-2 hover:text-yellow-600"
                    >
                      <MdBlock className="text-[30px]" />
                      Block
                    </button>
                    <hr />
                    <button
                      onClick={() => {
                        handleDeleteClick(user.id);
                        toggleDropdown(null);
                      }}
                      className="w-full flex gap-2 items-center text-left text-red-500 px-4 py-2 rounded-b"
                    >
                      <MdDeleteSweep className="text-[30px]" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const UserDetailDialog = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-auto overflow-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[900px] overflow-y-scroll max-h-[80vh]">
        <div className="flex justify-end items-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 text-white p-2 rounded hover:bg-gray-600 mt-4"
          >
            <IoMdClose />
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4">User Details</h2>
        <img
          src={user.photoURL}
          alt="User Photo"
          className="w-24 h-24 rounded-full mb-4"
        />
        <UserTable user={user} />
      </div>
    </div>
  );
};

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [profilePage, setProfilePage] = useState(false);
  const [editProfilePage, setEditProfilePage] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userID, setUserID] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUsers, setSearchedUsers] = useState(null);

  const {
    currentPage,
    totalPages,
    usersCache,
    handlePageChange,
    handleDelete,
    handleSearch,
  } = useContext(ProfileContext);

  const handleSearchClick = async () => {
    try {
      const results = await handleSearch(searchTerm);
      setSearchedUsers(results);
    } catch (error) {
      toast.error("Failed to search users.");
      console.error("Search error:", error);
    }
  };
  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleProfilePage = () => {
    setProfilePage(true);
  };

  const handleCloseProfile = () => {
    setProfilePage(false);
  };

  const handleEditForm = (role, id) => {
    setUserType(role);
    setUserID(id);
    setEditProfilePage(true);
  };

  const handleCloseEditForm = () => {
    setEditProfilePage(false);
  };

  const toggleDropdown = (userId) => {
    setOpenDropdownId((prevId) => (prevId === userId ? null : userId));
  };

  const confirmDelete = async () => {
    if (!selectedUserId) {
      toast.error("No user selected for deletion.");
      return;
    }
    try {
      await handleDelete(selectedUserId);
      setSelectedUserId(null);
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user. Please try again.");
      showError(error.message);
      console.error("Error deleting user:", error);
    }
  };

  const selectedUserForEdit = (
    searchedUsers?.length > 0 ? searchedUsers : usersCache[currentPage]
  )?.find((user) => user.id === userID);

  return (
    <>
      <div className="users-list px-4 py-3">
        <div className="flex justify-between mb-6">
          <div className="text-xl font-bold mb-2">Users</div>
          <div className="flex mb-1 px-4 py-1 rounded-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users... "
              className="outline-none pl-4 rounded-l-lg w-[430px]"
            />
            <div className="flex bg-[#5D5FEF] text-white px-3 rounded-r-lg items-center">
              <button onClick={handleSearchClick} className="">
                <IoIosSearch size={28} />
              </button>
              <button className=" px-3 py-2 ">Search</button>
            </div>
          </div>
          <div className="flex bg-[#5D5FEF] items-center px-3 h-10   text-white rounded-lg gap-3">
            <div className="text-2xl">+</div>
            <div>
              <button
                onClick={handleProfilePage}
                className=" text-white rounded-md"
              >
                Add Profile
              </button>
            </div>
          </div>
        </div>

        <div>
          <UserTable
            users={searchedUsers || usersCache[currentPage] || []}
            handleUserClick={handleUserClick}
            toggleDropdown={toggleDropdown}
            openDropdownId={openDropdownId}
            handleEditForm={handleEditForm}
            handleDeleteClick={setSelectedUserId}
          />
        </div>

        <DeletePopup
          isOpen={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onConfirm={confirmDelete}
        />

        {selectedUser && (
          <UserDetailDialog user={selectedUser} onClose={handleCloseDialog} />
        )}
        {profilePage && <AddProfile onClose={handleCloseProfile} />}
        {editProfilePage && (
          <AddProfile
            onClose={handleCloseEditForm}
            Type={userType}
            user={selectedUserForEdit}
          />
        )}

        <div className="pagination mt-4">
          {[...Array(totalPages)].map((_, index) => {
            if (index >= totalPages) return null;
            return (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default UsersPage;
