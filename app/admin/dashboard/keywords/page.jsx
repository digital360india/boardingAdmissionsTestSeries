"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import "@/components/admin/ScrollbarCss.css";

const Page = () => {
  const [schools, setSchools] = useState([]);
  const [boards, setBoards] = useState([]);
  const [newSchool, setNewSchool] = useState("");
  const [newBoard, setNewBoard] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [editingBoard, setEditingBoard] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [deletingItem, setDeletingItem] = useState(null);

  const fetchData = async () => {
    const schoolsSnapshot = await getDocs(collection(db, "schools"));
    const schoolsList = schoolsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSchools(schoolsList);

    const boardsSnapshot = await getDocs(collection(db, "boards"));
    const boardsList = boardsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setBoards(boardsList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (deletingItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [deletingItem]);

  const addSchool = async () => {
    const docRef = await addDoc(collection(db, "schools"), {
      schoolName: newSchool,
    });
    await updateDoc(docRef, { id: docRef.id });

    setNewSchool("");
    fetchData();
  };

  const addBoard = async () => {
    const docRef = await addDoc(collection(db, "boards"), {
      boardName: newBoard,
    });
    await updateDoc(docRef, { id: docRef.id });
    setNewBoard("");
    fetchData();
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    try {
      await deleteDoc(
        doc(
          db,
          deletingItem.type === "school" ? "schools" : "boards",
          deletingItem.id
        )
      );
      fetchData();
    } catch (error) {
      console.error(`Error deleting ${deletingItem.type}:`, error);
    }

    setDeletingItem(null);
  };
  // const deleteSchool = async (id) => {
  //   try {
  //     await deleteDoc(doc(db, "schools", id));
  //     fetchData();
  //   } catch (error) {
  //     console.error("Error deleting school:", error);
  //   }
  //   setDeletingSchoolId(null);
  // };

  // const deleteBoard = async (id) => {
  //   await deleteDoc(doc(db, "boards", id));
  //   fetchData();
  // };

  const handleEditSchool = (school) => {
    setEditingSchool(school);
    setEditedName(school.schoolName);
    setIsDialogOpen(true);
  };

  const handleEditBoard = (board) => {
    setEditingBoard(board);
    setEditedName(board.boardName);
    setIsDialogOpen(true);
  };

  const saveEdit = async () => {
    if (editingSchool) {
      const schoolDoc = doc(db, "schools", editingSchool.id);
      if (editedName !== editingSchool.schoolName) {
        await updateDoc(schoolDoc, { schoolName: editedName });
      }
    }

    if (editingBoard) {
      const boardDoc = doc(db, "boards", editingBoard.id);
      if (editedName !== editingBoard.boardName) {
        await updateDoc(boardDoc, { boardName: editedName });
      }
    }

    setIsDialogOpen(false);
    setEditingSchool(null);
    setEditingBoard(null);
    fetchData();
  };

  return (
    <div className="container mx-auto p-2 lg:p-4">
      <div className="md:flex justify-center items-center md:gap-5">
        {/* Schools Section */}
        <div className="md:w-[50%] p-4 bg-gray-50  rounded-2xl border border-gray-300">
          <div className="flex justify-between items-center text-[#151D48]  border-b border-gray-300">
            <h2 className="text-2xl font-bold mb-4">Schools</h2>
          </div>
          <ul className="space-y-2 h-72  overflow-y-scroll custom-scrollbar">
            {schools.map((school) => (
              <li
                key={school.id}
                className="flex justify-between items-center bg-white shadow-md p-2 rounded-lg"
              >
                <span className="text-lg w-[50%] md:w-[40%] lg:w-[60%] ">
                  {school.schoolName}
                </span>

                <div className="space-x-2">
                  <button
                    // onClick={() => setDeletingSchoolId(school.id)}
                    onClick={() =>
                      setDeletingItem({ id: school.id, type: "school" })
                    }
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditSchool(school)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex space-x-4">
            <input
              type="text"
              placeholder="Add new school"
              value={newSchool}
              onChange={(e) => setNewSchool(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button
              onClick={addSchool}
              className="bg-green-500 hover:bg-green-700 text-white font-bold w-[250px] rounded-lg"
            >
              Add School
            </button>
          </div>
        </div>

        {/* Boards Section */}
        <div className="md:w-[50%] p-4 bg-gray-50 border border-gray-300  rounded-2xl mt-10 md:mt-0">
          <div className="flex justify-between items-center  border-b border-gray-300 text-[#151D48]">
            <h2 className="text-2xl font-bold mb-4 ">Boards</h2>
          </div>
          <ul className="space-y-4 h-72 overflow-y-scroll custom-scrollbar">
            {boards.map((board) => (
              <li
                key={board.id}
                className="flex justify-between items-center bg-white shadow-md p-2 rounded-lg"
              >
                <span className="text-lg">{board.boardName}</span>
                <div className="space-x-2">
                  <button
                    // onClick={() => deleteBoard(board.id)}
                    onClick={() =>
                      setDeletingItem({ id: board.id, type: "board" })
                    }
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditBoard(board)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex space-x-4">
            <input
              type="text"
              placeholder="Add new board"
              value={newBoard}
              onChange={(e) => setNewBoard(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button
              onClick={addBoard}
              className="bg-green-500 hover:bg-green-700 text-white font-bold w-[250px] rounded-md"
            >
              Add Board
            </button>
          </div>
        </div>
      </div>
      {/* Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              {editingSchool ? "Edit School" : "Edit Board"}
            </h3>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-background06 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete this{" "}
              {deletingItem.type === "school" ? "School" : "Board"}?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
