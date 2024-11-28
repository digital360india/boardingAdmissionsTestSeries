"use client";
import React, { useContext } from "react";
import UserAnalytics from "@/utils/functions/getUserAnalytics";
import { UserContext } from "@/providers/userProvider";


const Page = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      {user && <UserAnalytics data={user} />}
      
    </div>
  );
};

export default Page;
