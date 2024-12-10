"use client";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoPerson } from "react-icons/io5";

export const TopNavBar = () => {
  const path = usePathname();
  const pathArray = path.split("/");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid); 
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUser(userDoc.data());
          } else {
            console.error("No such user!");
          }
        } else {
          console.warn("No user is logged in");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
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
              <div className="text-center md:text-left">
                <span className="text-black font-semibold">
                  {user ? user.name : "Loading..."}
                </span>
                <br />
                <span className="text-sm md:text-base">
                  {user ? user.role || "User" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
