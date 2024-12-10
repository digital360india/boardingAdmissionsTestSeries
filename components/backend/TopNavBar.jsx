"use client";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "@/firebase/firebase"; // Ensure auth is imported correctly
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoPerson } from "react-icons/io5";

export const TopNavBar = () => {
  const path = usePathname();
  const pathArray = path.split("/");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            let displayName = "";
            if (userData.role === "admin") {
              displayName = userData.adminName || "Admin";
            } else if (userData.role === "teacher") {
              displayName = userData.teacherName || "Teacher";
            } else if (userData.role === "user") {
              displayName = userData.name || "User";
            }

            setUser({ ...userData, displayName });
          } else {
            console.error("No such user document in Firestore!");
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      } else {
        console.warn("No user is logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {path !== "/login" && (
        <div className="bg-white text-[#151D48] p-4 m-4 mt-7 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Title */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-semibold capitalize">
              <Link href={`/${pathArray[1] === "" ? "Home" : pathArray[1]}`}>
                {pathArray[1] === "" ? "Home" : pathArray[1]}
              </Link>
            </h2>
          </div>

          {/* Right Section */}
          <div className="flex gap-4 items-center">
            {/* Notifications Icon */}
            <div className="hidden md:block">
              <Link href="#">
                <img src="/notifications.svg" alt="Notifications" />
              </Link>
            </div>

            {/* User Profile */}
            <div className="flex gap-4 items-center">
              <IoPerson className="text-[40px] md:text-[55px] p-2 border rounded-xl" />
              <div className="text-center">
                <span className="text-black font-semibold">
                  {/* {user ? user.displayName : "Loading..."} */}
                Name
                </span>
                <br />
                <span className="text-sm md:text-base">
                  {user ? user.role : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
