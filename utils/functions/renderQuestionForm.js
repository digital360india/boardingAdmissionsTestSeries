export const renderQuestionForm = ({
  handleInputChange,
  handleImageUpload,
  handleOptionChange,
  loading,
  questionContent,
  uploading,
}) => {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-4 w-fit  ">
        <span className="text-gray-700 w-fit">Serial Number</span>
        <input
          type="text"
          name="sno"
          value={newQuestion.sno}
          onChange={handleInputChange}
          className=" block w-fit border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </label>

      {/* <label className="flex items-center gap-4 w-fit">
          <span className="text-gray-700">Use Existing Question</span>
          <select
            name="existingQuestion"
            onChange={(e) => {
              const selectedQuestion = questions.find(
                (question) => question.id === e.target.value
              );
              if (selectedQuestion) {
                setNewQuestion({ ...selectedQuestion });
                setEditMode(true);
              }
            }}
            className="w-[350px] border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Existing Question</option>

            {allQuestions
              .filter(
                (question) => question.questionType === newQuestion.questionType
              )
              .map((filteredQuestion) => (
                <option key={filteredQuestion.id} value={filteredQuestion.id}>
                  {filteredQuestion.sno}.{" "}
                  <EquationDisplay question={filteredQuestion.question} />
                </option>
              ))}
          </select>
        </label> */}

      {(() => {
        switch (newQuestion.questionType) {
          case "essay":
            return (
              <div className="space-y-4">
                <label className="block mb-4">
                  <span className="text-gray-700">Heading</span>
                  <input
                    type="text"
                    name="heading"
                    value={newQuestion.heading}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>

                <label className="block mb-4">
                  <span className="text-gray-700">Essay</span>
                  <textarea
                    type="text"
                    name="passageContent"
                    value={newQuestion.passageContent}
                    onChange={handleInputChange}
                    rows="4"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Question</span>
                  <input
                    type="text"
                    name="question"
                    value={newQuestion.question}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>

                <label className="block mb-4">
                  <span className="text-gray-700">Answers</span>
                  <div className="space-y-2">
                    {["a", "b", "c", "d"].map((option) => (
                      <label key={option} className="block mb-2">
                        <span className="text-gray-700">
                          Answer {option.toUpperCase()}
                        </span>
                        <input
                          type="text"
                          name={option}
                          value={newQuestion.answers?.[option] || ""}
                          onChange={handleOptionChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </label>
                    ))}
                  </div>
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Correct Answer</span>
                  <input
                    type="text"
                    name="correctAnswer"
                    value={newQuestion.correctAnswer}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Weightage</span>
                  <input
                    type="text"
                    name="totalmarks"
                    value={newQuestion.totalmarks}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
              </div>
            );

          case "imageNumerical":
            return (
              <div className="space-y-4">
                <label className="block mb-4">
                  <span className="text-gray-700">Heading</span>
                  <input
                    type="text"
                    name="heading"
                    value={newQuestion.heading}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>

                {/* Question */}
                <label className="block mb-4">
                  <span className="text-gray-700">Question</span>
                  <input
                    type="text"
                    name="question"
                    value={newQuestion.question}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>

                {/* Image Upload */}
                <label className="block mb-4">
                  <span className="text-gray-700">Upload Image</span>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="mt-1 block w-full text-gray-500"
                  />
                  {uploading ? (
                    <div className="text-blue-500 mt-2">Uploading...</div>
                  ) : (
                    imagePreview && (
                      <div className="mt-4">
                        <h3 className="text-gray-700">
                          Uploaded Image Preview:
                        </h3>
                        <img
                          src={imagePreview}
                          alt="Uploaded"
                          className="w-40 h-auto"
                        />
                      </div>
                    )
                  )}
                </label>

                {/* Correct Anwer */}
                <label className="block mb-4">
                  <span className="text-gray-700">Correct Answer</span>
                  <input
                    type="text"
                    name="correctAnswer"
                    value={newQuestion.correctAnswer}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Weightage (Total Marks)</span>
                  <input
                    type="text"
                    name="totalmarks"
                    value={newQuestion.totalmarks}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
              </div>
            );

          case "numerical":
            return (
              <div className="space-y-4">
                <label className="block mb-4">
                  <span className="text-gray-700">Heading</span>
                  <input
                    type="text"
                    name="heading"
                    value={newQuestion.heading}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Question</span>
                  <textarea
                    name="question"
                    value={newQuestion.question}
                    onChange={handleInputChange}
                    rows="4"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Correct Answer</span>
                  <input
                    type="text"
                    name="correctAnswer"
                    value={newQuestion.correctAnswer}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Weightage</span>
                  <input
                    type="text"
                    name="totalmarks"
                    value={newQuestion.totalmarks}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
              </div>
            );
          case "passage":
            return (
              <div className="space-y-4">
                <label className="block mb-4">
                  <span className="text-gray-700">Heading</span>
                  <input
                    type="text"
                    name="heading"
                    value={newQuestion.heading}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Passage</span>
                  <textarea
                    name="passageContent"
                    value={newQuestion.passageContent}
                    onChange={handleInputChange}
                    rows="4"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Question</span>
                  <input
                    type="text"
                    name="question"
                    value={newQuestion.question}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Answers</span>
                  <div className="space-y-2">
                    {["a", "b", "c", "d"].map((option) => (
                      <label key={option} className="block mb-2">
                        <span className="text-gray-700">
                          Answer {option.toUpperCase()}
                        </span>
                        <input
                          type="text"
                          name={option}
                          value={newQuestion.answers?.[option] || ""}
                          onChange={handleOptionChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </label>
                    ))}
                  </div>
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Correct Answer</span>
                  <input
                    type="text"
                    name="correctAnswer"
                    value={newQuestion.correctAnswer}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Weightage</span>
                  <input
                    type="text"
                    name="totalmarks"
                    value={newQuestion.totalmarks}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
              </div>
            );
          case "mcq":
            return (
              <div className="space-y-4">
                <div className="w-[50vw]">
                  <QuillEditor
                    onContentChange={(content) => {
                      setQuestionContent(content);
                    }}
                  />

                  <div className="mt-4">
                    <h3 className="text-gray-700">Stored Question Preview:</h3>
                    <div className="border border-gray-300 rounded-md p-2">
                      {questionContent}
                    </div>
                  </div>
                </div>
                <label className="block mb-4">
                  <span className="text-gray-700">Question</span>
                  <input
                    type="text"
                    name="question"
                    value={newQuestion.question}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Answers</span>
                  <div className="space-y-2">
                    {["a", "b", "c", "d"].map((option) => (
                      <label key={option} className="block mb-2">
                        <span className="text-gray-700">
                          Answer {option.toUpperCase()}
                        </span>
                        <input
                          type="text"
                          name={option}
                          value={newQuestion.answers?.[option] || ""}
                          onChange={handleOptionChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </label>
                    ))}
                  </div>
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Correct Answer</span>
                  <input
                    type="text"
                    name="correctAnswer"
                    value={newQuestion.correctAnswer}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Weightage</span>
                  <input
                    type="text"
                    name="totalmarks"
                    value={newQuestion.totalmarks}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
              </div>
            );
          case "fill-in-the-blank":
            return (
              <div className="space-y-4">
                <label className="block mb-4">
                  <span className="text-gray-700">Question</span>
                  <input
                    type="text"
                    name="question"
                    value={newQuestion.question}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Correct Option</span>
                  <input
                    type="text"
                    name="correctAnswer"
                    value={newQuestion.correctAnswer}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
              </div>
            );
          case "imageGuess":
            return (
              <div className="space-y-4">
                <label className="block mb-4">
                  <span className="text-gray-700">Image URL</span>
                  <input
                    type="text"
                    name="imageUrl"
                    value={newQuestion.imageUrl}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Question</span>
                  <input
                    type="text"
                    name="question"
                    value={newQuestion.question}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Answers</span>
                  <div className="space-y-2">
                    {["a", "b", "c", "d"].map((option) => (
                      <input
                        key={option}
                        type="text"
                        name={option}
                        value={newQuestion.answers?.[option] || ""}
                        onChange={handleOptionChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder={`Answer ${option.toUpperCase()}`}
                      />
                    ))}
                  </div>
                </label>
                <label className="block mb-4">
                  <span className="text-gray-700">Correct Answer</span>
                  <input
                    type="text"
                    name="correctAnswer"
                    value={newQuestion.correctAnswer}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </label>
              </div>
            );
          default:
            return null;
        }
      })()}

      <button
        type="submit"
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        disabled={loading}
      >
        {editMode ? "Update Question" : "Add Question"}
      </button>
    </div>
  );
};
