"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { UserContext } from "@/providers/userProvider";
import { TestContext } from "@/providers/testProvider";
import Image from 'next/image'; 
import Loading from "@/app/loading";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const MyTestScreen = () => {
  const { user } = useContext(UserContext);
  const { testPackages = [] } = useContext(TestContext) || {}; 
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user?.role === "user") {
      const filteredPackages = user.mytestpackages
        .map((pkg) => 
          testPackages.find((testPackage) => testPackage.id === pkg.packageId)
        )
        .filter(Boolean); 
      setPackages(filteredPackages);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, testPackages]);

  if (loading) return <div><Loading /></div>;

  return (
    <>
    <ToastContainer />
      {user ? (
    <div className="container mx-auto p-4 pb-28 mb:pb-10">
    <h1 className="text-[32px] font-medium mb-6">{user.displayName} Packages</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.length > 0 ? (
        packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white shadow-lg rounded-lg p-4 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <h2 className="text-[26px] font-medium mt-2 mb-6">{pkg.packageName}</h2>
              <Image
                src={pkg.packageImage}
                alt={pkg.packageName}
                width={1000}
                height={1000}
                className="object-cover h-60 rounded-lg object-top border"
              />
            </div>
            <div className="p-4 text-[20px] flex flex-col h-full">
              <p className="my-2">{`Starting Date: ${pkg.startingDate}`}</p>
              <p>Package Description: {pkg.packageDescription}</p>
              <div className="mt-auto flex w-full justify-between items-center">
                <Link
                  className="flex w-full"
                  href={`/user/dashboard/mytests/[mytests]`}
                  as={`/user/dashboard/mytests/${pkg.id}`}
                >
                  <button className="bg-[#075D70] text-white px-4 py-2 mt-8 rounded-lg w-full">
                    View Tests
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No test packages available.</p>
      )}
    </div>
  </div>
  
      ) : (
       <Loading/>
      )}
    </>
  );
};

export default MyTestScreen;
