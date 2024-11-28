"use client"
import React, { createContext, useContext, useState, useEffect } from "react";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import Loading from "@/app/loading";

export const AdminDataContext = createContext();

export const AdminDataProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "admin"),
        where("isOwner", "==", true)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const adminDoc = querySnapshot.docs[0].data();
        setAdminData(adminDoc);
      } else {
        console.log("No admin data found");
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if(loading){
    <Loading/>
  }
  if(error){
    <div>Error Occured </div>
  }
  return (
    <AdminDataContext.Provider value={{ adminData, loading }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => useContext(AdminDataContext);
