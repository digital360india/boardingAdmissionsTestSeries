// utils/subscription/subscription.js
import { db } from "@/firebase/firebase";
import { query, where, collection, getDocs } from "firebase/firestore";

export const getSubscriptionStatus = async () => {
  try {
    const adminQuery = query(
      collection(db, "admin"),
      where("isOwner", "==", true)
    );
    const querySnapshot = await getDocs(adminQuery);

    if (!querySnapshot.empty) {
      const adminDoc = querySnapshot.docs[0];
      const adminData = adminDoc.data();
      const subscriptionData = adminData.subscription; 
      const currentTime = new Date();
      const subscriptionEndTime = subscriptionData?.subscriptionEndTime.toDate();
      
      return currentTime < subscriptionEndTime; // Return true if active, false otherwise
    } else {
      console.warn("No admin found with isOwner set to true.");
    }
  } catch (error) {
    console.error("Error fetching admin subscription:", error); // More detailed error log
  }

  return false; // Default to false if there's an error or no admin found
};
