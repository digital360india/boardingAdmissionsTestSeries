"use client";
import { db } from "@/firebase/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { RiArrowDropUpFill } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import { PiDotsThreeBold } from "react-icons/pi";
import { FaReply, FaEdit, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import Loading from "@/app/loading";
import showError from "@/utils/functions/showError";

const Page = () => {
  const [leads, setLeads] = useState([]);
  const [naCount, setNaCount] = useState(0);
  const [hotCount, setHotCount] = useState(0);
  const [coldCount, setColdCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingLead, setEditingLead] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedLeadForDeletion, setSelectedLeadForDeletion] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phonenumber: "",
    disposition: "NA",
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const userList = usersSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const leadsSnap = await getDocs(collection(db, "leads"));
      const leadList = leadsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeads(leadList);
      setNaCount(
        leadList.filter(
          (lead) =>
            !lead.disposition || lead.disposition.trim().toUpperCase() === "NA"
        ).length
      );
      setHotCount(leadList.filter((lead) => lead.disposition === "Hot").length);
      setColdCount(
        leadList.filter((lead) => lead.disposition === "Cold").length
      );
    } catch (error) {
      console.error("Error fetching leads: ", error);
      showError(error.message);
    }
    setLoading(false);
  };

  const deleteLead = async () => {
    if (selectedLeadForDeletion) {
      await deleteDoc(doc(db, "leads", selectedLeadForDeletion));
      fetchData();
      setIsDeleteConfirmOpen(false);
      setSelectedLeadForDeletion(null);
    }
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead.id);
    setFormData({
      name: lead.name,
      email: lead.email,
      phonenumber: lead.phonenumber,
      disposition: lead.disposition || "NA",
    });
    setIsDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "leads", editingLead), formData);
    fetchData();
    setIsDialogOpen(false);
  };

  const handleDeleteConfirm = (id) => {
    setSelectedLeadForDeletion(id);
    setIsDeleteConfirmOpen(true);
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  const handleDispositionChange = async (leadId, disposition) => {
    await updateDoc(doc(db, "leads", leadId), { disposition });
    fetchData();
    setDropdownOpen(null);
  };
  const handleAssignMember = async (leadId, LeadAssignMember) => {
    await updateDoc(doc(db, "leads", leadId), { LeadAssignMember });
    fetchData();
    setDropdownOpen(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);

  const totalPages = Math.ceil(leads.length / leadsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  return (
    <div className="p-6">
      <div className="bg-white p-4 rounded-lg shadow-md mb-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-900">
            Today&apos;s Leads
          </h2>
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
            Export
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-6">Summary</p>
        <div className="flex gap-4">
          <div className="bg-[#206E7F] w-[240px] h-[130px] text-white p-4 rounded-lg shadow-lg">
            <p className="text-2xl font-semibold my-1">{naCount}</p>
            <h3 className="text-sm font-semibold">NA Leads</h3>
            <div className="flex items-center text-sm mt-2">
              <RiArrowDropUpFill className="text-[#3EFF18] text-5xl -ml-4" />
              <span className="-ml-2">0% from yesterday</span>
            </div>
          </div>
          <div className="bg-[#206E7F] w-[240px] h-[130px] text-white p-4 rounded-lg shadow-lg">
            <p className="text-2xl font-semibold my-1">{hotCount}</p>
            <h3 className="text-sm font-semibold">Hot Leads</h3>
            <div className="flex items-center text-sm mt-2">
              <RiArrowDropUpFill className="text-[#3EFF18] text-5xl -ml-4" />

              <span>0.5% from yesterday</span>
            </div>
          </div>
          <div className="bg-[#206E7F] w-[240px] h-[130px] text-white p-4 rounded-lg shadow-lg">
            <p className="text-2xl font-semibold my-1">{coldCount}</p>
            <h3 className="text-sm font-semibold">Cold Leads</h3>
            <div className="flex items-center text-sm mt-2">
              <RiArrowDropUpFill className="text-[#3EFF18] text-5xl -ml-4" />

              <span>0.5% from yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading leads...</p>
      ) : leads.length > 0 ? (
        <div>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Phone</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Disposition</th>
                <th className="py-2 px-4 text-left">Assign Member</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.map((lead) => (
                <tr key={lead.id}>
                  <td className="py-2 px-4">{lead.name}</td>
                  <td className="py-2 px-4">{lead.email}</td>
                  <td className="py-2 px-4">{lead.phonenumber}</td>
                  <td className="py-2 px-4">
                    {lead.timestamp?.toDate
                      ? lead.timestamp.toDate().toLocaleDateString()
                      : "No date"}
                  </td>

                  <td className="py-2 px-4">
                    <select
                      value={lead.disposition || "NA"}
                      onChange={(e) =>
                        handleDispositionChange(lead.id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {(!lead.disposition || lead.disposition === "NA") && (
                        <option value="NA">NA</option>
                      )}
                      <option value="Hot">Hot</option>
                      <option value="Cold">Cold</option>
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={lead.LeadAssignMember || "NA"}
                      onChange={(e) =>
                        handleAssignMember(lead.id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {(!lead.LeadAssignMember ||
                        lead.LeadAssignMember === "NA") && (
                        <option value="NA">NA</option>
                      )}
                      {users.map((user) => (
                        <option key={user.id} value={user.displayName}>
                          {user.displayName || "Unnamed User"}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <div className="relative">
                      <button
                        className="text-black px-2 py-1 rounded"
                        onClick={() => toggleDropdown(lead.id)}
                      >
                        <PiDotsThreeBold className="text-[35px]" />
                      </button>
                      {dropdownOpen === lead.id && (
                        <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-50">
                          <button
                            className="flex items-center gap-1 w-28 text-left px-4 py-2 text-blue-500 hover:bg-gray-100"
                            onClick={() => handleEditLead(lead)}
                          >
                            <FaEdit /> Edit
                          </button>
                          <hr />
                          <button
                            className="flex items-center gap-1 w-28 text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                            onClick={() => handleDeleteConfirm(lead.id)}
                          >
                            <MdDeleteSweep /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
                        currentPage === page ? "bg-[#2C2C2C] text-white" : ""
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
        </div>
      ) : (
        <p>No leads found.</p>
      )}

      {/* Confirm Deletion Dialog */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold">Confirm Deletion</h2>
            <p>Are you sure you want to delete this lead?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={deleteLead}
              >
                Delete
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <h2 className="text-lg font-semibold">Edit Lead</h2>
            <form onSubmit={handleUpdateLead}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full border rounded p-2 mb-2"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full border rounded p-2 mb-2"
              />
              <input
                type="text"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                className="w-full border rounded p-2 mb-2"
              />
              <select
                name="disposition"
                value={formData.disposition}
                onChange={handleChange}
                className="w-full border rounded p-2 mb-2"
              >
                <option value="NA">NA</option>
                <option value="Hot">Hot</option>
                <option value="Cold">Cold</option>
              </select>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
