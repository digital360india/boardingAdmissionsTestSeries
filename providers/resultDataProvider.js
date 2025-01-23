"use client";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import React, { createContext, useEffect, useState } from "react";
export const ResultContext = createContext();

export default function ResultDataProvider({ children }) {
  const [results, setResults] = useState([]);
  const fetchResults = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "results"));
      const result = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResults(result);
    } catch (err) {
      console.error("Error fetching results:", err);
    }
  };
  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <ResultContext.Provider value={{ results }}>
      {children}
    </ResultContext.Provider>
  );
}
