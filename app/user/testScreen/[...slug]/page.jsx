"use client";
import React, { useState, useEffect, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { db } from "@/firebase/firebase";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { UserContext } from "@/providers/userProvider";
import Loading from "@/app/loading";
import { uploadImage } from "@/utils/functions/imageControls";

const TestPage = () => {
  const { user } = useContext(UserContext);
  const [time, setTime] = useState(20 * 60);
  const docId = usePathname().split("/")[3];
  const hasResult = usePathname().split("/")[4];
  const [testDetails, setTestDetails] = useState([]);
  const [pdfLink, setPdfLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTestQuestions = async () => {
      try {
        const testDocRef = doc(db, "tests", docId);
        const testDoc = await getDoc(testDocRef);

        if (testDoc.exists()) {
          const testData = testDoc.data();
          setTestDetails(testData);
          setTime(testData.duration ? testData.duration * 60 : 0);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching test questions:", error);
      }
    };

    fetchTestQuestions();
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
          <p className=" hidden md:block text-[14px] lg:text-[16px] text-background05">
            Seconds
          </p>
          <p className="md:hidden text-[14px] lg:text-[16px] text-background05">
            SS
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const storedSubmissionState = localStorage.getItem("examSubmitted");
    if (storedSubmissionState) {
      setIsSubmitting(true);
    }
  }, []);

  useEffect(() => {
    if (time <= 30 * 60 && isPdfUploaded) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [time, isPdfUploaded]);

  const handleSubmit = async () => {
    if (hasResult) {
      alert("This test has already been submitted.");
      return;
    }

    setIsLoading(true);
    const isConfirmed = window.confirm(
      "Are you sure you want to submit the test?"
    );

    if (isConfirmed || time === 0) {
      const totalTime = testDetails.duration * 60;
      const timeTaken = totalTime - time;

      try {
        const submissionTime = new Date();
        const docData = {
          displayName: user?.displayName || "",
          pdfLink: pdfLink || "",
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
        setIsLoading(false);
        localStorage.removeItem("examSubmitted");
        router.replace(`/user/dashboard/testcompletion/${docId}`);
      } catch (error) {
        console.error("Error saving lead data: ", error);
        alert("An error occurred while saving your data.");
        setIsSubmitting(false);
      }
    } else {
      console.log("Submission cancelled by user.");
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

  const showSubmitButton = time <= 15 * 60;

  return (
    <div>
      {isLoading && <Loading />}

      <div className="flex ">
        <div className="flex flex-col w-[75vw]">
          <div className="w-full">
            <iframe
              src={testDetails.testpdf || "about:blank"}
              className="w-full h-[100vh]"
              title="Test PDF"
              frameBorder="0"
            ></iframe>
          </div>
        </div>

        <div className="">
          <div className="text-center bg-[#F8F8F8] w-[25vw] rounded-br-md border-2 border-background05">
            <div className="text-[14px] md:text-[22px] lg:text-[30px] font-semibold text-background05">
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
              <div className="w-full flex flex-col justify-center items-center h-[400px] " >
                {!fileName ? (
                  <div className="border border-dashed border-[#075D7030] h-[108px] bg-[#075D7005] p-4 rounded">
                    <input
                      type="file"
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
                  <div className="w-full flex items-center justify-center h-[108px]  space-y-2 border border-background05 rounded">
                    {fileName && (
                      <p className="text-sm text-gray-600">{fileName}</p>
                    )}
                  </div>
                )}

                <div className="mt-4">
                  <button
                    onClick={handleSubmit}
                    className={`${
                      showSubmitButton && canSubmit
                        ? "bg-background05 "
                        : "bg-gray-500"
                    } text-white px-4 py-2 rounded rounded-lg`}
                    disabled={!canSubmit || isSubmitting}
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
