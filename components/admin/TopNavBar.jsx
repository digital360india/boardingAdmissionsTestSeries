"use client";

import { db } from "@/firebase/firebase";
import { UserContext } from "@/providers/userProvider";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { LucidePackageOpen, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
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
      title: "Results",
      src: "/admin/dashboard/results",
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
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [allStatusesUpdated, setAllStatusesUpdated] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const q = query(
      collection(db, "leads"),
      where("timestamp", ">=", startOfDay),
      where("timestamp", "<=", endOfDay)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newLeads = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortedLeads = newLeads.sort(
        (a, b) => b.timestamp?.toDate() - a.timestamp?.toDate()
      );

      setNotifications(sortedLeads);

      setAllStatusesUpdated(false); // Reset the status when new leads are fetched
      const allUpdated = sortedLeads.every(
        (lead) => lead.disposition && lead.disposition !== "NA"
      );
      setAllStatusesUpdated(allUpdated);
    });

    return () => unsubscribe();
  }, []);

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
          <div
            onClick={() => setShowNotificationPopup(true)}
            className="cursor-pointer"
          >
            {allStatusesUpdated ? (
              <>
                <Image
                  src="/bell.png"
                  width={1000}
                  height={1000}
                  alt="Notifications"
                  className="w-6 h-6"
                />
              </>
            ) : (
              <>
                <Image
                  src="/notificationdot.png"
                  width={1000}
                  height={1000}
                  alt="Notifications"
                  className="w-6 h-6"
                />
              </>
            )}
          </div>

          {showNotificationPopup && (
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowNotificationPopup(false)}
            ></div>
          )}

          <div
            className={`fixed top-0 right-0 z-50 min-h-screen w-96 bg-gray-100 shadow-lg transform transition-transform duration-300 ease-in-out ${
              showNotificationPopup ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-3 relative h-full">
              <button
                onClick={() => setShowNotificationPopup(false)}
                className="absolute top-2 right-2 text-black"
              >
                <X />
              </button>
              <h2 className="text-lg font-semibold mb-4 text-[#151D48]">
                Notifications
              </h2>

              <div>
                {notifications.length > 0 ? (
                  notifications.map((lead, index) => (
                    <div
                      key={lead.id}
                      className={`p-3 rounded-md border-b border-black flex justify-between items-center mt-5
                      
                         ${
                           !lead.disposition || lead.disposition === "NA"
                             ? "bg-[#206e7fce] text-white"
                             : "bg-white text-black"
                         }`}
                    >
                      <p className="font-semibold">
                        Name: {lead.name || "Unnamed"}
                      </p>

                      <p className="text-sm ">
                        {lead.timestamp?.toDate
                          ? lead.timestamp.toDate().toLocaleTimeString()
                          : "No Time"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No new leads for today.</p>
                )}
              </div>
            </div>
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
