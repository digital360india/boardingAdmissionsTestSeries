"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { IoIosNotifications } from "react-icons/io";

export const TopNavBar = () => {
  const path = usePathname();
  const router = useRouter();
  const pathArray = path.split("/");

  return (
    <div>
      {path !== "/login" && (
        <div className="bg-background04  text-[#fff] p-4 m-4 mt-7 rounded-lg shadow-md flex justify-between items-center">
          <div className="">
            <h2 className="text-3xl font-semibold capitalize">
              <Link href={`/${pathArray[1] == "" ? "Home" : pathArray[1]}`}>
                {pathArray[1] == "" ? "Home" : pathArray[1]}
              </Link>
            </h2>
          </div>
        {/* <div className="flex gap-4 items-center">
            <div className=" hidden md:flex">
              <Link href="#">
                <IoIosNotifications size={24} className="" />
              </Link>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};
