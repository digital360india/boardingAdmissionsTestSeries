"use client";
import { db } from "@/firebase/firebase";
import { ResultContext } from "@/providers/resultDataProvider";
import { uploadImage } from "@/utils/functions/imageControls";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa6";

export default function page() {
  const [data, setData] = useState([]);
  const [testdata, setTestdata] = useState("");
  const { results } = useContext(ResultContext);
  const slug = usePathname().split("/").pop();
  const id = usePathname().split("/")[4];
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [pdfURL, setpdfURL] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const fetctResultByid = () => {
    const resultData = results?.find((result) => result.id === id);
    const userData = resultData?.result?.find((user) => user.userId === slug);
    console.log("Result Data:", resultData);
    console.log("User Data:", userData);
    setTestdata(resultData);
    setData(userData);
  };

  useEffect(() => {
    fetctResultByid();
  }, [id, slug, results]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    setIsUploading(true);
    try {
      const pdfUrl = await uploadImage(file, "pdfResult");
      console.log(pdfUrl);
      setpdfURL(pdfUrl);
      setIsPdfUploaded(true);
      setIsUploading(false);
      alert("PDF uploaded successfully!");
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setIsUploading(false); // Stop the progress indicator
      alert("Error uploading PDF.");
      setIsPdfUploaded(false);
    }
  };

  const handleSubmit = async () => {
    if (!isPdfUploaded) {
      alert("You haven't added any PDF. Please upload a PDF first.");
      return;
    }
    try {
      const resultDocRef = doc(db, "results", id);
      const resultDocSnapshot = await getDoc(resultDocRef);

      if (resultDocSnapshot.exists()) {
        const resultData = resultDocSnapshot.data();
        const updatedResults = resultData.result.map((userResult) => {
          if (userResult.userId === slug) {
            return { ...userResult, resultPdfLink: pdfURL };
          }
          return userResult;
        });
        await updateDoc(resultDocRef, {
          result: updatedResults,
        });
      } else {
        alert("No result found for this test.");
        return;
      }
      const userDocRef = doc(db, "users", slug);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const updatedMyResults = userData.myResults?.map((test) => {
          if (test.id === id) {
            return { ...test, resultPdfLink: pdfURL };
          }
          return test;
        });
        const testExists = userData.myResults?.some((test) => test.id === id);
        if (!testExists) {
          updatedMyResults.push({
            id,
            resultPdfLink: fileName,
          });
        }
        await updateDoc(userDocRef, {
          myResults: updatedMyResults,
        });
      } else {
        alert("User data not found.");
        return;
      }

      alert("PDF link successfully updated!");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("An error occurred while submitting the result.");
    }
  };

  const renderCard = (title, link) => {
    const isAvailable = Boolean(link);

    return (
      <div>
        {!isAvailable ? (
          <div className="w-full flex flex-col justify-center items-center h-[400px]">
            {!fileName ? (
              <div className="border border-dashed border-[#075D7030] h-[108px] bg-[#075D7005] p-4 rounded">
                <input
                  type="file"
                  accept=".pdf"
                  id="file-input"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="w-full text-center space-y-2">
                  <img src="/cloud.svg" alt="Cloud Icon" className="mx-auto" />
                  <label
                    htmlFor="file-input"
                    className="cursor-pointer text-background05 underline"
                  >
                    Browse
                  </label>
                  <span> file here</span>
                  <p className="text-[#676767]">Supported formats: PDF</p>
                </div>
              </div>
            ) : isUploading ? (
              <div className="w-full flex justify-center items-center h-[108px]">
                <p className="text-sm text-gray-600">Uploading...</p>
                <div className="loader"></div>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center gap-2 h-[108px] border border-background05 rounded">
                <p className="text-sm text-gray-600">{fileName}</p>
                <button
                  onClick={() => {
                    setFileName("");
                    setIsPdfUploaded(false);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <AiOutlineDelete size={20} />
                </button>
              </div>
            )}
            <div className="mt-4">
              <button
                onClick={handleSubmit}
                disabled={!isPdfUploaded}
                className={`${
                  isPdfUploaded ? "bg-background05" : "bg-gray-500"
                } text-white px-4 py-2 rounded-lg`}
              >
                Submit Checked Result
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div
              className={`w-[243px] h-[143px] rounded-md bg-background05 text-white flex flex-col items-center justify-evenly`}
            >
              <FaRegFilePdf size={32} />
              <a href={link} target="_blank" className="underline">
                {title}
              </a>
            </div>

            {title === "Checked Result" ? (
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className="text-white mt-2 px-3 py-1 bg-background05 rounded "
              >
                {isEditMode ? "Cancel Edit" : "Re-upload Result"}
              </button>
            ) : (
              <p>{title}</p>
            )}

            {title === "Checked Result" && isEditMode && (
              <div className="w-full flex flex-col justify-center items-center mt-4">
                {!fileName ? (
                  <div className="border border-dashed border-[#075D7030] h-[108px] bg-[#075D7005] p-4 rounded">
                    <input
                      type="file"
                      accept=".pdf"
                      id="edit-file-input"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <div className="w-full text-center space-y-2">
                      <img
                        src="/cloud.svg"
                        alt="Cloud Icon"
                        className="mx-auto"
                      />
                      <label
                        htmlFor="edit-file-input"
                        className="cursor-pointer text-background05 underline"
                      >
                        Browse
                      </label>
                      <span> file here</span>
                      <p className="text-[#676767]">Supported formats: PDF</p>
                    </div>
                  </div>
                ) : isUploading ? (
                  <div className="w-full flex justify-center items-center h-[108px]">
                    <p className="text-sm text-gray-600">Uploading...</p>
                    <div className="loader"></div>
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-center gap-2 h-[108px] border border-background05 rounded">
                    <p className="text-sm text-gray-600">{fileName}</p>
                    <button
                      onClick={() => {
                        setFileName("");
                        setIsPdfUploaded(false);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </div>
                )}
                <div className="mt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={!isPdfUploaded}
                    className={`${
                      isPdfUploaded ? "bg-background05" : "bg-gray-500"
                    } text-white px-4 py-2 rounded-lg`}
                  >
                    Submit Checked Result
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleOnClick = () => {
    router.push(`/admin/dashboard/results/${id}`);
  };

  const [score, setScore] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Error handling state
  const [formVisible, setFormVisible] = useState(true); // State to control form visibility

  const fetchData = () => {
    const resultDocRef = doc(db, "results", id);

    const unsubscribe = onSnapshot(
      resultDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.data()?.result || []); // Update state with data
          setIsLoading(false); // Stop loading
        } else {
          setData([]); // Clear data if the document does not exist
          setIsLoading(false);
        }
      },
      (error) => {
        setError(error);
        setIsLoading(false); // Stop loading in case of error
      }
    );

    return unsubscribe;
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    if (!score || !description) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const resultDocRef = doc(db, "results", id);
      const resultDocSnapshot = await getDoc(resultDocRef);

      if (resultDocSnapshot.exists()) {
        const resultData = resultDocSnapshot.data();
        const updatedResults = resultData.result.map((userResult) => {
          if (userResult.userId === slug) {
            return { ...userResult, score, description };
          }
          return userResult;
        });

        await updateDoc(resultDocRef, {
          result: updatedResults,
        });
      } else {
        await updateDoc(resultDocRef, {
          result: [{ userId: slug, score, description }],
        });
      }
      setIsPopupVisible(false);
      setFormVisible(false);

      alert("Result successfully updated!");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("An error occurred while submitting the result.");
    } finally {
      setIsSubmitting(false);
      fetchData();

    }
  };

  useEffect(() => {
    const unsubscribe = fetchData();
    return () => unsubscribe();
  }, [id]);

  console.log(testdata);

  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility

  const openPopup = () => {
    setScore(testdata?.score || ""); // Set default value when popup opens
    setDescription(testdata?.description || ""); // Set default value when popup opens
    setIsPopupVisible(true);
  };

  return (
    <div className="lg:w-[70vw]">
      <FaArrowLeft onClick={handleOnClick} className="cursor-pointer" />
      <div className="py-10 px-4 lg:px-8">
        <div className="flex justify-center lg:justify-between items-center w-full">
          <p className="text-center text-[18px] lg:text-[32px] text-green-600 font-semibold">
            The test has been submitted by the student
          </p>
        </div>
        <p className="text-[18px] text-background05">
          Download the{" "}
          <span className="font-semibold">Submitted Answers PDF</span> to
          analyze student submissions and provide results effectively.
        </p>
        <div className="flex flex-wrap items-center justify-between mt-4">
          {renderCard("Question Paper", testdata?.testpdf)}
          {renderCard("Submitted Answers", data?.pdfLink)}
          {renderCard("Checked Result", data?.resultPdfLink)}
        </div>

        <div className="mb-10 mt-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background05 text-white font-semibold text-center">
                <th className="border border-gray-300 px-4 py-2">Test Name</th>
                <th className="border border-gray-300 px-4 py-2">
                  Marks Obtained
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Total Marks
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="text-center">
                  <td colSpan="3" className="border border-gray-300 px-4 py-2">
                    Loading...
                  </td>
                </tr>
              ) : (
                <tr className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {testdata?.testTitle || "N/A"}
                  </td>
                  <td className="border border-gray-300 font-semibold px-4 py-2">
                    {data?.score || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {testdata?.totalMarks || "N/A"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-10">
            <div className="text-white bg-background05 p-2 w-fit rounded-t-xl">
              Review
            </div>
            <div className="w-full h-fit border-2 rounded-b-xl rounded-r-xl p-6">
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                testdata?.result?.[0]?.description || "N/A"
              )}
            </div>
            <div className="">
              <button
                className="text-background05 border border-background05 px-4 py-1 rounded-xl mt-4"
                onClick={openPopup}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {formVisible && !data?.score && (
        <div className="max-w-lg mt-10 shadow-md rounded-xl relative">
          <div
            className="absolute h-fit w-full inset-0 bg-background05 opacity-5 rounded-xl"
            style={{ zIndex: -1 }}
          />
          <div className="w-full bg-background05 rounded-t-xl p-6">
            <h1 className="text-lg font-semibold text-white">
              Marks Input Form
            </h1>
          </div>

          <form onSubmit={handleSubmit2} className="space-y-4 p-6 relative">
            <div>
              <label className="block text-sm font-medium text-black">
                Marks Scored (out of 100)
              </label>
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="Enter Marks Here..."
                className="w-1/2 mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Package Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description here...."
                maxLength={100}
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              ></textarea>
              <p className="text-right text-sm text-gray-500">
                Max. 100 characters
              </p>
            </div>
            <button
              type="submit"
              className={` py-2 px-4 text-white rounded-md ${
                isSubmitting
                  ? "bg-teal-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      )}

      {/* Popup Form */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full relative">
            <h2 className="text-xl font-bold mb-4">Popup Form</h2>
            <form onSubmit={handleSubmit2} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">
                  Marks Scored (out of 100)
                </label>
                <input
                  type="number"
                  value={score} // Use the state value here
                  onChange={(e) => setScore(e.target.value)} // Update state on change
                  placeholder="Enter Marks Here..."
                  className="w-1/2 mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Package Description
                </label>
                <textarea
                  value={description} // Use the state value here
                  onChange={(e) => setDescription(e.target.value)} // Update state on change
                  placeholder="Enter Description here...."
                  maxLength={100}
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                ></textarea>
                <p className="text-right text-sm text-gray-500">
                  Max. 100 characters
                </p>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="py-2 px-4 bg-gray-300 rounded-md"
                  onClick={() => setIsPopupVisible(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
