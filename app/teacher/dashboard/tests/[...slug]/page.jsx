"use client";
import { useState, useEffect, useContext } from "react";
import { db, storage } from "@/firebase/firebase";
import { addDoc, doc, getDoc, updateDoc, collection } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { mcqQuestionModel } from "@/models/QuestionModel";
import { RxCrossCircled } from "react-icons/rx";
import { deleteDoc } from "firebase/firestore";

import "./global.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getQuestionModel } from "@/utils/functions/getQuestionsModel";
import { UserContext } from "@/providers/userProvider";
import { serverTimestamp } from "firebase/firestore"; // Import serverTimestamp
import { renderQuestionContent } from "@/utils/functions/renderQuestionContent";
import { FiDelete, FiEdit } from "react-icons/fi";
import GoBackButton from "@/components/backend/Gobackbutton";
import Lottie from "lottie-react";
import loadingAnimation1 from "@/public/lottie/lottiehello.json";
import loadingAnimation2 from "@/public/lottie/lottieman.json";
import showError from "@/utils/functions/showError";
import { toast } from "react-toastify";
import { QuillEditor } from "@/components/admin/QuillEditor";
const AddQuestionsPage = () => {
  const [test, setTest] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    questionType: "mcq",
    ...mcqQuestionModel,
  });
  const [showForm, setShowForm] = useState(false);
  const currentPage = usePathname();
  const pathArray = currentPage.split("/");
  const testId = pathArray[pathArray.length - 1];
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionContent, setQuestionContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [imagePreviews, setImagePreviews] = useState({});
  const [solutionType, setSolutionType] = useState("text");
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchTest();
  }, []);
  const fetchTest = async () => {
    try {
      const docRef = doc(db, "tests", testId);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTest(docSnap.data());
          setQuestions(docSnap.data().questions || []);
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.error("Error fetching all questions:", err);
        showError(err.message);
      }
    } catch (err) {
      console.error("Error fetching test:", err);
      showError(err.message);
    }
  };
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      setQuestionContent("");
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "neg_marks" ? Math.abs(value) : value;
    setNewQuestion((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };
  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prevState) => ({
      ...prevState,
      answers: {
        ...prevState.answers,
        [name]: value,
      },
    }));
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      e.target.value = "";

      alert("No file selected");
      return;
    }

    if (file.size > 102400) {
      e.target.value = "";

      alert("File size should be less than or equal to 100KB");
      return;
    }

    try {
      setUploading(true);
      const imageRef = ref(storage, `images/${file.name}`);

      await uploadBytes(imageRef, file).then(async (snapshot) => {
        const fileUrl = await getDownloadURL(imageRef);
        setImagePreview(fileUrl);

        setNewQuestion((prev) => ({
          ...prev,
          imageUrl: fileUrl,
        }));
      });

      setUploading(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      showError(error.message);
      toast.error("Error uploading image. Please try again.");
      setUploading(false); // Reset loading state if there is an error
    }
  };

  const handleAnswerImageUpload = async (e, option) => {
    const file = e.target.files[0];

    if (!file) {
      alert("No file selected");
      e.target.value = "";

      return;
    }

    if (file.size > 102400) {
      alert("File size should be less than or equal to 100KB");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);
      const imageRef = ref(storage, `images/${file.name}`);

      await uploadBytes(imageRef, file).then(async (snapshot) => {
        const fileUrl = await getDownloadURL(imageRef);

        setNewQuestion((prev) => ({
          ...prev,
          answers: {
            ...prev.answers,
            [option]: fileUrl,
          },
        }));

        setImagePreviews((prev) => ({
          ...prev,
          [option]: fileUrl,
        }));
      });

      setUploading(false);
    } catch (error) {
      console.error("Error uploading answer image:", error);
      showError(error.message);
      toast.error("Error uploading answer image. Please try again.");
      setUploading(false); // Reset loading state if there is an error
    }
  };

  const handleDelete = async (questionId) => {
    try {
      const testRef = doc(db, "tests", testId);
      const currentQuestions = test.questions;
      const updatedQuestions = currentQuestions.filter(
        (q) => q.id !== questionId
      );
      await updateDoc(testRef, {
        questions: updatedQuestions,
      });
      await deleteDoc(doc(db, "questions", questionId));
      setTest({ ...test, questions: updatedQuestions });
      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q.id !== questionId)
      );
      fetchTest();
    } catch (err) {
      console.error("Error deleting question:", err);
      showError(err.message);
      toast.error("Failed to delete question.");
    }
  };
  const handleSolutionTypeChange = (e) => {
    setSolutionType(e.target.value);
    setNewQuestion((prev) => ({
      ...prev,
      solution: "",
    }));
    setImagePreview(null);
  };

  const deleteSolution = async (index) => {
    try {
      const solutionToDelete = newQuestion.solutions[index];
      if (solutionToDelete.startsWith("http")) {
        const filenameWithEncodedChars = solutionToDelete
          .split("/")
          .pop()
          .split("?")[0];
        const filename = decodeURIComponent(filenameWithEncodedChars);
        const imageRef = ref(storage, `${filename}`);
        console.log(`Deleted image: ${imageRef}`);
      }
      const updatedSolutions = newQuestion.solutions.filter(
        (_, i) => i !== index
      );
      setNewQuestion((prev) => ({
        ...prev,
        solutions: updatedSolutions,
      }));
      if (editingQuestionId) {
        const questionRef = doc(db, "questions", editingQuestionId);
        await updateDoc(questionRef, {
          solutions: updatedSolutions,
        });
        const testRef = doc(db, "tests", testId);
        const updatedTestQuestions = newQuestion.solutions.filter(
          (_, i) => i !== index
        );
        await updateDoc(testRef, {
          questions: updatedTestQuestions,
        });
      }
    } catch (error) {
      console.error("Error deleting solution:", error);
      showError(error.message);
    }
  };

  const renderQuestionForm = () => {
    return (
      <div className="space-y-3">
        <div className="flex justify-start items-center gap-10">
          <label className="flex items-center gap-4 w-fit  ">
            <span className="text-gray-700 w-fit">Serial Number</span>
            <input
              type="text"
              name="sno"
              value={newQuestion.sno}
              onChange={handleInputChange}
              className=" block w-fit bg-gray-200 border-gray-800 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Select Subject</span>
            <select
              name="subject"
              value={newQuestion.subject || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-slate-100 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Choose a Subject</option>
              {test.subjects.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className=" ">
          <div className="text-gray-700 w-fit">
            Add Formula and Paste on Questions
          </div>
          <QuillEditor
            onContentChange={(content) => {
              setQuestionContent(content);
            }}
          />

          <div className="mt-4">
            <h3 className="text-gray-700">Stored Question Preview:</h3>
            <div className="border border-gray-300 rounded-md p-2 py-4">
              {questionContent}
            </div>
          </div>
        </div>
        {(() => {
          switch (newQuestion.questionType) {
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
                      className="mt-1 block w-full bg-slate-100 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-700">Question</span>
                    <textarea
                      name="question"
                      value={newQuestion.question}
                      onChange={handleInputChange}
                      rows="4"
                      className=" min-h-28   mt-1 block w-full bg-slate-100 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-700">
                      Upload Any Question Image
                    </span>
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

                  <label className="block mb-4">
                    <span className="text-gray-700">Correct Answer</span>
                    <input
                      type="text"
                      name="correctAnswer"
                      value={newQuestion.correctAnswer}
                      onChange={handleInputChange}
                      className="mt-1 block w-full bg-slate-100 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-700">Positive Marks</span>
                    <input
                      type="text"
                      name="totalmarks"
                      placeholder="Enter marks alloted as 1, 2 etc"
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
                      className="mt-1 bg-slate-100 border block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-700">Passage</span>
                    <textarea
                      name="passageContent"
                      value={newQuestion.passageContent}
                      onChange={handleInputChange}
                      rows="4"
                      className="min-h-28 bg-slate-100 border  mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-700">Question</span>
                    <input
                      type="text"
                      name="question"
                      value={newQuestion.question}
                      onChange={handleInputChange}
                      className="min-h-28 mt-1  bg-slate-100 border block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                            className="mt-1 block w-full bg-slate-100 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  <label className="block mb-4">
                    <span className="text-gray-700">Question</span>
                    <input
                      type="text"
                      name="question"
                      rows="4"
                      value={newQuestion.question}
                      onChange={handleInputChange}
                      className="min-h-20 mt-1 block w-full border-gray-300 bg-gray-100 border-2 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-700">
                      Upload Any Question Image
                    </span>
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

                  {/* Answers Section */}
                  <label className="block mb-4">
                    <span className="text-gray-700">Answers</span>
                    <div className="space-y-2">
                      {["a", "b", "c", "d"].map((option) => (
                        <div key={option} className="block mb-4">
                          <span className="text-gray-700">
                            Answer : {option.toUpperCase()}
                          </span>
                          <div className="flex items-center space-x-4 mt-2">
                            <input
                              type="text"
                              name={option}
                              placeholder="Enter answer text or upload image"
                              value={newQuestion.answers?.[option] || ""}
                              onChange={(e) => handleOptionChange(e, option)}
                              className="bg-gray-100 border mt-1 block w-2/3 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <input
                              type="file"
                              onChange={(e) =>
                                handleAnswerImageUpload(e, option)
                              }
                              className="mt-1 block w-1/3 text-gray-500"
                            />
                          </div>
                          {imagePreviews[option] && (
                            <div className="mt-2">
                              <img
                                src={imagePreviews[option]}
                                alt={`Answer ${option} preview`}
                                className="w-20 h-auto"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </label>

                  <label className="block mb-4">
                    <span className="text-gray-700">Correct Answer</span>
                    <select
                      name="correctAnswer"
                      value={newQuestion.correctAnswer}
                      onChange={handleInputChange}
                      className="mt-1 block w-full  border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Select Correct Answer</option>
                      <option value="a">a</option>
                      <option value="b">b</option>
                      <option value="c">c</option>
                      <option value="d">d </option>
                    </select>
                  </label>

                  <label className="block mb-4">
                    <span className="text-gray-700">Positive Marks</span>
                    <input
                      type="text"
                      name="totalmarks"
                      value={newQuestion.totalmarks}
                      onChange={handleInputChange}
                      placeholder="Please write the positive marks student can score"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="block mb-4">
                    <span className="text-gray-700">Negative Marks</span>
                    <input
                      type="text"
                      name="neg_marks"
                      value={newQuestion.neg_marks}
                      onChange={handleInputChange}
                      placeholder="Please write for -1 as 1, -2 as 2 etc, We will take care of the negative signs"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </label>
                </div>
              );
            default:
              return null;
          }
        })()}
        <div>
          {/* Solution Type Selection */}
          <div className="mb-4">
            <label>
              <input
                type="radio"
                name="solutionType"
                value="text"
                checked={solutionType === "text"}
                onChange={handleSolutionTypeChange}
                className="mr-2"
              />
              Text Solution
            </label>
            <label className="ml-4">
              <input
                type="radio"
                name="solutionType"
                value="image"
                checked={solutionType === "image"}
                onChange={handleSolutionTypeChange}
                className="mr-2"
              />
              Image Solution
            </label>
          </div>

          {/* Conditionally Render Solution Input */}
          {solutionType === "text" ? (
            <label className="block mb-4">
              <span className="text-gray-700">Solution (Text)</span>
              <input
                type="text"
                name="solution"
                placeholder="Enter solution text"
                value={newQuestion.solution}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, solution: e.target.value })
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={addSolution}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Add Text Solution
              </button>
            </label>
          ) : (
            <label className="block mb-4">
              <span className="text-gray-700">Solution (Image)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleSolutionImageUpload}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {uploading && <p>Uploading...</p>}
              {imagePreview && (
                <div className="mt-4">
                  <img src={imagePreview} alt="Preview" className="w-40 h-40" />
                </div>
              )}
              <button
                type="button"
                onClick={addSolution}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Add Image Solution
              </button>
            </label>
          )}

          {/* Display All Solutions */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">All Solutions:</h3>
            <ul>
              {newQuestion.solutions &&
                newQuestion.solutions.map((solution, index) => (
                  <li
                    key={index}
                    className="mb-2 flex justify-between items-center"
                  >
                    {typeof solution === "string" &&
                    solution.startsWith("http") ? (
                      <img
                        src={solution}
                        alt={`Solution ${index}`}
                        className="w-24 h-auto"
                      />
                    ) : (
                      <p>{solution}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteSolution(index)}
                      className="ml-4 text-red-500"
                    >
                      Delete
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {"Add Question"}
        </button>
      </div>
    );
  };
  const handleEdit = (questionId) => {
    const questionToEdit = test.questions.find((q) => q.id === questionId);

    if (questionToEdit) {
      setNewQuestion(questionToEdit);
      setEditingQuestionId(questionId);
      setShowForm(true);
    } else {
      console.error("Question not found.");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !newQuestion.sno ||
      !newQuestion.question ||
      !newQuestion.subject ||
      !newQuestion.totalmarks
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!test) {
      console.error("Test data is not loaded.");
      return;
    }

    try {
      setLoading(true);
      if (editingQuestionId) {
        const questionRef = doc(db, "questions", editingQuestionId);
        await updateDoc(questionRef, {
          ...newQuestion,
          updatedAt: serverTimestamp(),
          updatedBy: user.id,
        });
        const updatedQuestions = test.questions.map((q) =>
          q.id === editingQuestionId ? { ...q, ...newQuestion } : q
        );
        const testRef = doc(db, "tests", testId);
        await updateDoc(testRef, { questions: updatedQuestions });
        setEditingQuestionId(null);
        setImagePreview("");
        setImagePreviews("");
      } else {
        const questionData = {
          ...newQuestion,
          createdBy: user.id,
          createdAt: serverTimestamp(),
        };
        const questionRef = await addDoc(
          collection(db, "questions"),
          questionData
        );

        const questionDoc = await getDoc(questionRef);
        const questionWithId = { id: questionDoc.id, ...questionDoc.data() };
        await updateDoc(questionRef, { id: questionDoc.id });
        const testRef = doc(db, "tests", testId);
        const updatedQuestions = [...(test.questions || []), questionWithId];
        await updateDoc(testRef, { questions: updatedQuestions });
        setImagePreview("");
        setImagePreviews("");
      }
      setNewQuestion({ questionType: "mcq", ...mcqQuestionModel });
      setShowForm(false);
      setImagePreview("");

      fetchTest();
    } catch (err) {
      console.error("Error adding/updating question:", err);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSolutionImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 100 * 1024) {
      setUploading(true);
      const imageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(imageRef, file).then(async () => {
        const fileUrl = await getDownloadURL(imageRef);
        setImagePreview(fileUrl);
        setNewQuestion((prev) => ({
          ...prev,
          solution: fileUrl,
        }));
      });
      setUploading(false);
    }
  };

  const addSolution = () => {
    setNewQuestion((prev) => ({
      ...prev,
      solutions: [...prev.solutions, prev.solution], // Add new solution to the array
      solution: "", // Reset the current solution input
    }));
    setImagePreview(null); // Reset image preview after adding solution
  };

  return (
    <div className="">
      <div className="sticky top-1 bg-white  w-full p-5 z-10 border border-blue-500 shadow-lg rounded-md  ">
        {" "}
        <GoBackButton />
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingQuestionId(null); // Reset editing state for new questions
            setNewQuestion({ questionType: "mcq", ...mcqQuestionModel }); // Reset form data
          }}
          className=" px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          {"Add New Question"}
        </button>
        <div className="text-lg flex w-full justify-between font-semibold  mt-4">
          <p className="text-xl font-semibold">Existing questions: </p>
          <p>Total Number of Questions: {questions.length}</p>
        </div>
      </div>
      {showForm && (
        <>
          <div className=" fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" />

          <form
            onSubmit={handleSubmit}
            className="space-y-4 fixed overflow-y-auto h-[90vh] top-[5vh]  bg-white border border-gray-300 rounded-xl shadow-lg p-4 w-[70vw] z-50"
          >
            <div>
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="rounded-full float-right"
              >
                <RxCrossCircled size={32} />
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingQuestionId ? "Edit Question" : "Add New Question"}
            </h2>
            <label className="flex items-center gap-4 w-fit">
              <span className="text-gray-700 w-fit">Question Type</span>
              <select
                name="questionType"
                value={newQuestion.questionType}
                onChange={(e) => {
                  setNewQuestion({
                    questionType: e.target.value,
                    ...getQuestionModel(e.target.value),
                  });
                }}
                className="block w-fit border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="passage">Passage</option>
                <option value="mcq">MCQ</option>
                <option value="numerical">Numerical Value Questions</option>
              </select>
            </label>
            {renderQuestionForm()}
          </form>
        </>
      )}
      <div className="mt-4">
        <div className="space-y-4">
          {questions.length != 0 ? (
            <>
              {" "}
              {questions.map((question, index) => (
                <div key={index} className="border p-4 rounded-md">
                  {renderQuestionContent(question)}
                  <div className="mt-2 flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(question.id)}
                      className="relative px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-yellow-400 transition-colors"
                    >
                      <FiEdit className="text-white" />
                      <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-10 opacity-0 hover:opacity-70 bg-black  text-white rounded-md p-2 transition-all duration-300 ease-in-out">
                        Edit
                      </span>
                    </button>

                    <button
                      onClick={() => handleDelete(question.id)}
                      className="relative px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-800 transition-colors"
                    >
                      <FiDelete className="text-white" />
                      <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-10 opacity-0 hover:opacity-70 bg-black text-white rounded-md p-2 transition-all duration-300 ease-in-out">
                        Delete
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div>
                <div className="flex  justify-center items-center ">
                  {" "}
                  <Lottie
                    animationData={loadingAnimation1}
                    loop={true}
                    className="h-[300px] w-fit translate-x-28"
                  />
                  <Lottie
                    animationData={loadingAnimation2}
                    loop={true}
                    className="h-[300px] translate-y-16 -translate-x-28 w-fit "
                  />
                </div>
                <p className="flex justify-center items-start text-center text-xl text-gray-500">
                  Click on Add New Questions to add your first question
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddQuestionsPage;
