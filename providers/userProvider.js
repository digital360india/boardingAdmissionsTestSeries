"use client";
import React, { createContext, useState, useEffect } from "react";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getCookieValue = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };
  const router = useRouter();
  const handleLogout = () => {
    deleteCookie("userId");
    deleteCookie("userRole");

    setUser(null);
    toast.success("Logged out successfully");
    router.push("/");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const encryptedUserId = getCookieValue("userId");
      if (encryptedUserId) {
        try {
          const bytes = CryptoJS.AES.decrypt(
            encryptedUserId,
            "qwertyhnbgvfcdxsza"
          );
          const decryptedUserId = bytes.toString(CryptoJS.enc.Utf8);
          const userRef = doc(db, "users", decryptedUserId);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            setUser(userDoc.data());
          } else {
            console.error("User document not found");
          }
        } catch (error) {
          console.error("Error decrypting or fetching user:", error);
        }
      }
    };

    fetchUserData();
  }, []);
  return (
    <UserContext.Provider value={{ user, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};
