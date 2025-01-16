export const EquationDisplay = ({ question }) => {
  return <p dangerouslySetInnerHTML={{ __html: question }} />;
};

export const renderQuestionContent = (question) => {
  return (
    <div className="">
      <div>
        {question.passageContent && (
          <div className="flex gap-2">{question.passageContent}</div>
        )}
      </div>
      <div className="flex">
        {" "}
        <div className=" bg-background04 px-2 py-1 rounded-md text-white font-semibold ">
          {question.subject}
        </div>
      </div>{" "}
      <div className="flex justify-between items-center">
        <div className="text-lg flex justify-between w-full gap-4  ">
          <div className="flex gap-1 justify-start items-start ">
            <span className="">Question </span>{" "}
            <span className="">{question.sno}</span>{" "}
            <span className="">: </span>{" "}
            <span className="flex">
              {" "}
              <EquationDisplay question={question.question} />
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center ">
        {" "}
        {question.imageUrl ? (
          <img src={question.imageUrl} className="h-40  " alt="Question" />
        ) : (
          <></>
        )}
      </div>
      <div className="text-gray-700 space-y-2">
        {(() => {
          switch (question.questionType) {
            case "passage":
              return (
                <>
                  <p>
                    <strong>Passage:</strong> {question.question}
                  </p>
                  {question.answers && (
                    <>
                      <ul className="list-disc pl-5">
                        <li>
                          <strong>A:</strong> {question.answers.a}
                        </li>
                        <li>
                          <strong>B:</strong> {question.answers.b}
                        </li>
                        <li>
                          <strong>C:</strong> {question.answers.c}
                        </li>
                        <li>
                          <strong>D:</strong> {question.answers.d}
                        </li>
                      </ul>
                      <p>
                        <strong>Correct Answer:</strong>{" "}
                        {question.correctAnswer}
                      </p>
                    </>
                  )}
                </>
              );
            case "numerical":
              return (
                <>
                  <p>
                    <strong>Correct Answer:</strong> {question.correctAnswer}
                  </p>
                </>
              );

            case "mcq":
              return (
                <>
                  <ul className="list-disc pl-5">
                    <li>
                      <span className="flex">
                        {" "}
                        <strong>A : </strong>
                        {typeof question.answers.a === "string" &&
                        question.answers.a.startsWith("http") ? (
                          <img
                            src={question.answers.a}
                            alt="Answer A"
                            className="inline  h-auto"
                          />
                        ) : (
                          <EquationDisplay question={question.answers.a} />
                        )}
                      </span>
                    </li>
                    <li>
                      <span className="flex">
                        {" "}
                        <strong>B :</strong>{" "}
                        {typeof question.answers.b === "string" &&
                        question.answers.b.startsWith("http") ? (
                          <img
                            src={question.answers.b}
                            alt="Answer B"
                            className="inline h-auto"
                          />
                        ) : (
                          <EquationDisplay question={question.answers.b} />
                        )}
                      </span>
                    </li>
                    <li>
                      <span className="flex">
                        {" "}
                        <strong>C :</strong>{" "}
                        {typeof question.answers.c === "string" &&
                        question.answers.c.startsWith("http") ? (
                          <img
                            src={question.answers.c}
                            alt="Answer C"
                            className="inline h-auto"
                          />
                        ) : (
                          <EquationDisplay question={question.answers.c} />
                        )}
                      </span>
                    </li>
                    <li>
                      <span className="flex">
                        <strong>D :</strong>{" "}
                        {typeof question.answers.d === "string" &&
                        question.answers.d.startsWith("http") ? (
                          <img
                            src={question.answers.d}
                            alt="Answer D"
                            className="inline h-auto"
                          />
                        ) : (
                          <EquationDisplay question={question.answers.d} />
                        )}
                      </span>
                    </li>
                  </ul>
                  <p>
                    <strong>Correct Answer:</strong> {question.correctAnswer}
                  </p>
                </>
              );
            default:
              return null;
          }
        })()}
      </div>
      <div className=" mt-4 flex flex-col gap-1">
        {" "}
        <p className="font-semibold text-blue-400">
          Postive Marks: {question.totalmarks}
        </p>
        <p className="font-semibold text-red-400">
          Negative Marks: {question.neg_marks ? question.neg_marks : 0}
        </p>
      </div>
    </div>
  );
};
