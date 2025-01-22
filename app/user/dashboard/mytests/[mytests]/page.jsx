"use client";
import React, { useState, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserContext } from "@/providers/userProvider";
import { TestContext } from "@/providers/testProvider";
import { TestSeriesContext } from "@/providers/testSeriesProvider";
import Loading from "@/app/loading";
import { SlCalender } from "react-icons/sl";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { MdOutlineTimelapse } from "react-icons/md";
const Page = () => {
  const { user } = useContext(UserContext);
  const { testPackages } = useContext(TestContext);
  const { allTests } = useContext(TestSeriesContext);
  const packageID = usePathname().split("/")[4];
  const [error, setError] = useState("");
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPackageData = () => {
      if (packageID) {
        const selectedPackage = testPackages.find(
          (pkg) => pkg.id === packageID
        );
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
        <div className="text-blue-600">
          <Loading />
        </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tests.map((test) => {
            const testLiveDate = new Date(test.testUploadDate);
            const isLive = currentDate >= testLiveDate;
            const hasResult = user?.myResults?.some(
              (result) => result.id === test.id
            );
            console.log(hasResult);

            return (
              <div
                key={test.id}
                className="bg-white rounded-lg border border-[#E5E0E0] w-[350px] p-6 flex flex-col justify-between h-full"
              >
                <div>
                  <h2 className="text-2xl font-medium mb-2">
                    {test.testTitle}
                  </h2>
                  <p className="text-[18px] mb-2">{test.testDescription}</p>
                  <div className="text-sm my-5 flex-col space-y-4">
                    <div className="flex justify-between text-[18px]">
                      <div>
                        <div className="flex gap-2 items-center">
                          <p>
                            <SlCalender />
                          </p>
                          <p className="">Creation Date</p>
                        </div>
                      </div>
                      <div>{test.testUploadDate}</div>
                    </div>
                    <div className="flex justify-between text-[18px]">
                      <div>
                        <div className="flex gap-2 items-center">
                          <p>
                            <MdOutlineTimelapse className="text-[22px]" />
                          </p>
                          <p>Duration</p>
                        </div>
                      </div>
                      <div>{test.duration}</div>
                    </div>
                    <div className="flex justify-between text-[18px]">
                      <div>
                        <div className="flex gap-2 items-center">
                          <div>
                            <img src="/readiness_score.svg" alt="readiness" />  
                          </div>
                          <p className="">Total Marks</p> 
                        </div>
                      </div>
                      <div>{test.totalMarks}</div>
                    </div>
                    <div className="flex justify-between text-[18px]">
                      <div>
                        <div className="flex gap-2 items-center">
                          <p>
                            <HiOutlineQuestionMarkCircle className="text-[22px]" />
                          </p>
                          <p>Subjects</p>
                        </div>
                      </div>
                      <div>
                        {Array.isArray(test.subjects) ? test.subjects : 0}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <Link
                    href={`/user/testScreen?category=${test.id}&reattempt=${hasResult}`}
                  >
                    <button
                      className={`px-4 py-2 rounded-md w-full ${
                        isLive
                          ? hasResult
                            ? "bg-[#075D70] text-white"
                            : "bg-[#075D70] text-white"
                          : "bg-[#075D7080] text-gray-700"
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
