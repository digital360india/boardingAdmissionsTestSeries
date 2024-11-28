"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/firebase/firebase";
import { query, where, collection, getDocs } from "firebase/firestore";

export const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

const fetchAdminSubscriptionStatus = async () => {
  try {
    const adminQuery = query(
      collection(db, "users"),
      where("isOwner", "==", true)
    );
    const querySnapshot = await getDocs(adminQuery);

    if (!querySnapshot.empty) {
      const adminDoc = querySnapshot.docs[0];
      const adminData = adminDoc.data();

      const subscriptionData = adminData.subscription;

      const currentTime = new Date();

      const subscriptionEndTime = subscriptionData?.subscriptionEndTime;

      const endTimeDate = subscriptionEndTime
        ? new Date(subscriptionEndTime.seconds * 1000)
        : null;

      const isSubscriptionActive = endTimeDate
        ? currentTime < endTimeDate
        : false;

      return {
        isActive: isSubscriptionActive,
        subscriptionEndTime: endTimeDate,
        ...subscriptionData,
      };
    } else {
      console.log("No admin found with isOwner true.");
    }
  } catch (error) {
    return { isActive: false, error: "Failed to fetch subscription data." };
  }

  return { isActive: false };
};

export const SubscriptionProvider = ({ children }) => {
  const [subscriptionData, setSubscriptionData] = useState(null);

  useEffect(() => {
    const getSubscriptionStatus = async () => {
      const data = await fetchAdminSubscriptionStatus();
      setSubscriptionData(data);
    };

    getSubscriptionStatus();
  }, []);

  return (
    <SubscriptionContext.Provider value={{ subscriptionData }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
