"use client";

import React, { createContext, useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import Loading from "@/app/loading";

export const TestSeriesContext = createContext();

export const TestSeriesProvider = ({ children }) => {
  const [allTests, setAllTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tests from Firestore
  const fetchTests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, "tests"));
      const tests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllTests(tests);
    } catch (err) {
      console.error("Error fetching tests:", err);
      setError("Failed to fetch tests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new test
  const addTest = async (userData) => {
    setIsAdding(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, "tests"), userData);
      const newTest = { id: docRef.id, ...userData };
      setAllTests((prevTests) => [...prevTests, newTest]);
      return docRef;
    } catch (err) {
      console.error("Error adding test:", err);
      setError("Failed to add test. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  // Edit an existing test
  const handleEdit = async (testId, updatedData) => {
    setError(null);
    try {
      const testDocRef = doc(db, "tests", testId);
      await updateDoc(testDocRef, updatedData);
      setAllTests((prevTests) =>
        prevTests.map((test) =>
          test.id === testId ? { ...test, ...updatedData } : test
        )
      );
    } catch (err) {
      console.error("Error editing test:", err);
      setError("Failed to edit test. Please try again.");
    }
  };

  // Delete a test
  const handleDelete = async (testIdToDelete) => {
    setError(null);
    try {
      await deleteDoc(doc(db, "tests", testIdToDelete));
      setAllTests((prevTests) =>
        prevTests.filter((test) => test.id !== testIdToDelete)
      );
    } catch (err) {
      console.error("Error deleting test:", err);
      setError("Failed to delete test. Please try again.");
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  if (isLoading || isAdding) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <TestSeriesContext.Provider
      value={{ allTests, addTest, handleEdit, handleDelete }}
    >
      {children}
    </TestSeriesContext.Provider>
  );
};
