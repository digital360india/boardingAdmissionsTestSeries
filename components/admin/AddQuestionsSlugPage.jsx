"use client";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import GoBackButton from "../backend/Gobackbutton";
import { SlCalender } from "react-icons/sl";
import { MdOutlineTimelapse } from "react-icons/md";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";

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

  return (
    <div className="flex flex-col lg:flex-row w-full  gap-4">
      <div className="lg:w-1/4 bg-white shadow p-4 sticky top-4 h-fit">
        <GoBackButton />
        <header className="mb-4 text-center">
          <h1 className="text-2xl font-bold">
            {test.testTitle || "Loading..."}
          </h1>
          <p className="text-gray-600">
            {test.testDescription || "No description available."}
          </p>
        </header>
        <h2 className="text-lg font-bold">Test Details</h2>

        <div className="space-y-3 mt-4">
          <div className="flex justify-between">
            <div>
              <div className="flex gap-2 items-center">
                <p>
                  <MdOutlineTimelapse className="text-[22px]" />
                </p>
                <p className="font-bold">Duration</p>
              </div>
            </div>
            <div>{test?.duration || "N/A"} minutes</div>
          </div>
          <div className="flex justify-between">
            <div>
              <div className="flex gap-2 items-center">
                <div>
                  <img src="/readiness_score.svg" alt="" />
                </div>
                <p className="font-bold">Total Marks</p>
              </div>
            </div>
            <div>{test?.totalMarks || "N/A"}</div>
          </div>
          <div className="flex justify-between">
            <div>
              <div className="flex gap-2 items-center">
                <p>
                  <HiOutlineQuestionMarkCircle className="text-[22px]" />
                </p>
                <p className="font-bold">Subjects</p>
              </div>
            </div>
            <div>
              <p>
                {test.subjects
                  ? test.subjects.map((subject, index) => (
                      <span key={index}>
                        {subject}
                        {index < test.subjects.length - 1 ? ", " : ""}
                      </span>
                    ))
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <div className="flex gap-2 items-center">
                <p>
                  <SlCalender />
                </p>
                <p className="font-bold">Creation Date</p>
              </div>
            </div>
            <div>{test?.testUploadDate || "N/A"}</div>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white shadow p-4 overflow-auto h-[80vh]">
        <iframe
          src={test.testpdf || "about:blank"}
          className="w-full h-full"
          title="Test PDF"
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
}

{
  /* <p> Starits of india, Imports and Exports human anotomy, Vitamins, disease , physics laws, periodic table and rivers and water disputes , biodiversity and wildlife santuary , dance forms , famous fairs  ,</p> */
}
