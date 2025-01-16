"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useState } from "react";
import { IoPerson } from "react-icons/io5";
import { UserContext } from "@/providers/userProvider";

export const TopNavBar = () => {
  const path = usePathname();
  const pathArray = path.split("/");
  const { user } = useContext(UserContext);

  return (
    <div>
      {path !== "/login" && (
        <div className="bg-white text-[#151D48] p-4 m-4 mt-7 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center">
          {/* Title Section */}
          <div className="flex items-center gap-4 flex-1">
            <IoPerson className="text-[40px] md:text-[55px] p-2 border rounded-xl md:hidden block" />
            <div className="text-2xl md:text-3xl font-semibold capitalize">
              <Link href={`/${pathArray[1] === "" ? "Home" : pathArray[1]}`}>
                {pathArray[1] === "" ? "Home" : pathArray[1]}
              </Link>
              <span> Dashboard</span>
            </div>
          </div>

          {/* User Section */}
          <div className="md:flex hidden items-center gap-4">
            {/* Notifications */}
            <div className="hidden md:block">
              <Link href="#">
                <img
                  src="/notifications.svg"
                  alt="Notifications"
                  className="w-6 h-6 md:w-10 md:h-10"
                />
              </Link>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <IoPerson className="text-[40px] md:text-[55px] p-2 border rounded-xl" />
              <div className="text-left">
                <span className="text-black font-semibold block">
                  {user?.displayName || "Name"}
                </span>
                <span className="text-sm md:text-base">
                  {user?.role || "Role"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
