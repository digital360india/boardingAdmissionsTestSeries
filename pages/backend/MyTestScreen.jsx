"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { UserContext } from "@/providers/userProvider";
import { TestContext } from "@/providers/testProvider";
import Image from 'next/image'; 
import Loading from "@/app/loading";

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
      {user ? (
        <div className="container mx-auto p-4 pb-28 mb:pb-10">
          <h1 className="text-3xl font-bold mb-6 ">My Packages</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <div key={pkg.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <Image 
                    src={pkg.packageImage} 
                    alt={pkg.packageName} 
                    width={1000} 
                    height={1000} 
                    className="object-cover h-60 object-top" 
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{pkg.packageName}</h2>
                    <p className="text-gray-700 mt-2">{`Starting Date: ${new Date(pkg.packageLiveDate).toLocaleDateString()}`}</p>
                    <p className="text-gray-700 mt-1">{`Date of Creation: ${new Date(pkg.createdAt).toLocaleDateString()}`}</p>
                    <div className="mt-4 flex w-full justify-between items-center">
                      <Link className="flex w-full" href={`/user/dashboard/mytests/[mytests]`} as={`/user/dashboard/mytests/${pkg.id}`}>
                        <button className="bg-background04 text-white px-4 py-2 rounded-lg w-full">Take a Test</button>
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
