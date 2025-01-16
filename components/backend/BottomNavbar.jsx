"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef, useContext } from "react";
import { FaHome, FaPen, FaBook, FaCog } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { UserContext } from "@/providers/userProvider";

const BottomNavbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { handleLogout } = useContext(UserContext);
  const dropdownRef = useRef(null); 

  const getLinkClass = (path) => {
    return pathname === path
      ? "flex flex-col items-center text-[#075D70] transition duration-200"
      : "flex flex-col items-center text-gray-600 hover:text-[#075D70] transition duration-200";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center py-3 relative">
      
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
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer flex flex-col items-center text-gray-600 hover:text-[#075D70] transition duration-200"
          >
            <FaCog className="text-2xl" />
            <span className="text-xs">Settings</span>
          </div>
          {isOpen && (
            <div className="absolute bottom-12 right-0 bg-white shadow-lg rounded-md border border-gray-200">
              <ul>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavbar;
