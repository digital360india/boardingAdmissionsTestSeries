"use client";
import React, { useState, useEffect, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserContext } from "@/providers/userProvider";
import { IoHomeOutline } from "react-icons/io5";
import Leaderboard from "@/components/frontend/scholarshiptest/Leaderboard";
import Loading from "@/app/loading";
import "../../../../globals.css";
import { FaArrowLeft } from "react-icons/fa6";
import { TestSeriesContext } from "@/providers/testSeriesProvider";

const TestComplete = () => {
  const router = useRouter();
  const path = usePathname();
  const [testData, setTestData] = useState(null);
  const [testCategory, setTestCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const { allTests } = useContext(TestSeriesContext);
  const [resultValue, setResultValue] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const docId = path.split("/")[4];

  useEffect(() => {
    const fetchResultData = async () => {
      try {
        const resultDocRef = doc(db, "results", docId);
        const resultDocSnap = await getDoc(resultDocRef);

        if (resultDocSnap.exists()) {
          const resultData = resultDocSnap.data();
          setResultValue(resultData);
          const userResult = resultData.result.find(
            (res) => res.userId === user?.id
          );

          if (userResult) {
            setTestData(userResult);
            if (userResult.id) {
              fetchCategoryData(userResult.id);
            }
          } else {
            console.error(
              "No matching result for this user in the result array."
            );
          }
        } else {
          console.error("No such document in results collection!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategoryData = async (testId) => {
      const categoryData = allTests.find((test) => test.id === testId);
      if (categoryData) {
        setTestCategory(categoryData);
        const questionIds = categoryData.test;

        if (Array.isArray(questionIds) && questionIds.length > 0) {
          try {
            const questionDataPromises = questionIds.map(async (id) => {
              try {
                const questionDocRef = doc(db, "questions", id);
                const questionDoc = await getDoc(questionDocRef);
                return questionDoc.exists()
                  ? { id, ...questionDoc.data() }
                  : null;
              } catch (error) {
                console.error(`Error fetching question with ID ${id}:`, error);
                return null;
              }
            });

            const questionData = await Promise.all(questionDataPromises);
            const validQuestions = questionData.filter((q) => q !== null);

            console.log(validQuestions);
            setQuestions(validQuestions);
          } catch (error) {
            console.error("Error fetching questions:", error);
          }
        } else {
          console.warn("No question IDs found in categoryData.test");
          setQuestions([]); // Set empty state if no IDs
        }
      }
    };

    if (allTests.length > 0) {
      fetchResultData();
    }
  }, [docId, user, allTests]);

  const handleReturnHome = () => {
    router.push("/");
  };

  const handleOnClick = () => {
    router.push("/user/dashboard/myresults");
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const userResponse = testData?.resultData.find(
    (res) => res.questionID === currentQuestion?.id
  );

  return (
    <div className="w-[90vw] lg:w-[60vw] my-4 scrollbar-hide md:pb-0 pb-20">
      <FaArrowLeft onClick={handleOnClick} />
      <p className="text-[20px] lg:text-[24px] text-background04 font-semibold flex-grow py-4">
        Thank You {testData?.name || "N/A"} !!
      </p>

      <div className="flex justify-center lg:justify-between items-center w-full lg:w-[75vw]">
        <p className="text-center text-[18px] lg:text-[22px] text-green-600 font-semibold">
          Test Completed
        </p>
      </div>

      <div className="my-5 w-full">
        {testCategory && testData && (
          <div className="space-y-3 w-full lg:w-[75vw] text-background04">
            <div className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between">
              <div className="font-semibold">
                {testCategory.testTitle || "N/A"}
              </div>
              <div>Total Marks : {testCategory.Totalmarks || "N/A"}</div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-0">
              <div>Test Duration : {testCategory.duration || "N/A"}</div>
              <div>Marks Obtained : {testData.score || "0"}</div>
            </div>
          </div>
        )}
      </div>

      <div>
        <p className="text-green-600 my-2 text-center lg:text-left">
          Thank you for completing the test. Here are your results:
        </p>

        <div className="flex flex-col xl:flex-row justify-between w-full lg:w-[75vw]">
          <div>
            {currentQuestion && (
              <div
                key={currentQuestion.id}
                className="mb-4 w-full md:w-[90vw] lg:w-[60vw] xl:w-[45vw] border border-background04 p-4 rounded-md space-y-2"
              >
                <p className="flex gap-2">
                  {`${currentQuestionIndex + 1}. `}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: currentQuestion.question,
                    }}
                  ></span>
                </p>
                {currentQuestion.answers && (
                  <ul>
                    {Object.entries(currentQuestion.answers)
                      .sort(([key1], [key2]) => key1.localeCompare(key2))
                      .map(([key, option]) => {
                        const isSelected = userResponse?.selectedAnswer === key;
                        const isCorrectOption =
                          key === currentQuestion.correctAnswer;
                        return (
                          <li
                            key={key}
                            className={`rounded-md px-2 py-2 ml-2 md:ml-4 my-2 border border-gray-500 bg-gray-100 flex items-center ${
                              isCorrectOption
                                ? "bg-green-100 text-green-700"
                                : isSelected && !isCorrectOption
                                ? "bg-red-100 text-red-700"
                                : ""
                            }`}
                          >
                            {typeof option === "string" &&
                            option.startsWith("http") ? (
                              <>
                                {key}.
                                <img
                                  src={option}
                                  alt="Answer"
                                  className="inline w-20 h-auto md:w-40"
                                />
                              </>
                            ) : (
                              <div
                                className="mr-2 flex gap-2"
                                dangerouslySetInnerHTML={{
                                  __html: `${key}. ${decodeURIComponent(
                                    option
                                  )}`,
                                }}
                              ></div>
                            )}
                            {isSelected && (
                              <span className="ml-2">
                                {isCorrectOption ? "✓" : "✗"}
                              </span>
                            )}
                          </li>
                        );
                      })}
                  </ul>
                )}

                <div className="space-y-2 pt-6 ml-2 md:ml-4">
                  <p>
                    <strong>Correct Answer:</strong>{" "}
                    {currentQuestion.correctAnswer}
                  </p>
                  {userResponse && (
                    <p>
                      <strong>Your Answer:</strong>
                      {userResponse.selectedAnswer || " "}
                    </p>
                  )}
                </div>
                <div className="ml-2 md:ml-4">
                  {typeof currentQuestion.solution === "string" &&
                  currentQuestion.solution.startsWith("http") ? (
                    <img
                      src={currentQuestion.solution}
                      alt="Solution"
                      className="inline w-20 md:w-40 h-auto"
                    />
                  ) : (
                    <div>
                      <strong>Solution: </strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: currentQuestion.solution,
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 rounded bg-background04 text-white ${
                  currentQuestionIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Previous
              </button>
              <button
                onClick={nextQuestion}
                disabled={currentQuestionIndex >= questions.length - 1}
                className={`px-4 py-2 bg-background04 text-white rounded ${
                  currentQuestionIndex >= questions.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Next
              </button>
            </div>
          </div>
          <div className="md:mt-0 mt-12">
            <Leaderboard
              resultValue={resultValue}
              testId={resultValue.id}
              className="w-full mt-6 xl:mt-0 xl:w-[20vw]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestComplete;
