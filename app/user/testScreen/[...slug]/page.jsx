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
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const docId = pathParts[3];
  const hasResult = pathParts[4];
  const [testDetails, setTestDetails] = useState([]);
  const [pdfLink, setPdfLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);
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
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
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
      <div className="relative">
        <div className="absolute top-0 right-0 p-4 bg-white shadow-md">
          <p className="font-bold text-lg text-red-500">{formatTime(time)}</p>
        </div>
      </div>

      <div className="flex">
        <div className="w-2/3 p-4">
          <iframe
            src={testDetails.testpdf || "about:blank"}
            className="w-full h-[100vh]"
            title="Test PDF"
            frameBorder="0"
          ></iframe>
        </div>

        <div className="w-1/3 p-4 bg-white shadow-lg">
          <h2 className="font-bold text-xl">{testDetails.testTitle}</h2>
          <p>{testDetails.testDescription}</p>
          <p>
            <strong>Duration:</strong> {testDetails.duration || "N/A"} minutes
          </p>
          <p>
            <strong>Total Marks:</strong> {testDetails.totalMarks || "N/A"}
          </p>
          <p>
            <strong>Subjects:</strong>{" "}
            {testDetails.subjects?.join(", ") || "N/A"}
          </p>
          {showSubmitButton && (
            <div className="mt-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="mb-4"
              />
              <button
                onClick={handleSubmit}
                className={`${
                  showSubmitButton && canSubmit ? "bg-red-500" : "bg-gray-500"
                } text-white px-4 py-2 rounded`}
                disabled={!canSubmit || isSubmitting}
              >
                Submit Test
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage;
