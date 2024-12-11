"use client";

import { UserContext } from "@/providers/userProvider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext } from "react";
import { IoIosNotifications } from "react-icons/io";
import { IoPerson } from "react-icons/io5";

export const TopNavBar = () => {
  const path = usePathname();
  const router = useRouter();
  const pathArray = path.split("/");
 
  const { user } = useContext(UserContext);

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
           <span> Dashboard</span> 
          </h2>
        </div>

        <div className="flex gap-4 items-center">
          <div className="hidden md:block">
            <Link href="#">
              <img src="/notifications.svg" alt="Notifications" />
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <IoPerson className="text-[40px] md:text-[55px] p-2 border rounded-xl" />
            <div className="text-center">
              <span className="text-black font-semibold">
              Name
              </span>
              <br />
              <span className="text-sm md:text-base">
                {/* {user ? user.role : ""} */}
                {user?.displayName}
              </span>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};
