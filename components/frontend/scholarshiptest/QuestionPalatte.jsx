import React from "react";

export default function QuestionPalette({
  testQuestions,
  responses,
  statusCounts,
  handleQuestionNavigation,
}) {
  return (
    <div className="space-y-2">
      <p className="font-semibold text-background04">Question Palette</p>
      <div className="grid grid-cols-6 lg:grid-cols-5 xl:grid-cols-7 gap-2">
        {testQuestions.map((question, index) => {
          const currentQuestionID = question.id;
          let statusClass = "border border-background04 text-background04";

          if (statusCounts.answeredAndMarkedForReview.includes(currentQuestionID)) {
            statusClass = "bg-[#000080] text-white";
          } else if (responses[currentQuestionID]) {
            if (statusCounts.markedForReview.includes(currentQuestionID)) {
              statusClass = "bg-[#000080] text-white"; 
              if (!statusCounts.answeredAndMarkedForReview.includes(currentQuestionID)) {
                statusCounts.answeredAndMarkedForReview.push(currentQuestionID);
              }
            } else {
              statusClass = "bg-[#4BB53A] text-white"; 
            }
          } else if (statusCounts.markedForReview.includes(currentQuestionID)) {
            statusClass = "bg-[#E99202] text-white"; 
          } else if (!statusCounts.notVisited.includes(currentQuestionID) && statusCounts.notAnswered.includes(currentQuestionID)) {
            statusClass = "bg-[#CB0000] text-white";
          }


          return (
            <button
              key={index}
              className={`w-10 h-10 font-semibold flex justify-center items-center rounded-full ${statusClass}`}
              onClick={() =>  handleQuestionNavigation(index)}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
