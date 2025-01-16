"use client";

import { UserContext } from "@/providers/userProvider";
import { LucidePackageOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useState } from "react";
import { AiFillContacts } from "react-icons/ai";
import { FaEdit, FaHome, FaUser } from "react-icons/fa";
import { IoPerson, IoMenu, IoClose } from "react-icons/io5";

export const TopNavBar = () => {
  const path = usePathname();
  const pathArray = path.split("/");
  const { user } = useContext(UserContext);

  const { handleLogout } = useContext(UserContext);
  const Menus = [
    { title: "Dashboard", src: "/admin/dashboard", icon: <FaHome /> },

    {
      title: "Test Packages",
      src: "/admin/dashboard/testpackages",
      icon: <LucidePackageOpen />,
    },

    {
      title: "Test",
      src: "/admin/dashboard/tests",
      icon: <FaEdit />,
    },
    {
      title: "Users",
      src: "/admin/dashboard/allusers",
      icon: <FaUser />,
    },

    {
      title: "My Leads",
      src: "/admin/dashboard/leads",
      icon: <AiFillContacts />,
    },
  ];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <div className="bg-white text-[#151D48] p-4 mt-7 rounded-lg shadow-md flex justify-between md:hidden">
        <h2 className="text-2xl font-semibold capitalize">Dashboard</h2>
        <button onClick={toggleSidebar} className="text-3xl">
          <IoMenu />
        </button>
      </div>

      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleSidebar} className="text-3xl">
            <IoClose />
          </button>
        </div>
        <ul className="flex flex-col gap-4 p-5">
          {Menus.map((menu, index) => (
            <li key={index}>
              <Link
                href={menu.src}
                onClick={() => setIsSidebarOpen(false)}
                className={`text-lg flex items-center gap-2 ${
                  path === menu.src
                    ? "font-bold text-[#075D70]"
                    : "text-[#151D48]"
                }`}
              >
                {menu.icon}
                {menu.title}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="text-lg text-[#151D48] hover:text-red-500"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        ></div>
      )}

      <div className="hidden md:flex bg-white text-[#151D48] p-4 m-4 mt-7 rounded-lg shadow-md justify-between items-center gap-4">
        {/* Title */}
        <div className="text-left">
          <h2 className="text-3xl font-semibold capitalize">
            <Link href={`/${pathArray[1] === "" ? "Home" : pathArray[1]}`}>
              {pathArray[1] === "" ? "Home" : pathArray[1]}
            </Link>
            <span> Dashboard</span>
          </h2>
        </div>

        <div className="flex gap-4 items-center">
          <div>
            <Link href="#">
              <img src="/notifications.svg" alt="Notifications" />
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <IoPerson className="text-[55px] p-2 border rounded-xl" />
            <div>
              <span className="text-black font-semibold">Name</span>
              <br />
              <span className="text-base">{user?.displayName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
