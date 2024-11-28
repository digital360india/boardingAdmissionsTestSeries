import React, { useState } from "react";
import GoBackButton from "../backend/Gobackbutton";
import MakeLiveTest from "./MarkTestAsLiveTest";

const HeaderSection = ({
  questions,
  setShowForm,
  showForm,
  setEditingQuestionId,
  setNewQuestion,
  mcqQuestionModel,
  testId,
}) => {
  const [showLiveTestDialog, setShowLiveTestDialog] = useState(false);

  const handleCloseDialog = () => {
    setShowLiveTestDialog(false);
  };

  return (
    <div className="sticky top-1 bg-white w-full p-5 z-10 border border-blue-500 shadow-lg rounded-md">
      <GoBackButton />
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
      <div className="text-lg flex w-full justify-between font-semibold mt-4">
        <p className="text-xl font-semibold">Existing questions:</p>
        <p>Total Number of Questions: {questions.length}</p>
      </div>
    </div>
  );
};

export default HeaderSection;
