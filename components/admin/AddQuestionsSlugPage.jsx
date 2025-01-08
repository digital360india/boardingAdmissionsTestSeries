"use client";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import GoBackButton from "../backend/Gobackbutton";

export default function AddQuestionsSlugPage() {
  const [test, setTest] = useState({});
  const currentPage = usePathname();
  const pathArray = currentPage.split("/");
  const testId = pathArray[pathArray.length - 1];

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
      } else {
        console.log("No such test document!");
      }
    } catch (err) {
      console.error("Error fetching test or questions:", err);
    }
  };
  console.log(test);
  return (
    <div className="flex flex-col items-center p-4">
       <GoBackButton />
      <header className="mb-4 text-center">
        <h1 className="text-2xl font-bold">{test.testTitle || "Loading..."}</h1>
        <p className="text-gray-600">
          {test.testDescription || "No description available."}
        </p>
      </header>

      <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-4">
        <div className="flex-1 bg-white shadow p-4 overflow-auto h-[80vh]">
          <iframe
            src={test.testpdf || "about:blank"}
            className="w-full h-full"
            title="Test PDF"
            frameBorder="0"
          ></iframe>
        </div>

        <div className="lg:w-1/4 bg-white shadow p-4 sticky top-4 h-fit">
          <h2 className="text-lg font-bold">Test Details</h2>
          <p>
            <strong>Duration:</strong> {test.duration || "N/A"} minutes
          </p>
          <p>
            <strong>Total Marks:</strong> {test.totalMarks || "N/A"}
          </p>
          <p>
            <strong>Subjects:</strong>{" "}
            {test.subjects
              ? test.subjects.map((subject, index) => (
                  <span key={index}>
                    {subject}
                    {index < test.subjects.length - 1 ? ", " : ""}
                  </span>
                ))
              : "N/A"}
          </p>
          <p>
            <strong>Upload Date:</strong> {test.testUploadDate || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
