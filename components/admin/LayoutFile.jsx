'use client';
import React, {useState } from "react";
import { SideNavBar } from "./SideNavBar";
import { TopNavBar } from "./TopNavBar";


export default function LayoutFile({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      <SideNavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className={`flex flex-col w-full transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-[85px]'}`}>
        <TopNavBar />
        <main className="flex-grow p-4 ">{children}</main>
      </div>
    </div>
  );
}
