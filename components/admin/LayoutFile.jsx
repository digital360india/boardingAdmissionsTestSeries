'use client';
import React, { useContext, useEffect, useState } from "react";
import { SideNavBar } from "./SideNavBar";
import { TopNavBar } from "./TopNavBar";
import Verification from "../frontend/Verification";
import { UserContext } from "@/providers/userProvider";

export default function LayoutFile({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user && user.isVerified) {
    }
  }, [user]);

  if (!user?.isVerified) {
    return <Verification user={user} />;
  }
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
