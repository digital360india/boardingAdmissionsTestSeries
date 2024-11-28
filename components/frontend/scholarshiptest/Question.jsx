import React from "react";

export default function Question({
  currentQuestion,
  responses,
  handleOptionChange,
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="bg-background04  text-white xl:py-3 py-1 px-2 xl:px-8 rounded-lg shadow-lg w-fit md:h-[30px] xl:h-[47px]">
          {currentQuestion.subject}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="text-[20px] text-background04 font-semibold">
          Question {currentQuestion.sno}
        </p>
        <div>
          <p className="text-[#4BB53A] font-semibold space-x-2">
            <span>Marks:</span>
            <span className="text-background04">
              {currentQuestion.totalmarks}
            </span>
          </p>
          <p className="text-[#4BB53A] font-semibold space-x-2">
            <span>Negative Marks:</span>
            <span className="text-background04">
              {currentQuestion.neg_marks}
            </span>
          </p>
        </div>
      </div>
      <div className="space-y-8 lg:h-[60vh]">
        {currentQuestion.passageContent && (
          <p
            dangerouslySetInnerHTML={{ __html: currentQuestion.passageContent }}
            className="text-[18px]  max-h-[184px] overflow-y-scroll hidden-scrollbar"
          ></p>
        )}
        <p
          dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
          className="text-[18px]  max-h-[184px] overflow-y-scroll hidden-scrollbar"
        ></p>
        {currentQuestion.imageUrl && (
          <div className="flex items-center justify-center">
            <img
              src={currentQuestion.imageUrl}
              className="w-58 max-h-[184px] overflow-y-scroll hidden-scrollbar"
            />
          </div>
        )}
        {currentQuestion.questionType === "numerical" ? (
          <div className="mt-4">
            <input
              type="number"
              name={`question${currentQuestion.id}`}
              value={responses[currentQuestion.id] || ""}
              onChange={(e) =>
                handleOptionChange(currentQuestion.id, e.target.value)
              }
              placeholder="Enter your answer"
              className="form-input mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        ) : (
          currentQuestion.answers && (
            <ul className="space-y-4 mt-4 overflow-y-scroll hidden-scrollbar h-[350px] ">
              {Object.entries(currentQuestion.answers).map(([key, option]) => (
                <li
                  key={key}
                  className="space-x-3 rounded-md px-2 py-2 ml-2 md:ml-4 my-2 border border-gray-500 bg-gray-100 flex items-center"
                >
                  <input
                    type="radio"
                    name={`question${currentQuestion.id}`}
                    value={key}
                    checked={responses[currentQuestion.id] === key}
                    onChange={() => handleOptionChange(currentQuestion.id, key)}
                    className="form-radio h-5 w-5 text-blue-500"
                  />
                  {typeof option === "string" && option.startsWith("http") ? (
                    <img
                      src={option}
                      alt="Answer"
                      className="inline w-fit h-40"
                    />
                  ) : (
                    <label
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ __html: option }}
                    ></label>
                  )}
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
}
