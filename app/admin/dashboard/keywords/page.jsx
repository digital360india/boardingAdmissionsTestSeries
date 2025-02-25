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

const Page = () => {
  const [schools, setSchools] = useState([]);
  const [boards, setBoards] = useState([]);
  const [newSchool, setNewSchool] = useState("");
  const [newBoard, setNewBoard] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [editingBoard, setEditingBoard] = useState(null);
  const [editedName, setEditedName] = useState("");

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

  const addSchool = async () => {
  const docRef =  await addDoc(collection(db, "schools"), { schoolName: newSchool });
    await updateDoc(docRef, { id: docRef.id});

    setNewSchool("");
    fetchData();
  };

  const addBoard = async () => {
    const docRef =  await addDoc(collection(db, "boards"), { boardName: newBoard });
    await updateDoc(docRef, { id: docRef.id});
    setNewBoard("");
    fetchData();
  };

  const deleteSchool = async (id) => {
    await deleteDoc(doc(db, "schools", id));
    fetchData();
  };

  const deleteBoard = async (id) => {
    await deleteDoc(doc(db, "boards", id));
    fetchData();
  };

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
    <div className="container mx-auto p-4">
      {/* Schools Section */}
      <div className="p-4 px-8 bg-background05 rounded-2xl ">
        <h2 className="text-2xl font-bold mb-4 text-white">Schools</h2>
        <ul className="space-y-2 h-72  overflow-y-scroll ">
          {schools.map((school) => (
            <li
              key={school.id}
              className="flex justify-between items-center bg-white shadow-md p-2 rounded-lg"
            >
              <span className="text-lg">{school.schoolName}</span>
              <div className="space-x-2">
                <button
                  onClick={() => deleteSchool(school.id)}
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
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Add School
          </button>
        </div>
      </div>

      {/* Boards Section */}
      <div className="p-4 px-8 bg-background05 rounded-2xl mt-10 ">
        <h2 className="text-2xl font-bold mb-4 text-white">Boards</h2>
        <ul className="space-y-4 h-72 overflow-y-scroll">
          {boards.map((board) => (
            <li
              key={board.id}
              className="flex justify-between items-center bg-white shadow-md p-2 rounded-lg"
            >
              <span className="text-lg">{board.boardName}</span>
              <div className="space-x-2">
                <button
                  onClick={() => deleteBoard(board.id)}
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
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Add Board
          </button>
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
    </div>
  );
};

export default Page;
