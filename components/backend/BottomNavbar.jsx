"use client";
import Link from "next/link";
import React from "react";
import { FaHome, FaPen, FaBook, FaCog } from "react-icons/fa";
import { usePathname } from "next/navigation";

const BottomNavbar = () => {
  const pathname = usePathname();

  const getLinkClass = (path) => {
    return pathname === path
      ? "flex flex-col items-center text-blue-600 transition duration-200"
      : "flex flex-col items-center text-gray-600 hover:text-blue-600 transition duration-200";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center py-3">
        <Link href="/user/dashboard" className={getLinkClass("/user/dashboard")}>
          <FaHome className="text-2xl" />
          <span className="text-xs">Dashboard</span>
        </Link>
        <Link href="/user/dashboard/mytests" className={getLinkClass("/user/dashboard/mytests")}>
          <FaPen className="text-2xl" />
          <span className="text-xs">Packages</span>
        </Link>
        <Link href="/user/dashboard/myresults" className={getLinkClass("/user/dashboard/myresults")}>
          <FaBook className="text-2xl" />
          <span className="text-xs">My Results</span>
        </Link>
        <Link href="/user/dashboard/settings" className={getLinkClass("/user/dashboard/settings")}>
          <FaCog className="text-2xl" />
          <span className="text-xs">Settings</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavbar;
