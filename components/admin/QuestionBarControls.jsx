"use client";
import React, { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import GoBackButton from "../backend/Gobackbutton";

const QuestionBarControls = ({
  setShowForm,
  setEditingQuestionId,
  setNewQuestion,
  showForm,
  mcqQuestionModel,
  questions,
  test,
  selectedInstituteId,
  instituteData,
  user,
}) => {
  const [showPaperCheck, setShowPaperCheck] = useState(false);
  const [showLiveTestForm, setShowLiveTestForm] = useState(false);
  const [liveTestDetails, setLiveTestDetails] = useState({
    startTime: "",
    endTime: "",
  });
  const [confirmPrompt, setConfirmPrompt] = useState(false);

  const handleLiveTestSubmit = async () => {
    try {
      const liveTestRef = collection(
        db,
        "instituteDatabase",
        selectedInstituteId,
        "liveTest"
      );
      const liveTestQuery = query(liveTestRef, where("testId", "==", test.id));
      const querySnapshot = await getDocs(liveTestQuery);
      const count = querySnapshot.length;
      if (count > instituteData.maxLiveTestCount) {
        alert("Upgrage or add more live test via addons")
        return;
      }
      if (!querySnapshot.empty) {
        alert(
          "This test is already live and cannot be created as a live test again."
        );
        return;
      }
      await addDoc(liveTestRef, {
        testId: test.id,
        startTime: Timestamp.fromDate(new Date(liveTestDetails.startTime)),
        endTime: Timestamp.fromDate(new Date(liveTestDetails.endTime)),
        createdAt: Timestamp.now(),
        createdBy: user.id,
      });

      alert("Live test successfully created!");
      setShowLiveTestForm(false);
      setConfirmPrompt(false);
      setLiveTestDetails({ startTime: "", endTime: "" });
    } catch (error) {
      console.error("Error creating live test:", error);
      alert("Failed to create live test. Please try again.");
    }
  };

  const totalMarks = questions?.reduce(
    (acc, question) => acc + parseFloat(question.totalmarks || 0),
    0
  );

  const questionsBySubject = questions?.reduce((acc, question) => {
    const subject = question.subject || "Uncategorized";
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(question);
    return acc;
  }, {});

  return (
    <div>
      <div className="sticky top-1 bg-white w-full p-5 z-10 border border-blue shadow-lg rounded-md ">
        <GoBackButton />
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingQuestionId(null);
              setNewQuestion({ questionType: "mcq", ...mcqQuestionModel });
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add New Question
          </button>

        </div>
        <div className="text-lg flex w-full justify-between font-semibold mt-4">
          <p className="text-xl font-semibold">Existing questions:</p>
          <p>Total Number of Questions: {questions?.length || 0}</p>
        </div>
      </div>

      {showPaperCheck && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 ">
          {/* Modal */}
          <div
            className={`bg-white max-w-lg w-full rounded-lg p-6 shadow-lg transform transition duration-300 scale-100 opacity-100 border-2 border-blue shadow-gray`}
          >
            <button
              className="absolute top-2 right-2  hover:text-gray text-red-400"
              onClick={() => setShowPaperCheck(false)}
            >
              ✖️
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue">
              BoardingAdmissions Paper Checker
            </h2>
            <hr className="my-2 text-blue  " />
            <p className="mb-2">
              <span>Total Marks Mentioned in Test:</span> {test.totalMarks}
            </p>
            <p className="mb-2">
              <span>Total Marks Allotted to Questions:</span> {totalMarks}
            </p>
            <p
              className={`mb-4 font-semibold ${
                totalMarks === parseFloat(test.totalMarks)
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {totalMarks === parseFloat(test.totalMarks)
                ? "✔️ Total marks match the paper requirement!"
                : "❌ Total marks do not match the paper requirement!"}
            </p>

            <h3 className="text-lg font-semibold mb-2">
              Questions by Subject:
            </h3>
            <ul className="list-disc pl-5 mb-4">
              {Object.entries(questionsBySubject).map(
                ([subject, subjectQuestions]) => (
                  <li key={subject} className="mb-2">
                    <span>{subject}:</span> {subjectQuestions.length} questions,{" "}
                    {subjectQuestions.reduce(
                      (acc, question) =>
                        acc + parseFloat(question.totalmarks || 0),
                      0
                    )}{" "}
                    marks
                  </li>
                )
              )}
            </ul>

            <h3 className="text-lg font-semibold mb-2">Analytics:</h3>
            <ul className="list-disc pl-5">
              <li>
                <span>Tests Attempted:</span>{" "}
                {test.analytics?.testAttempted || 0}
              </li>
              <li>
                <span>Maximum Score:</span> {test.analytics?.maxScore || 0}
              </li>
              <li>
                <span>Average Score:</span> {test.analytics?.avgScore || 0}
              </li>
              <li>
                <span>Minimum Score:</span> {test.analytics?.minScore || 0}
              </li>
              <li>
                <span>Minimum Time Taken:</span>{" "}
                {test.analytics?.minTimeTaken || 0} minutes
              </li>
            </ul>
          </div>
        </div>
      )}
      {showLiveTestForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white max-w-lg w-full rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center">
              {" "}
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Schedule Live Test
              </h2>{" "}
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowLiveTestForm(false)}
              >
                ✖️
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setConfirmPrompt(true);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded"
                  value={liveTestDetails.startTime}
                  onChange={(e) =>
                    setLiveTestDetails((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  End Time (Max 1 Day from Start Time)
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded"
                  value={liveTestDetails.endTime}
                  onChange={(e) =>
                    setLiveTestDetails((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Schedule
              </button>
            </form>
          </div>
        </div>
      )}
      {confirmPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white max-w-sm w-full rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              Confirm Live Test
            </h2>
            <p className="mb-4">Are you sure you want to schedule this test?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmPrompt(false)}
                className="px-4 py-2 bg-gray-500 text-black rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleLiveTestSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBarControls;
