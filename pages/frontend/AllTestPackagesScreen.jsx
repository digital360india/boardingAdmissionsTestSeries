"use client";
import TestPackageCard from "@/components/frontend/TestPackageCard";
import { TestContext } from "@/providers/testProvider";
import React, { useContext, useEffect, useState } from "react";

const AllTestPackagesScreen = () => {
    const { testPackages } = useContext(TestContext);
    const [filteredPackages, setFilteredPackages] = useState([]);

  useEffect(() => {
    if (testPackages) {
      setFilteredPackages(testPackages);
    }
  }, [testPackages]);

  return (
    <div className="py-10 px-5 sm:px-10">
      <h1 className="text-3xl font-bold text-center mb-8">All Test Packages</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPackages?.length > 0 ? (
          filteredPackages.map((testPackage) => (
            <TestPackageCard  key={testPackage.id} packageData={testPackage} />
          ))
        ) : (
          <div className="col-span-full text-center text-xl text-gray-500">
            No test packages available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTestPackagesScreen;
