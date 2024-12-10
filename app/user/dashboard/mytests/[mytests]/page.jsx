"use client";
import React, { useState, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserContext } from "@/providers/userProvider";
import { TestContext } from "@/providers/testProvider";  
import { TestSeriesContext } from "@/providers/testSeriesProvider";
import Loading from "@/app/loading";

const Page = () => {
  const { user } = useContext(UserContext);
  const { testPackages } = useContext(TestContext);
  const { allTests } = useContext(TestSeriesContext);
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const packageID = pathParts[4];
  const [error, setError] = useState("");
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPackageData = () => {
      if (packageID) {
        const selectedPackage = testPackages.find((pkg) => pkg.id === packageID);
        if (!selectedPackage) {
          setError("Package not found.");
          setLoading(false);
          return;
        }
        const testsFromPackage = allTests.filter((test) =>
          selectedPackage.tests.includes(test.id)
        );

        setTests(testsFromPackage);
        setLoading(false);
      }
    };

    loadPackageData();
  }, [packageID, allTests, testPackages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-blue-600"><Loading /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const currentDate = new Date();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Tests in Package
      </h1>
      {tests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => {
            const testLiveDate = new Date(test.testUploadDate);
            const isLive = currentDate >= testLiveDate;
            const hasResult = user?.myResults?.some(
              (result) => result.id === test.id
            );

            return (
              <div
                key={test.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {test.testTitle}
                  </h2>
                  <p className="text-gray-600 mb-2">{test.testDescription}</p>
                  <div className="text-gray-500 text-sm mb-4">
                    <p>Duration: {test.duration} minutes</p>
                    <p>Start Date: {test.testUploadDate}</p>
                  </div>
                </div>

                <div className="mt-auto">
                  <Link
                    href={`/user/testScreen?category=${test.id}&reattempt=${hasResult}`}
                  >
                    <button
                      className={`px-4 py-2 rounded-lg w-full ${
                        isLive
                          ? hasResult
                            ? "bg-blue-500 text-white"
                            : "bg-blue-800 text-white"
                          : "bg-gray-400 text-gray-700"
                      }`}
                      disabled={!isLive}
                    >
                      {isLive
                        ? hasResult
                          ? "Re-Attempt"
                          : "Take Test"
                        : "Test will be available soon"}
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No tests found in this package.
        </p>
      )}
    </div>
  );
};

export default Page;
