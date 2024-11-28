"use client";

import React, { createContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import Loading from "@/app/loading";


export const TestContext = createContext();

export const TestProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const fetchTestPackages = async () => {
    const querySnapshot = await getDocs(collection(db, "testPackages"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  const {
    data: testPackages = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["testPackages"],
    queryFn: fetchTestPackages,
    staleTime: 1000 * 60 * 10,
  });

  const addPackage = async (packageData) => {
    try {
      const docRef = await addDoc(collection(db, "testPackages"), packageData);
      queryClient.invalidateQueries(["testPackages"]);
      return docRef;
    } catch (error) {
      console.error("Error adding package:", error);
      throw error;
    }
  };

  const handleDelete = async (packageIdToDelete) => {
    if (packageIdToDelete) {
      await deleteDoc(doc(db, "testPackages", packageIdToDelete));
      queryClient.invalidateQueries(["testPackages"]);
    }
  };

  const updateTestPackage = async (packageId, updatedData) => {
    const packageRef = doc(db, "testPackages", packageId);
    await updateDoc(packageRef, updatedData);
    queryClient.invalidateQueries(["testPackages"]);
  };

  if (isLoading) return <Loading />;

  return (
    <TestContext.Provider
      value={{ testPackages, handleDelete, updateTestPackage, addPackage }}
    >
      {children}
    </TestContext.Provider>
  );
};
