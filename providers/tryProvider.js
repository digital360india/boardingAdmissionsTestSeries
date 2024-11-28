import React, { createContext, useContext } from "react";
import { doc, setDoc, updateDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/firebase";


export const TryContext = createContext();

export const TryProvider = ({ children }) => {
 
  const createUser = async (name, userData) => {
    try {
      const userRef = doc(collection(db, "messages"), name);
      await setDoc(userRef, userData);
      return userRef;
    } catch (error) {
      console.error(`Error creating user [${name}]: `, error);
      throw error;
    }
  };

  const updateUser = async (name, updatedData) => {
    try {
      const userRef = doc(db, "messages", name);
      await updateDoc(userRef, updatedData);
      console.log("updated")
      return userRef;
    } catch (error) {
      console.error(`Error updating user [${name}]: `, error);
      throw error;
    }
  };

  return (
    <TryContext.Provider value={{ createUser, updateUser }}>
      {children}
    </TryContext.Provider>
  );
};
