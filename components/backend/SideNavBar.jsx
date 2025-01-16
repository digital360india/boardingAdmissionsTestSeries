"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import {
  FaBook,
  FaEdit,
  FaHome,
  FaPen,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { usePathname } from "next/navigation";
import { UserContext } from "@/providers/userProvider";

export const SideNavBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const router = useRouter();
  const { handleLogout } = useContext(UserContext);
  const Menus = [
    { title: "Home", src: "/user/dashboard", icon: <FaHome /> }, 

    {
      title: "My Tests",
      src: "/user/dashboard/mytests",
      icon: <FaPen />,
    },
    {
      title: "My Results",
      src: "/user/dashboard/myresults",
      icon: <FaBook />,
    },
  ];
  const path = usePathname();

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen bg-white p-5 pt-8 duration-300 flex flex-col ${
          isSidebarOpen ? "w-72" : "w-[85px]"
        }`}
      >
        <div
          className={`absolute cursor-pointer right-5 top-14 bg-theme-primary border-[#fff] border-2 rounded-full p-2 ${
            !isSidebarOpen && "rotate-180"
          }`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g fill="none">
              <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
              <path
                fill="white"
                d="M3.636 11.293a1 1 0 0 0 0 1.414l5.657 5.657a1 1 0 0 0 1.414-1.414L6.757 13H20a1 1 0 1 0 0-2H6.757l3.95-3.95a1 1 0 0 0-1.414-1.414z"
              />
            </g>
          </svg>
        </div>

        {/* Sidebar Logo */}
        <div className="flex items-center justify-center px-2">
          <div
            className={`font-medium text-xl duration-200 ${
              !isSidebarOpen && "scale-0"
            }`}
          >
            <Link href={"/user/dashboard"}>
              <img
                src="/navbar.svg"
                className="w-20 h-20 bg-[#fff] rounded-full"
              />
            </Link>
          </div>
        </div>

        <ul className="pt-6 flex-1">
          <div className="flex items-center gap-6 bg-[#075D70] text-white font-bold text-[18px] rounded-lg px-6 py-2 w-full cursor-pointer">
            <img src="/Graph1.svg" className="h-10 w-10" alt="" /> Dashboard
          </div>
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`text-[#000000B2] text-sm items-center ${
                Menu.gap ? "mt-9" : "mt-[1rem]"
              } ${index === 0 && "bg-light-[#fff]"}`}
            >
              <Link
                href={Menu.src}
                className={`${
                  path === Menu.src ||
                  (index !== 0 && path.startsWith(Menu.src))
                    ? "flex items-center gap-6 border-l-4 border-[#075D70] bg-[#297383E5] text-white font-bold rounded-r-lg p-2 w-full cursor-pointer"
                    : "flex items-center gap-6 hover:border-[#075D70] rounded-md p-2 w-full cursor-pointer"
                }`}
              >
                <span className={`text-xl ${!isSidebarOpen && "text-center"}`}>
                  {Menu.icon}
                </span>
                <span
                  className={`${
                    !isSidebarOpen && "hidden"
                  } origin-left tracking-wide duration-200 text-base`}
                >
                  {Menu.title}
                </span>
              </Link>
            </li>
          ))}
          <button
            onClick={handleLogout}
            className={`${
              isSidebarOpen
                ? "flex items-center ml-[10px] gap-6 text-[#000000B2] mt-2 font-bold rounded-r-lg w-full cursor-pointer"
                : "flex items-center gap-6 hover:border-[#075D70] border-l-4 border-[#075D70] bg-[#297383E5] rounded-md p-2 w-full cursor-pointer"
            }`}
          >
            <FaSignOutAlt
              className={`text-xl ${!isSidebarOpen && "text-center"}`}
            />
            <span
              className={`${
                !isSidebarOpen && "hidden"
              } origin-left tracking-wide duration-200 text-base`}
            >
              Log Out
            </span>
          </button>
        </ul>

        {/* <div className="mt-auto flex items-center gap-6 border border-[#FFFFFF40] hover:border-[#FFFFFF] rounded-md w-full cursor-pointer">
          <button
            onClick={handleLogout}
            className="text-[#fff] flex items-center gap-2"
          >
            <FaSignOutAlt
              className={`text-xl ${!isSidebarOpen && "text-center"}`}
            />
            <span
              className={`${
                !isSidebarOpen && "hidden"
              } origin-left tracking-wide duration-200 text-base`}
            >
              Log Out
            </span>
          </button>
        </div> */}
      </div>
    </>
  );
};
