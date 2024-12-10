"use client";
import React, { useState, useEffect, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { db } from "@/firebase/firebase";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import QuestionNavigation from "@/components/frontend/scholarshiptest/QuestionNavigation";
import Question from "@/components/frontend/scholarshiptest/Question";
import QuestionPalatte from "@/components/frontend/scholarshiptest/QuestionPalatte";
import Statusbar from "@/components/frontend/scholarshiptest/StatusBar";
import { FaChevronRight } from "react-icons/fa";
import { Router } from "next/router";
import { UserContext } from "@/providers/userProvider";
import Loading from "@/app/loading";
import { AiFillCloseCircle } from "react-icons/ai";

const TestPage = () => {
  const { user } = useContext(UserContext);
  const [time, setTime] = useState(20 * 60);
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const router = useRouter();
  const [testQuestions, setTestQuestions] = useState([]);
  const [testDetails, setTestDetails] = useState([]);
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const docId = pathParts[3];
  const hasResult = pathParts[4];
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);

  const [statusCounts, setStatusCounts] = useState({
    answered: [],
    notAnswered: [],
    notVisited: [],
    markedForReview: [],
    answeredAndMarkedForReview: [],
  });

  useEffect(() => {
    const enterFullscreen = async () => {
      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
        } catch (err) {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message}`
          );
        }
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && document.fullscreenElement) {
        event.preventDefault();
      }
    };

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        !document.fullscreenElement
      ) {
        enterFullscreen();
      }
    };

    enterFullscreen();
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const fetchTestQuestions = async () => {
      try {
        const testDocRef = doc(db, "tests", docId);
        const testDoc = await getDoc(testDocRef);
  
        if (testDoc.exists()) {
          const testData = testDoc.data();
          console.log(testData);
  
          setTestDetails(testData);
          setTime(testData.duration ? testData.duration * 60 : 0);
  
          const questionIds = testData.test; // Array of question IDs
  console.log(questionIds);
          // Fetch question data for each ID
          const questionDataPromises = questionIds.map(async (id) => {
            const questionDocRef = doc(db, "questions", id);
            const questionDoc = await getDoc(questionDocRef);
            return questionDoc.exists() ? { id, ...questionDoc.data() } : null;
          });
  
          const questionData = await Promise.all(questionDataPromises);
          const validQuestions = questionData.filter((q) => q !== null);
  console.log(validQuestions);
          setTestQuestions(validQuestions); // Store the fetched question data
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching test questions:", error);
      }
    };
  
    fetchTestQuestions();
  }, [docId]);
  
  const [tabChange, setTabChange] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert(
          "You have navigated away from the exam! The test will now be terminated."
        );
        setTabChange(true); // Only set the state here
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (tabChange) {
      handleSubmit();
    }
  }, [tabChange]);

  useEffect(() => {
    if (time === 0 && !isSubmitting) {
      handleSubmit();
    }

    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time, isSubmitting]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return (
      <div className="flex w-full justify-between px-1 lg:px-[25px] py-4">
        <div>
          <p>{String(hours).padStart(2, "0")}</p>
          <p className="hidden md:block text-[14px] lg:text-[16px] text-background04">
            Hours
          </p>
          <p className="md:hidden text-[14px] lg:text-[16px] text-background04">
            HH
          </p>
        </div>
        <div>
          <p>{String(minutes).padStart(2, "0")}</p>
          <p className="hidden md:block text-[14px] lg:text-[16px] text-background04">
            Minutes
          </p>
          <p className="md:hidden text-[14px] lg:text-[16px] text-background04">
            MM
          </p>
        </div>
        <div>
          <p>{String(secs).padStart(2, "0")}</p>
          <p className=" hidden md:block text-[14px] lg:text-[16px] text-background04">
            Seconds
          </p>
          <p className="md:hidden text-[14px] lg:text-[16px] text-background04">
            SS
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const storedSubmissionState = localStorage.getItem("examSubmitted");
    if (storedSubmissionState) {
      setExamSubmitted(true);
    }
  }, []);

  const nextQuestion = () => {
    const currentQuestionID = testQuestions[currentQuestionIndex].id;

    if (statusCounts.notVisited.includes(currentQuestionID)) {
      setStatusCounts((prevCounts) => ({
        ...prevCounts,
        notVisited: prevCounts.notVisited.filter(
          (id) => id !== currentQuestionID
        ),
      }));
    }

    setCurrentQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, testQuestions.length - 1)
    );
  };

  const prevQuestion = () => {
    const currentQuestionID = testQuestions[currentQuestionIndex].id;

    if (statusCounts.notVisited.includes(currentQuestionID)) {
      setStatusCounts((prevCounts) => ({
        ...prevCounts,
        notVisited: prevCounts.notVisited.filter(
          (id) => id !== currentQuestionID
        ),
      }));
    }

    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleQuestionNavigation = (index) => {
    const currentQuestionID = testQuestions[index].id;
    setCurrentQuestionIndex(index);

    if (statusCounts.notVisited.includes(currentQuestionID)) {
      setStatusCounts((prevCounts) => ({
        ...prevCounts,
        notVisited: prevCounts.notVisited.filter(
          (id) => id !== currentQuestionID
        ),
      }));
    }
    if (isPopupOpen) {
      setIsPopupOpen(false);
    }
  };

  const handleOptionChange = (questionID, selectedOption) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionID]: selectedOption,
    }));

    setStatusCounts((prevCounts) => {
      const isAlreadyAnswered = prevCounts.answered.includes(questionID);
      const isMarkedForReview = prevCounts.markedForReview.includes(questionID);

      if (!isAlreadyAnswered) {
        return {
          ...prevCounts,
          answered: [...prevCounts.answered, questionID],
          notAnswered: prevCounts.notAnswered.filter((id) => id !== questionID),
          answeredAndMarkedForReview: isMarkedForReview
            ? [...prevCounts.answeredAndMarkedForReview, questionID]
            : prevCounts.answeredAndMarkedForReview,
        };
      }

      return prevCounts;
    });
  };

  const markForReview = () => {
    const currentQuestionID = testQuestions[currentQuestionIndex].id;

    setStatusCounts((prevCounts) => ({
      ...prevCounts,
      markedForReview: prevCounts.markedForReview.includes(currentQuestionID)
        ? prevCounts.markedForReview
        : [...prevCounts.markedForReview, currentQuestionID],
    }));

    nextQuestion();
  };

  const clearResponse = () => {
    const currentQuestionID = testQuestions[currentQuestionIndex].id;

    setResponses((prevResponses) => {
      const updatedResponses = { ...prevResponses };
      delete updatedResponses[currentQuestionID];
      return updatedResponses;
    });

    setStatusCounts((prevCounts) => {
      const isMarkedForReview =
        prevCounts.markedForReview.includes(currentQuestionID);

      return {
        ...prevCounts,
        answered: prevCounts.answered.filter((id) => id !== currentQuestionID),
        notAnswered: [...prevCounts.notAnswered, currentQuestionID],
        markedForReview: isMarkedForReview
          ? prevCounts.markedForReview.filter((id) => id !== currentQuestionID)
          : prevCounts.markedForReview,
        answeredAndMarkedForReview: isMarkedForReview
          ? prevCounts.answeredAndMarkedForReview.filter(
              (id) => id !== currentQuestionID
            )
          : prevCounts.answeredAndMarkedForReview,
      };
    });
  };
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    setIsLoading(true);
    const isConfirmed =
      tabChange || window.confirm("Are you sure you want to submit the test?");

    if (isConfirmed || time === 0) {
      const result = testQuestions.map((question) => ({
        questionID: question.id,
        questionText: question.question,
        selectedAnswer: responses[question.id] || "",
        correctAnswer: question.correctAnswer,
        totalMarks: Number(question.totalmarks),
        neg_marks: Number(question.neg_marks),
      }));
console.log(result);
      const totalScore = result.reduce((score, question) => {
        if (question.selectedAnswer === question.correctAnswer) {
          return score + question.totalMarks;
        } else if (question.selectedAnswer === "") {
          return score;
        } else {
          return score - question.neg_marks;
        }
      }, 0);

      const totalTime = testDetails.duration * 60;
      const timeTaken = totalTime - time;
      console.log(totalTime);
      console.log(timeTaken);
      if (hasResult == "true") {
        setPopupData({ totalScore, timeTaken });
        setShowPopup(true);
      } else {
        setIsSubmitting(true);
        setExamSubmitted(true);
        localStorage.setItem("examSubmitted", true);
        await handleFormSubmit(result, totalScore, timeTaken);
      }

      setTabChange(false);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => console.error(err));
      }
    } else {
      console.log("Submission cancelled by user.");
    }
  };
console.log(testDetails.Totalmarks)
  const handleFormSubmit = async (result, totalScore, timeTaken) => {
    try {
      const submissionTime = new Date();
      const docData = {
        displayName: user?.displayName || "",
        resultData: result || [],
        score: totalScore ?? 0,
        timeTaken: timeTaken ?? 0,
        id: docId || "",
        testSubmissionTime: submissionTime,
        userId: user?.id || "",
      };
      const docDataUser = {
        displayName: user?.displayName || "",
        score: totalScore ?? 0,
        timeTaken: timeTaken ?? 0,
        id: docId || "",
        testSubmissionTime: submissionTime,
        userId: user?.id || "",
      };
      const docRef = doc(db, "results", docId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        await updateDoc(docRef, {
          result: arrayUnion(docData),
        });
      } else {
        await setDoc(docRef, {
          id: docId,
          subjects: testDetails.subjects,
          Totalmarks: testDetails.Totalmarks,

          result: [docData],
        });
      }

      if (user?.id) {
        const userDocRef = doc(db, "users", user.id);
        await updateDoc(userDocRef, {
          myResults: arrayUnion(docDataUser),
        });
      }
      await updateTestAnalytics(docData);
      await updateUserScores(docData);
      setExamSubmitted(false);
      setIsLoading(false);
      localStorage.removeItem("examSubmitted");
      router.replace(`/user/dashboard/testcompletion/${docId}`);
    } catch (error) {
      console.error("Error saving lead data: ", error);
      alert("An error occurred while saving your data.");
    }
  };

  const updateTestAnalytics = async (docData) => {
    try {
      const testRef = doc(db, "tests", docId);
      const testSnapshot = await getDoc(testRef);
      const resultSnapshot = await getDoc(doc(db, "results", docId));
      const allResults = resultSnapshot.data().result;
      const scores = allResults.map((r) => r.score);
      const timeTakenForMaxScore = allResults
        .filter((r) => r.score === Math.max(...scores))
        .reduce((min, r) => (r.timeTaken < min ? r.timeTaken : min), Infinity);

      const maxScore = Math.max(...scores);
      const minScore = Math.min(...scores);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const testAttempted = allResults.length;

      const analyticsData = {
        maxScore,
        minScore,
        avgScore,
        minTimeTaken: timeTakenForMaxScore,
        testAttempted,
      };

      if (testSnapshot.exists()) {
        await updateDoc(testRef, {
          analytics: analyticsData,
        });
      } else {
        await setDoc(testRef, {
          analytics: analyticsData,
        });
      }
    } catch (error) {
      console.error("Error updating test analytics: ", error);
    }
  };

  const updateUserScores = async (docData) => {
    try {
      const userDocRef = doc(db, "users", user.id);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const myScores = Array.isArray(userData.myScores)
          ? userData.myScores
          : [];
        const maxScores = Array.isArray(userData.maxScores)
          ? userData.maxScores
          : [];
        const { score, timeTaken, testSubmissionTime } = docData;
        if (
          score === undefined ||
          timeTaken === undefined ||
          !testSubmissionTime
        ) {
          console.error("Incomplete score data, cannot update.");
          return;
        }

        const newScoreData = {
          testId: docId,
          score,
          timeTaken,
          submissionTime: testSubmissionTime,
        };
        const updatedMyScores = [...myScores, newScoreData];
        const existingMaxScoreIndex = maxScores.findIndex(
          (item) => item.testId === docId
        );
        if (existingMaxScoreIndex !== -1) {
          if (score > maxScores[existingMaxScoreIndex].score) {
            maxScores[existingMaxScoreIndex] = newScoreData;
          } else if (
            score === maxScores[existingMaxScoreIndex].score &&
            timeTaken < maxScores[existingMaxScoreIndex].timeTaken
          ) {
            maxScores[existingMaxScoreIndex] = newScoreData;
          }
        } else {
          maxScores.push(newScoreData);
        }
        await updateDoc(userDocRef, {
          myScores: updatedMyScores,
          maxScores: maxScores,
        });
      } else {
        console.error("User not found.");
      }
    } catch (error) {
      console.error("Error updating user scores: ", error);
    }
  };

  const currentQuestionID = testQuestions[currentQuestionIndex]?.id;
  const isOptionSelected = responses[currentQuestionID] !== undefined;
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!examSubmitted) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [examSubmitted]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (!examSubmitted) {
        if (
          !confirm("You have unsaved changes. Are you sure you want to leave?")
        ) {
          throw "Route change aborted.";
        }
      }
    };

    Router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      Router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  const submitExam = () => {
    handleSubmit();
    setExamSubmitted(true);
  };

  const handleExit = () => {
    setShowPopup(false);
    router.push("/user/dashboard/myresults");
  };

  const formatPopUpTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };
console.log(testQuestions);
  return (
    <div className="">
      {isLoading && (
        <div>
          <Loading />
        </div>
      )}
      <div className="">
        <>
          <div className="flex md:h-[100px]">
            <p className="text-[20px] md:text-[24px] bg-background04 w-[70vw] font-bold px-9 text-white py-2 md:pt-12 ">
              {testDetails.testTitle}
            </p>

            <div className="text-center bg-[#F8F8F8] w-[25vw] rounded-br-md border-2 border-background04">
              <div className="text-[14px] md:text-[22px] lg:text-[30px] font-semibold text-background04">
                {formatTime(time)}
              </div>
            </div>
          </div>

          <div className="flex my-8 relative">
            <div className="w-[90vw] lg:w-[70vw] px-9 max-h-screen flex flex-col justify-between">
              <div>
                {testQuestions.length > 0 && (
                  <>
                    <Question
                      currentQuestion={testQuestions[currentQuestionIndex]}
                      responses={responses}
                      handleOptionChange={handleOptionChange}
                    />
                  </>
                )}
              </div>

              <div className="sticky bottom-0 left-0 w-full flex flex-col-reverse md:flex-row gap-3 md:gap-0 md:justify-between bg-white  p-4 shadow-lg">
                <div className="xl:w-[30vw] flex flex-col md:flex-row justify-between gap-2">
                  <button
                    onClick={markForReview}
                    className="text-[12px] xl:text-[18px] border border-background04 text-background04 py-2 px-4 rounded-lg shadow-md "
                  >
                    Mark for review and Next
                  </button>
                  <button
                    onClick={clearResponse}
                    disabled={!isOptionSelected}
                    className={`  py-2 px-4 text-[12px] xl:text-[18px] rounded-lg shadow-md ${
                      !isOptionSelected
                        ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-1000 border border-gray-900"
                        : "border border-background04 text-background04"
                    }`}
                  >
                    Clear Response
                  </button>
                  <button
                    onClick={submitExam}
                    className="md:hidden bg-background04 text-white py-2 px-4 rounded-lg shadow-md"
                  >
                    Submit Test
                  </button>
                </div>
                <QuestionNavigation
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={testQuestions.length}
                  prevQuestion={prevQuestion}
                  nextQuestion={nextQuestion}
                />
              </div>
            </div>

            <button
              onClick={togglePopup}
              className="lg:hidden bg-background04 text-white p-3 rounded-lg absolute top-[50%] right-0"
            >
              <FaChevronRight />
            </button>

            {isPopupOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-[#F8F8F8] w-[90vw] md:w-[70vw] lg:w-[25vw] rounded-md border-2 border-background04 p-4 flex flex-col h-fit justify-between relative">
                  <button
                    onClick={togglePopup}
                    className="absolute top-2 right-2 text-xl text-black"
                  >
                    <AiFillCloseCircle />
                  </button>

                  <Statusbar statusCounts={statusCounts} />

                  <QuestionPalatte
                    handleQuestionNavigation={handleQuestionNavigation}
                    testQuestions={testQuestions}
                    responses={responses}
                    statusCounts={statusCounts}
                    setCurrentQuestionIndex={setCurrentQuestionIndex}
                  />
                  <div className="w-full text-center">
                    <button
                      onClick={submitExam}
                      className="bg-background04 text-white xl:py-3 py-1 px-2 xl:px-8 rounded-lg shadow-lg md:w-[160px] md:h-[30px] xl:h-[47px]"
                    >
                      Submit Test
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="hidden lg:flex bg-[#F8F8F8] w-[25vw] rounded-md border-2 border-background04 p-4 flex flex-col justify-between">
              <Statusbar statusCounts={statusCounts} />

              <QuestionPalatte
                handleQuestionNavigation={handleQuestionNavigation}
                testQuestions={testQuestions}
                responses={responses}
                statusCounts={statusCounts}
                setCurrentQuestionIndex={setCurrentQuestionIndex}
              />
              <div className="w-full text-center">
                <button
                  onClick={submitExam}
                  disabled={isLoading}
                  className="bg-background04  text-white xl:py-3 py-1 px-2 xl:px-8 rounded-lg shadow-lg md:w-[160px] md:h-[30px] xl:h-[47px]"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full">
            <h2 className="text-2xl font-bold mb-4">Test Results</h2>
            {user?.myResults?.some((result) => result.id === docId) ? (
              (() => {
                const userResult = user.myResults.find(
                  (result) => result.id === docId
                );
                const previousScore = userResult.score;
                const currentScore = popupData.totalScore;
                const progress =
                  ((currentScore - previousScore) / testDetails.totalMarks) *
                  100;

                return (
                  <>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-lg mb-2">
                          Previous Score:{" "}
                          <span className="font-semibold">{previousScore}</span>
                        </p>
                        <p className="text-lg mb-2">
                          Previous Time Taken:{" "}
                          <span className="font-semibold">
                            {formatPopUpTime(userResult.timeTaken)}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-lg mb-2">
                          Current Score:{" "}
                          <span className="font-semibold">{currentScore}</span>
                        </p>
                        <p className="text-lg mb-2">
                          Current Time Taken:{" "}
                          <span className="font-semibold">
                            {popupData.timeTaken
                              ? formatPopUpTime(popupData.timeTaken)
                              : "N/A"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <p className="text-lg mb-2">
                      Progress:{" "}
                      <span
                        className={`font-semibold ${
                          progress >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {progress.toFixed(2)}%
                      </span>
                    </p>
                  </>
                );
              })()
            ) : (
              <p className="text-lg mb-4 text-red-500">
                No progress data found.
              </p>
            )}
            <button
              onClick={handleExit}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Exit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;
