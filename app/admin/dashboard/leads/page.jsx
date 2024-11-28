"use client";
import { db } from "@/firebase/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { PiDotsThreeBold } from "react-icons/pi";
import { FaReply, FaEdit } from "react-icons/fa";
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const leadsSnap = await getDocs(collection(db, "leads"));
      const leadList = leadsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeads(leadList);
      setNaCount(leadList.filter((lead) => lead.disposition === "NA").length);
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

  useEffect(() => {
    fetchData();
  }, []);
  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leads</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-100 p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold">NA Leads</h3>
          <p className="text-xl font-bold">{naCount}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold">Hot Leads</h3>
          <p className="text-xl font-bold">{hotCount}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold">Cold Leads</h3>
          <p className="text-xl font-bold">{coldCount}</p>
        </div>
      </div>
      {loading ? (
        <p>Loading leads...</p>
      ) : leads.length > 0 ? (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Disposition</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="py-2 px-4 border-b ">{lead.name}</td>
                <td className="py-2 px-4 border-b">{lead.email}</td>
                <td className="py-2 px-4 border-b">{lead.phonenumber}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="text-black px-2 py-1 rounded"
                    onClick={() =>
                      handleDispositionChange(
                        lead.id,
                        lead.disposition === "Hot" ? "Cold" : "Hot"
                      )
                    }
                  >
                    {lead.disposition || "NA"}
                  </button>
                </td>
                <td className="py-2 px-4 border-b">
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
