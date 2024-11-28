"use client";

import React, { createContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const fetchTests = async () => {
    const querySnapshot = await getDocs(collection(db, "tests"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  const {
    data: allTests = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allTests"],
    queryFn: fetchTests,
    staleTime: 1000 * 60 * 10,
  });

  const addTest = async (userData) => {
    try {
      const docRef = await addDoc(collection(db, "tests"), userData);

      queryClient.invalidateQueries(["allTests"]);
      return docRef;
    } catch (err) {
      console.error("Error adding test:", err);
    }
  };

  const handleEdit = async (testId, updatedData) => {
    try {
      const testDocRef = doc(db, "tests", testId);
      await updateDoc(testDocRef, updatedData);
      queryClient.invalidateQueries(["allTests"]);
      return testDocRef;
    } catch (err) {
      console.error("Error editing test:", err);
      throw err;
    }
  };

  const handleDelete = async (packageIdToDelete) => {
    if (packageIdToDelete) {
      await deleteDoc(doc(db, "tests", packageIdToDelete));
      queryClient.invalidateQueries(["allTests"]);
    }
  };

  if (isLoading || isAdding) return <Loading />;
  if (error) return <div>Error loading tests: {error.message}</div>;

  return (
    <TestSeriesContext.Provider
      value={{ allTests, addTest, handleEdit, handleDelete }}
    >
      {children}
    </TestSeriesContext.Provider>
  );
};
