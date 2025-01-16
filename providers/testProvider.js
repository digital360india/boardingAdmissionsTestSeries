"use client";

import React, { createContext, useState, useEffect } from "react";
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
  const [testPackages, setTestPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, "testPackages"));
      const packages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestPackages(packages);
    } catch (err) {
      console.error("Error fetching test packages:", err);
      setError("Failed to fetch test packages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addPackage = async (packageData) => {
    try {
      const docRef = await addDoc(collection(db, "testPackages"), packageData);
      const newPackage = { id: docRef.id, ...packageData };
      setTestPackages((prevPackages) => [...prevPackages, newPackage]);
      return docRef;
    } catch (error) {
      console.error("Error adding package:", error);
      throw error;
    }
  };

  const handleDelete = async (packageIdToDelete) => {
    try {
      await deleteDoc(doc(db, "testPackages", packageIdToDelete));
      setTestPackages((prevPackages) =>
        prevPackages.filter((pkg) => pkg.id !== packageIdToDelete)
      );
    } catch (error) {
      console.error("Error deleting package:", error);
      throw error;
    }
  };

  const updateTestPackage = async (packageId, updatedData) => {
    try {
      const packageRef = doc(db, "testPackages", packageId);
      await updateDoc(packageRef, updatedData);
      setTestPackages((prevPackages) =>
        prevPackages.map((pkg) =>
          pkg.id === packageId ? { ...pkg, ...updatedData } : pkg
        )
      );
    } catch (error) {
      console.error("Error updating package:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTestPackages();
  }, []);

  if (loading) return <Loading />;

  return (
    <TestContext.Provider
      value={{
        testPackages,
        addPackage,
        handleDelete,
        updateTestPackage,
        error,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};
