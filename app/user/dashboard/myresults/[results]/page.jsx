"use client";

import React, { useState } from "react";
export default function Page() {
  const [showAttemptedques, setShowAttemptedques] = useState(true);

  return (
    <>
      <div className="container mx-auto p-4 shadow-lg h-full w-full">
        <div className="shadow-lg rounded-lg w-full h-[80px] items-center flex justify-around">
          <button
            onClick={() => {
              setShowAttemptedques(true);
            }}
            className={`h-full w-1/2 duration-200 ${
              showAttemptedques ? `bg-[#8f8f8f63]` : ``
            } hover:bg-[#8f8f8f63] rounded-lg`}
          >
            Attempted Question
          </button>
          <button
            onClick={() => {
              setShowAttemptedques(false);
            }}
            className={`h-full w-1/2 duration-200 ${
              showAttemptedques ? `` : `bg-[#8f8f8f63]`
            } hover:bg-[#8f8f8f63] rounded-lg`}
          >
            Unattempted Question
          </button>
        </div>
      </div>
    </>
  );
}
