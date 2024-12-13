"use client";
import React, { useState} from "react";
import { TopNavBar } from "./TopNavBar";
import { SideNavBar } from "./SideNavBar";
import BottomNavbar from "./BottomNavbar";


export default function LayoutFile({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);



  return (
    <div className="lg:flex">
      <div className="hidden lg:block">
        <SideNavBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      <div className="md:hidden block">
        <BottomNavbar />
      </div>
      <div
        className={`hidden lg:flex flex-col w-full transition-all duration-300 ${
          isSidebarOpen ? "ml-72" : "ml-[85px]"
        }`}
      >
        <TopNavBar />
        <main className="flex-grow p-4 h-screen">{children}</main>
      </div>
      <div
        className={`lg:hidden flex flex-col w-full transition-all duration-300 `}
      >
        <TopNavBar />
        <main className="flex-grow p-4 h-screen">{children}</main>
      </div>
    </div>
  );
}
