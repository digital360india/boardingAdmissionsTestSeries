"use client";
import React, { useState, useEffect, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { db } from "@/firebase/firebase";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { UserContext } from "@/providers/userProvider";
import Loading from "@/app/loading";
import { uploadImage } from "@/utils/functions/imageControls";
import { AiOutlineDelete } from "react-icons/ai";

const TestPage = () => {
  const { user } = useContext(UserContext);
  const [time, setTime] = useState(20 * 60);
  const docId = usePathname().split("/")[3];
  const hasResult = usePathname().split("/")[4];
  const [testDetails, setTestDetails] = useState({});
  const [pdfLink, setPdfLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  // const [canSubmit, setCanSubmit] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const testDocRef = doc(db, "tests", docId);
        const testDoc = await getDoc(testDocRef);
        if (testDoc.exists()) {
          const testData = testDoc.data();
          setTestDetails(testData);
          setTime(testData.duration ? testData.duration * 60 : 0);
        } else {
          console.error("No test found!");
        }
      } catch (error) {
        console.error("Error fetching test details:", error);
      }
    };

    fetchTestDetails();
  }, [docId]);

  useEffect(() => {
    if (time === 0 && !isSubmitting) {
      handleSubmit();
    }
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [time, isSubmitting]);

  useEffect(() => {
    if (hasResult === "false") {
      const disableReloadShortcuts = (event) => {
        if (
          event.key === "F5" ||
          (event.ctrlKey && (event.key === "r" || event.key === "R"))
        ) {
          event.preventDefault();
          alert(
            "The test has not been submitted yet. Please complete the test."
          );
        }
      };

      const handleBeforeUnload = (event) => {
        const confirmationMessage =
          "Your test will be submitted if you reload. Are you sure?";
        event.returnValue = confirmationMessage;
        // handleSubmit();
        return confirmationMessage;
      };

      window.addEventListener("keydown", disableReloadShortcuts);
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("keydown", disableReloadShortcuts);
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [hasResult]);

  const handleSubmit = async () => {
    if (hasResult === "true") {
      alert("This test has already been submitted.");
      return;
    }
    setIsSubmitting(true);

    const totalTime = testDetails.duration * 60;
    const timeTaken = totalTime - time;

    try {
      const submissionTime = new Date();
      const docData = {
        displayName: user?.displayName || "",
        pdfLink: pdfLink || "No PDF uploaded",
        timeTaken: timeTaken ?? 0,
        id: docId || "",
        testSubmissionTime: submissionTime,
        userId: user?.id || "",
      };

      const docRef = doc(db, "results", docId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        await updateDoc(docRef, {
          result: arrayUnion(docData),
        });
      } else {
        await setDoc(docRef, {
          id: docId,
          subjects: testDetails.subjects,
          totalMarks: testDetails.totalMarks,
          result: [docData],
        });
      }
      if (user?.id) {
        const userDocRef = doc(db, "users", user.id);
        await updateDoc(userDocRef, {
          myResults: arrayUnion(docData),
        });
      }
      setIsSubmitting(false);
      router.replace("/user/dashboard/myresults");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while submitting your test.");
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    try {
      const pdfUrl = await uploadImage(file, "pdfTest");
      setPdfLink(pdfUrl);
      setIsPdfUploaded(true);
      alert("PDF uploaded successfully!");
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Error uploading PDF.");
      setIsPdfUploaded(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return (
      <div className="flex w-full justify-between px-1 lg:px-[25px] py-4">
        <div>
          <p>{String(hours).padStart(2, "0")}</p>
          <p className="hidden md:block text-[14px] lg:text-[16px] text-background05">
            Hours
          </p>
          <p className="md:hidden text-[14px] lg:text-[16px] text-background05">
            HH
          </p>
        </div>
        <div>
          <p>{String(minutes).padStart(2, "0")}</p>
          <p className="hidden md:block text-[14px] lg:text-[16px] text-background05">
            Minutes
          </p>
          <p className="md:hidden text-[14px] lg:text-[16px] text-background05">
            MM
          </p>
        </div>
        <div>
          <p>{String(secs).padStart(2, "0")}</p>
          <p className="hidden md:block text-[14px] lg:text-[16px] text-background05">
            Seconds
          </p>
          <p className="md:hidden text-[14px] lg:text-[16px] text-background05">
            SS
          </p>
        </div>
      </div>
    );
  };

  const handleDeleteFile = () => {
    setFileName("");
  };

  return (
    <div>
      {isLoading && <Loading />}
      <div className="flex flex-col lg:flex-row">
        <div className="lg:hidden block flex flex-col justify-center items-center ">
          <div className="text-center bg-[#F8F8F8] w-full rounded-br-md border-2 border-background05">
            <div className="text-[30px] font-semibold text-background05 px-12">
              {formatTime(time)}
            </div>
          </div>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="bg-background05 w-[80vw]  text-white px-4 py-2 rounded mb-4"
          >
            {isVisible ? "Hide Details" : "Click to Submit your answer"}{" "}
          </button>
          <div className={`lg:hidden block ${isVisible ? "block" : "hidden"}`}>
            <div className="flex flex-col items-center justify-center ">
              <h2 className="font-bold text-[22px] text-background05 mb-2">
                {testDetails.testTitle}
              </h2>
              <div className="w-[280px] font-semibold space-y-2">
                <div className="flex justify-between">
                  <p>Duration</p>
                  <p className="text-background05">
                    {testDetails.duration || "N/A"} minutes
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Total Marks</p>
                  <p className="text-background05">
                    {testDetails.totalMarks || "N/A"}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Subjects</p>
                  <p className="text-background05">
                    {testDetails.subjects?.join(", ") || "N/A"}
                  </p>
                </div>
                <div className="w-full flex flex-col justify-center items-center h-[200px]">
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
                        <img
                          src="/cloud.svg"
                          alt="Cloud Icon"
                          className="mx-auto"
                        />
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
                  ) : (
                    <div className="w-full flex items-center justify-center gap-2  h-[108px] border border-background05 rounded">
                      <p className="text-sm text-gray-600">{fileName}</p>
                      <button
                        onClick={handleDeleteFile}
                        className="text-red-500 hover:text-red-700"
                      >
                        <AiOutlineDelete size={20} />
                      </button>
                    </div>
                  )}
                  <div className="mt-4">
                    <button
                      onClick={handleSubmit}
                      className={`${
                        time <= 30 * 60
                          ? "bg-background05 "
                          : "bg-gray-500"
                      } text-white px-4 py-2 rounded rounded-lg`}
                      disabled={ isSubmitting}
                    >
                      Submit Test
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:w-[75vw]">
          <iframe
            src={testDetails.testpdf || "about:blank"}
            className="w-full h-[100vh]"
            title="Test PDF"
            frameBorder="0"
          ></iframe>
        </div>
        <div className="hidden lg:block">
          <div className="text-center bg-[#F8F8F8] w-full rounded-br-md border-2 border-background05">
            <div className="w-full text-[14px] md:text-[22px] lg:text-[30px] font-semibold text-background05">
              {formatTime(time)}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-[20px]">
            <h2 className="font-bold text-[22px] text-background05 mb-2">
              {testDetails.testTitle}
            </h2>
            <div className="w-[280px] font-semibold space-y-2">
              <div className="flex justify-between">
                <p>Duration</p>
                <p className="text-background05">
                  {testDetails.duration || "N/A"} minutes
                </p>
              </div>
              <div className="flex justify-between">
                <p>Total Marks</p>
                <p className="text-background05">
                  {testDetails.totalMarks || "N/A"}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Subjects</p>
                <p className="text-background05">
                  {testDetails.subjects?.join(", ") || "N/A"}
                </p>
              </div>
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
                      <img
                        src="/cloud.svg"
                        alt="Cloud Icon"
                        className="mx-auto"
                      />
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
                ) : (
                  <div className="w-full flex items-center justify-center gap-2  h-[108px] border border-background05 rounded">
                    <p className="text-sm text-gray-600">{fileName}</p>
                    <button
                      onClick={handleDeleteFile}
                      className="text-red-500 hover:text-red-700"
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </div>
                )}
                <div className="mt-4">
                  <button
                    onClick={handleSubmit}
                    className={`${
                      time <= 30 * 60 
                        ? "bg-background05 "
                        : "bg-gray-500"
                    } text-white px-4 py-2 rounded rounded-lg`}
                    disabled={isSubmitting}
                  >
                    Submit Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
