"use client";
import React, { useContext, useEffect, useState } from "react";
import { TopNavBar } from "./TopNavBar";
import { SideNavBar } from "./SideNavBar";
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
    <div className="lg:flex">
      <div className="hidden lg:block">
        {" "}
        <SideNavBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>{" "}
      <div
        className={`hidden lg:flex flex-col w-full transition-all duration-300 ${
          isSidebarOpen ? "ml-72" : "ml-[85px]"
        }`}
      >
        <TopNavBar />
        <main className="flex-grow p-4 overflow-y-auto h-screen">
          {children}
        </main>
      </div>
      <div
        className={`lg:hidden flex flex-col w-full transition-all duration-300 `}
      >
        <TopNavBar />
        <main className="flex-grow p-4 overflow-y-auto h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}