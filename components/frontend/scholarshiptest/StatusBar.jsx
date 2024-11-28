import React from "react";

const StatusItem = ({ label, count, color, border, width }) => (
  <div className={`${width ? "" : "w-[100%]"} flex gap-4 items-center`}>
    <p
      className={`${
        border ? "border border-background04 text-background04" : "text-white"
      } w-8 h-8 flex justify-center items-center rounded-full font-semibold`}
      style={{ backgroundColor: border ? undefined : color }}
    >
      {count}
    </p>
    <p className="text-background04 font-semibold">{label}</p>
  </div>
);

export default function Statusbar({ statusCounts }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col xl:flex-row justify-between space-y-4 xl:space-y-0 ">
        <StatusItem
          label="Answered"
          count={statusCounts.answered.length}
          color="#4BB53A"
        />
        <StatusItem
          label="Not Answered"
          count={statusCounts.notAnswered.length}
          color="#CB0000"
        />
      </div>
      <div className="flex flex-col xl:flex-row justify-between space-y-4 xl:space-y-0 ">
        <StatusItem
          label="Not Visited"
          count={statusCounts.notVisited.length}
          border
        />
        <StatusItem
          label="Mark for Review"
          count={statusCounts.markedForReview.length}
          color="#E99202"
        />
      </div>
      <div className="hidden md:flex lg:hidden flex-col xl:flex-row justify-between space-y-4 xl:space-y-0 ">
        <StatusItem
          label="Answered & MFR"
          count={statusCounts.answeredAndMarkedForReview.length}
          color="#000080"
          width
        />
      </div>
      <div className="flex lg:block md:hidden  flex-col xl:flex-row justify-between space-y-4 xl:space-y-0 ">
        <StatusItem
          label="Answered And Marked For Review"
          count={statusCounts.answeredAndMarkedForReview.length}
          color="#000080"
          width
        />
      </div>
    </div>
  );
}
