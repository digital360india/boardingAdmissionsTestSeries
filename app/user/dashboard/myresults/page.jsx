"use client";
import { useSubscription } from "@/providers/subscriptionProvider";
import { UserContext } from "@/providers/userProvider";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import Loading from "@/app/loading";
import { TestSeriesContext } from "@/providers/testSeriesProvider";

export default function Page() {
  const [data, setData] = useState([]);
  const { user } = useContext(UserContext);
  const router = useRouter();
  const { allTests } = useContext(TestSeriesContext);

  useEffect(() => {
    const fetchTestTitles = () => {
      if (user?.myResults) {
        const updatedResults = user.myResults.map((result) => {
          const test = allTests.find((test) => test.id === result.id);

          if (test) {
            return {
              ...result,
              testTitle: test.testTitle,
              totalMarks: test.totalMarks,
            };
          }
          return result;
        });
        const sortedResults = updatedResults.sort((a, b) => {
          const timeA = a.testSubmissionTime?.seconds || 0;
          const timeB = b.testSubmissionTime?.seconds || 0;
          return timeB - timeA;
        });
  
        setData(sortedResults);
      }
    };
    fetchTestTitles();
  }, [user, allTests]);

  const getColor = (percentage) => {
    if (percentage < 40) return "bg-red-500";
    if (percentage < 80) return "bg-yellow-500";
    if (percentage < 90) return "bg-green-700";
    return "bg-green-300";
  };

  return (
    <div className="container mx-auto p-4 pb-28 md:pb-0">
      <h1 className="text-2xl font-bold text-center text-background04 mb-6">
        My Test Results
      </h1>
      {data.length > 0 ? (
        <div className="h-full">
          {data.map((test) => {
            const maxScore = test.totalMarks || 100; 
            const score = test.score || 0;
            const progressPercentage = Math.min((score / maxScore) * 100, 100); 
            const progressColor = getColor(progressPercentage);

            return (
              <div
                key={test.id}
                className="border flex bg-gray-50 px-4 pt-2 pb-8 rounded-md mb-6 flex-col md:flex-row justify-between items-center hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {test.testTitle || "Test Title Unavailable"}
                  </h2>
                  <p className="text-gray-600">{test.testDescription}</p>
                  <p className="text-gray-500 text-sm">
                    Time Taken: {test.timeTaken} minutes
                  </p>
                  <p className="text-gray-500 text-sm">
                    Test Submission Date:{" "}
                    {test.testSubmissionTime instanceof Date
                      ? new Date(test.testSubmissionTime).toLocaleDateString()
                      : test.testSubmissionTime?.seconds
                      ? new Date(
                          test.testSubmissionTime.seconds * 1000
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="w-full md:w-1/3 mt-4 md:mt-0">
                  <p className="text-gray-600">
                    Score: {score} / {maxScore}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                    <div
                      className={`h-4 rounded-full ${progressColor}`}
                      style={{
                        width: `${progressPercentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-4">
                  <a href={`/user/dashboard/testcompletion/${test.id}`}>
                    <button className="bg-background04 text-white px-4 py-2 rounded-lg w-full md:w-auto">
                      Show Result
                    </button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
