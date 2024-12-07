"use client";
import { useState, useEffect, useContext } from "react";
import { db } from "@/firebase/firebase";
import { addDoc, doc, getDoc, updateDoc, collection, arrayUnion } from "firebase/firestore";
import { usePathname } from "next/navigation";
import { mcqQuestionModel } from "@/models/QuestionModel";
import { RxCrossCircled } from "react-icons/rx";
import { deleteDoc } from "firebase/firestore";
import { getQuestionModel } from "@/utils/functions/getQuestionsModel";
import { UserContext } from "@/providers/userProvider";
import { serverTimestamp } from "firebase/firestore"; // Import serverTimestamp
import { renderQuestionContent } from "@/utils/functions/renderQuestionContent";
import {
  FiCamera,
  FiDelete,
  FiEdit,
  FiFileText,
  FiPenTool,
} from "react-icons/fi";
import Lottie from "lottie-react";
import loadingAnimation1 from "@/public/lottie/lottiehello.json";
import loadingAnimation2 from "@/public/lottie/lottieman.json";
import { uploadImage } from "@/utils/functions/imageControls";
import showError from "@/utils/functions/showError";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoPencil } from "react-icons/io5";
import { QuillEditor } from "./QuillEditor";
import QuestionBarControls from "./QuestionBarControls";
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
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [imagePreviews, setImagePreviews] = useState({});
  const { user } = useContext(UserContext);
  const pathname = usePathname();
  const [activeSolutionInput, setActiveSolutionInput] = useState("text");
  const [activeInputs, setActiveInputs] = useState({
    a: "text",
    b: "text",
    c: "text",
    d: "text",
  });
  const toggleInputType = (option, type) => {
    setActiveInputs((prev) => ({
      ...prev,
      [option]: type,
    }));
  };

  useEffect(() => {
    fetchTest();
  }, []);
  const fetchTest = async () => {
    try {
      const docRef = doc(db, "tests", testId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const testData = docSnap.data();
        setTest(testData);
        const questionIds = testData.test || [];
        if (Array.isArray(questionIds) && questionIds.length > 0) {
          const questionsPromises = questionIds.map((id) =>
            getDoc(doc(db, "questions", id))
          );
          const questionDocs = await Promise.all(questionsPromises);
          const questionsData = questionDocs
            .filter((doc) => doc.exists())
            .map((doc) => doc.data());
          setQuestions(questionsData);
        } else {
          console.log("No questions found in test data.");
          setQuestions([]);
        }
      } else {
        console.log("No such test document!");
      }
    } catch (err) {
      console.error("Error fetching test or questions:", err);
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
  const handleQuestionInputViaQuillChange = (name, value) => {
    setNewQuestion((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleOptionChange = (content, option) => {
    setNewQuestion((prevState) => ({
      ...prevState,
      answers: {
        ...prevState.answers,
        [option]: content,
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
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 100, 100);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            const fileUrl = await uploadImage(resizedFile, "questions_Images");
            if (fileUrl) {
              setImagePreview(fileUrl);

              setNewQuestion((prev) => ({
                ...prev,
                imageUrl: fileUrl,
              }));
            }
          }

          setUploading(false);
        }, file.type);
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      showError(error.message);
      toast.error("Error uploading image. Please try again.");
      e.target.value = "";
      setUploading(false);
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
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 100, 100);

        canvas.toBlob(async (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            const fileUrl = await uploadImage(resizedFile, "questions_Images");

            if (fileUrl) {
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
            } else {
              throw new Error("File URL not generated");
            }
          }
          setUploading(false);
        }, file.type);
      };
    } catch (error) {
      console.error("Error uploading answer image:", error);
      toast.error("Error uploading answer image. Please try again.");
      setUploading(false);
    }
  };

//   const handleDeleteImage = async (option) => {
//     try {
//       const imageUrl = option ? imagePreviews[option] : imagePreview;

//       if (imageUrl) {
//         await deleteImage(imageUrl, "questions_Images");
//         if (option) {
//           setNewQuestion((prev) => ({
//             ...prev,
//             answers: {
//               ...prev.answers,
//               [option]: null, // Clear the specific answer's image
//             },
//           }));
//           setImagePreviews((prev) => ({
//             ...prev,
//             [option]: null, // Remove the specific image preview
//           }));
//         } else {
//           setNewQuestion((prev) => ({
//             ...prev,
//             imageUrl: null, // Clear the question's image URL
//           }));
//           setImagePreview(null); // Remove the main question's image preview
//         }

//         toast.success("Image deleted successfully");
//       }
//     } catch (error) {
//       console.error("Error deleting image:", error);
//       toast.error("Error deleting image. Please try again.");
//     }
//   };

  const handleDelete = async (questionId) => {
    try {
      const testRef = doc(
        db,

        "tests",
        testId
      );
      const currentQuestions = test.questions;
      const updatedQuestions = currentQuestions.filter(
        (q) => q.id !== questionId
      );
      await updateDoc(testRef, {
        questions: updatedQuestions,
      });
      await deleteDoc(
        doc(
          db,

          "questions",
          questionId
        )
      );
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

  const handleSolutionImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 100 * 1024) {
      setUploading(true);
      try {
        const fileUrl = await uploadImage(file, "questions_Images");
        setImagePreview(fileUrl);
        setNewQuestion((prev) => ({
          ...prev,
          solution: fileUrl,
        }));
      } catch (error) {
        console.error("Error uploading solution image:", error);
        showError(error.message);
        toast.error("Failed to upload solution image. Please try again.");
      } finally {
        setUploading(false);
      }
    } else {
      alert("File size should be less than or equal to 100KB.");
    }
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
        await deleteImage(filename, "questions_Images");
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

        const testRef = doc(
          db,

          "tests",
          testId
        );
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
      <div className="">
        <div className="gap-10 sticky top-0 bg-slate-100 p-2 px-10  border border-blue z-10">
          <div>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="rounded-full float-right"
            >
              <RxCrossCircled size={32} />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-blue">
              {editingQuestionId ? "Edit Question" : "Add New Question"}
            </h2>
          </div>

          <label className="flex items-center gap-4 w-fit ">
            <span className="text-gray-700  w-fit">Question Type</span>
            <select
              name="questionType"
              value={newQuestion.questionType}
              onChange={(e) => {
                setNewQuestion({
                  questionType: e.target.value,
                  ...getQuestionModel(e.target.value),
                });
              }}
              className="block w-fit border-gray bg-slate-200 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="passage">Passage</option>
              <option value="mcq">MCQ</option>
              <option value="numerical">Numerical Value Questions</option>
            </select>
            <span className="text-gray-700 w-fit">Serial Number</span>
            <input
              type="text"
              name="sno"
              value={newQuestion.sno}
              onChange={handleInputChange}
              className=" block w-fit bg-slate-200 border-gray   border rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </label>

          <label className=" mb-4 flex justify-between items-center gap-10 mt-5">
            <span className="text-gray-700 min-w-fit ">Select Subject</span>
            <select
              name="subject"
              value={newQuestion.subject || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-slate-200 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

        <div className="px-8 py-4">
          {" "}
          <div className=" ">
            <div className="text-black  text-lg font-semibold pb-5 w-fit">
              Add Question Content
            </div>
            <div className="border border-blue  bg-slate-100 rounded-md shadow-lg">
              {" "}
              <QuillEditor
                name="question"
                value={newQuestion.question || ""}
                onContentChange={(content) =>
                  handleQuestionInputViaQuillChange("question", content)
                }
              />
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
                        <div className="text-blue mt-2">Uploading...</div>
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
                    <label className="block m-4">
                      <span className="text-black">
                        Upload Any Question Image (less than 100Kb)
                      </span>
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        className="mt-1 block w-full text-gray-500"
                      />
                      {uploading ? (
                        <div className="text-blue mt-2">Uploading...</div>
                      ) : (
                        imagePreview && (
                          <div className="mt-4 relative">
                            <h3 className="text-black">
                              Uploaded Image Preview:
                            </h3>
                            <img
                              src={imagePreview}
                              alt="Uploaded"
                              className="w-40 h-auto"
                            />
                            {/* <button
                              type="button"
                              onClick={() => handleDeleteImage(null)}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            >
                              &times;
                            </button> */}
                          </div>
                        )
                      )}
                    </label>

                    <div className="text-black font-semibold text-lg ">
                      {" "}
                      Add Answer Content
                    </div>
                    <div className="space-y-6">
                      {["a", "b", "c", "d"].map((option) => (
                        <div
                          key={option}
                          className="block mt-6 mb-6 border border-blue p-2 bg-slate-100 rounded-md shadow-lg "
                        >
                          <span className="text-gray-700 font-semibold">
                            Answer: {option.toUpperCase()}
                          </span>
                          <div className="mt-2">
                            {/* Text Editor */}
                            <div
                              className={
                                activeInputs[option] === "text"
                                  ? "block"
                                  : "hidden"
                              }
                            >
                              <QuillEditor
                                name={option}
                                value={newQuestion.answers?.[option] || ""}
                                onContentChange={(content) =>
                                  handleOptionChange(content, option)
                                }
                                z
                                className="bg-gray-100 border mt-1 block w-2/3 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              />
                              <button
                                type="button"
                                onClick={() => toggleInputType(option, "image")}
                                className="mt-2 text-sm bg-background04 p-2 rounded-lg text-white hover:underline"
                              >
                                <FiCamera />
                              </button>
                            </div>

                            {/* Image Upload */}
                            <div
                              className={
                                activeInputs[option] === "image"
                                  ? "block"
                                  : "hidden   "
                              }
                            >
                              <div className="mt-2">
                                {(newQuestion.answers?.[option]?.startsWith(
                                  "http"
                                ) ||
                                  imagePreviews[option]) && (
                                  <div className="mt-2 relative">
                                    <img
                                      src={
                                        imagePreviews[option] ||
                                        newQuestion.answers?.[option]
                                      }
                                      alt={`Answer ${option} preview`}
                                      className="w-20 h-auto"
                                    />
                                    {/* <button
                                      type="button"
                                      onClick={() => handleDeleteImage(option)}
                                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                    >
                                      &times;
                                    </button> */}
                                  </div>
                                )}

                                {/* Always show file input */}
                                <input
                                  type="file"
                                  onChange={(e) =>
                                    handleAnswerImageUpload(e, option)
                                  }
                                  className="mt-1 block w-1/3 text-gray-500"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => toggleInputType(option, "text")}
                                className="mt-2 text-sm bg-background04 p-2 rounded-lg text-white hover:underline"
                              >
                                <IoPencil />{" "}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      {" "}
                      {/* Correct Answer */}
                      <label className="block mb-4">
                        <span className="text-gray-700">Correct Answer</span>
                        <select
                          name="correctAnswer"
                          value={newQuestion.correctAnswer}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="">Select Correct Answer</option>
                          {["a", "b", "c", "d"].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                      {/* Positive Marks */}
                      <label className="block mb-4">
                        <span className="text-gray-700">Positive Marks</span>
                        <input
                          type="text"
                          name="totalmarks"
                          value={newQuestion.totalmarks}
                          onChange={handleInputChange}
                          placeholder="Please write the positive marks student can score"
                          className="mt-1 block w-full border bg-slate-200  placeholder:p-1  rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </label>
                      {/* Negative Marks */}
                      <label className="block mb-4">
                        <span className="text-gray-700">Negative Marks</span>
                        <input
                          type="text"
                          name="neg_marks"
                          value={newQuestion.neg_marks}
                          onChange={handleInputChange}
                          placeholder="Enter negative marks (e.g., 1 for -1)"
                          className="mt-1 block w-full border  bg-slate-200 placeholder:p-1  rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </label>
                    </div>
                  </div>
                );
              default:
                return null;
            }
          })()}
          <div>
            <div className="text-lg text-black font-semibold pb-5">
              Add Solutions
            </div>
            {activeSolutionInput === "text" && (
              <div className="bg-slate-100 rounded-sm shadow-lg border border-blue p-2">
                <QuillEditor
                  name="solution"
                  value={newQuestion.solution || ""}
                  onContentChange={(content) =>
                    handleQuestionInputViaQuillChange("solution", content)
                  }
                  className="bg-gray-100 border mt-1 block w-2/3 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setActiveSolutionInput("image")}
                  className="mt-2 text-sm bg-background04 p-2 rounded-lg text-white hover:underline"
                >
                  <FiCamera />{" "}
                </button>
              </div>
            )}
            {activeSolutionInput === "image" && (
              <div>
                <input
                  type="file"
                  onChange={(e) => handleSolutionImageUpload(e)}
                  className="mt-1 block w-1/3 text-gray-500"
                />
                {newQuestion.solution?.startsWith("http") && (
                  <div className="mt-2 relative">
                    <img
                      src={newQuestion.solution}
                      alt="Solution preview"
                      className="w-20 h-auto"
                    />
                    {/* <button
                      type="button"
                      onClick={() => handleDeleteImage()}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      &times;
                    </button> */}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setActiveSolutionInput("text")}
                  className="mt-2 text-sm bg-background04 p-2 rounded-lg text-white hover:underline"
                >
                  <FiPenTool />{" "}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className=" sticky bottom-0 bg-white pb-2 px-7 border-blue border">
          <button
            type="submit"
            className="mt-6 px-6  py-2  bg-blue-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {editingQuestionId ? "Update Question" : "Add Question"}
          </button>
        </div>
      </div>
    );
  };
  const handleEdit = (questionId) => {
    console.log(questionId);
    const questionToEdit = questions.find((q) => q.id === questionId);
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
    if (!newQuestion.sno || !newQuestion.question || !newQuestion.totalmarks) {
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
        const updatedQuestions = questions.map((q) =>
          q.id === editingQuestionId ? { ...q, ...newQuestion } : q
        );
        // toast.success("package updated successfully");
        setQuestions(updatedQuestions);
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
        const questionId = questionRef.id;
        const testRef = doc(db, "tests", testId);
        await updateDoc(testRef, {
          test: arrayUnion(questionId),
        });
        await updateDoc(questionRef, {
            id: questionId,
          });
        fetchTest();
        setImagePreview("");
        setImagePreviews("");
      }
      toast.success("package updated successfully");
      setNewQuestion({ questionType: "mcq", ...mcqQuestionModel });
      setShowForm(false);
      setImagePreview("");
    } catch (err) {
      console.error("Error adding/updating question:", err);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
        <ToastContainer />
      <QuestionBarControls
        setShowForm={setShowForm}
        setEditingQuestionId={setEditingQuestionId}
        setNewQuestion={setNewQuestion}
        showForm={showForm}
        mcqQuestionModel={mcqQuestionModel}
        questions={questions}
        test={test}
        user={user}
      />
      {showForm && (
        <>
          <div className=" fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" />

          <form
            onSubmit={handleSubmit}
            className="space-y-4 fixed overflow-y-auto h-[90vh] top-[5vh]  bg-white border border-gray-300 rounded-xl shadow-lg w-[70vw] z-50"
          >
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
