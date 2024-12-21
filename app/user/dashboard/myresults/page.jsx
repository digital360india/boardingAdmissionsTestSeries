"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/providers/userProvider";
import { TestSeriesContext } from "@/providers/testSeriesProvider";
import Loading from "@/app/loading";
import { MdOutlineTimelapse } from "react-icons/md";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";

export default function Page() {
  const [data, setData] = useState([]);
  const { user } = useContext(UserContext);
  const { allTests } = useContext(TestSeriesContext);
  const router = useRouter();

  useEffect(() => {
    const fetchTestTitles = () => {
      if (user?.myResults) {
        const updatedResults = user.myResults.map((result) => {
          const test = allTests.find((test) => test.id === result.id);
          if (test) {
            return {
              ...result,
              testTitle: test.testTitle,
              totalMarks: test.Totalmarks,
              questionsCount: test.test.length,
              duration: test.duration,
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

  if (!user || !allTests) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 pb-28 md:pb-0">
      <h1 className="text-2xl font-bold text-center text-background04 mb-6">
        My Test Results
      </h1>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((test) => {
            const maxScore = test.totalMarks || 100;
            const score = test.score || 0;
            const progressPercentage = maxScore
              ? Math.min((score / maxScore) * 100, 100)
              : 0;
            const progressColor = getColor(progressPercentage);

            return (
              <div
                key={test.id}
                className="border w-full bg-gray-50 px-4 pt-2 pb-6 rounded-md hover:bg-gray-100 transition-colors duration-200 shadow-md"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {test.testTitle || "Test Title Unavailable"} Result
                    </h2>
                    <p className="text-gray-500 text-[14px]">
                      Exam Date:{" "}
                      {test.testSubmissionTime?.seconds
                        ? new Date(
                            test.testSubmissionTime.seconds * 1000
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src="/readiness_score.svg"
                      alt=""
                      className="w-6 h-6 sm:w-8 sm:h-8"
                    />
                    <p className="text-gray-600">
                      Score: {score} / {maxScore}
                    </p>
                  </div>
                </div>

                <p className="text-sm mt-2">
                  {progressPercentage >= 75 ? (
                    <span className="text-green-600 font-semibold">
                      Excellent Performance
                    </span>
                  ) : progressPercentage >= 45 ? (
                    <span className="text-yellow-600 font-semibold">
                      Average Performance
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Low Performance
                    </span>
                  )}
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div
                    className={`h-3 rounded-full ${progressColor}`}
                    style={{
                      width: `${progressPercentage}%`,
                    }}
                  ></div>
                </div>

                {/* Test Details */}
                <div className="mt-4 flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <MdOutlineTimelapse className="text-[20px]" />
                      <p>Duration:</p>
                    </div>
                    <div>{test.duration} min</div>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <MdOutlineTimelapse className="text-[20px]" />
                      <p>Time Taken:</p>
                    </div>
                    <div>
                      {test.timeTaken !== undefined ? (
                        <>
                          {Math.floor(test.timeTaken / 60)} min{" "}
                          {test.timeTaken % 60} sec
                        </>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <HiOutlineQuestionMarkCircle className="text-[20px]" />
                      <p>Total Questions:</p>
                    </div>
                    <div>{test?.questionsCount}</div>
                  </div>
                </div>

                {/* Result Button */}
                <div className="mt-6 text-center">
                  <a href={`/user/dashboard/testcompletion/${test.id}`}>
                    <button className="bg-[#075D70] text-white px-4 py-2 rounded-lg w-full sm:w-auto">
                      Show Result
                    </button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600">No results available.</p>
      )}
    </div>
  );
}
