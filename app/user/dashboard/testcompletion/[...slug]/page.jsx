"use client";
import React, { useState, useEffect, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserContext } from "@/providers/userProvider";
import Loading from "@/app/loading";
import "../../../../globals.css";
import { FaArrowLeft, FaRegFilePdf } from "react-icons/fa6";
import { TestSeriesContext } from "@/providers/testSeriesProvider";

const TestComplete = () => {
  const router = useRouter();
  const [testData, setTestData] = useState(null);
  const [testCategory, setTestCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const { allTests } = useContext(TestSeriesContext);
  const docId = usePathname().split("/")[4];

  useEffect(() => {
    const fetchResultData = async () => {
      try {
        const resultDocRef = doc(db, "results", docId);
        const resultDocSnap = await getDoc(resultDocRef);

        if (resultDocSnap.exists()) {
          const resultData = resultDocSnap.data();
          const userResult = resultData.result.find(
            (res) => res.userId === user?.id
          );

          if (userResult) {
            setTestData(userResult);
            if (userResult.id) {
              fetchCategoryData(userResult.id);
            }
          } else {
            console.error(
              "No matching result for this user in the result array."
            );
          }
        } else {
          console.error("No such document in results collection!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategoryData = async (testId) => {
      const categoryData = allTests.find((test) => test.id === testId);
      if (categoryData) {
        setTestCategory(categoryData);
      }
    };

    if (allTests.length > 0) {
      fetchResultData();
    }
  }, [docId, user, allTests]);

  const handleOnClick = () => {
    router.push("/user/dashboard/myresults");
  };

  const renderCard = (title, link) => {
    const isAvailable = Boolean(link);
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div
          className={`w-[243px] h-[143px] rounded-md flex flex-col items-center justify-evenly ${
            isAvailable
              ? "bg-background05 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          <FaRegFilePdf size={32} />
          {isAvailable && (
            <a href={link} target="_blank" className="underline">
              {title}
            </a>
          )}
        </div>
        <p>{title}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-[70vw] ">
      <FaArrowLeft onClick={handleOnClick} className="cursor-pointer" />
      <div className="py-10 px-8 ">
        <div className="flex justify-center lg:justify-between items-center w-full">
          <p className="text-center text-[18px] lg:text-[22px] text-green-600 font-semibold">
            Your test is submitted successfully!
          </p>
        </div>
        <div className="flex items-center justify-between mt-4">
          {renderCard("Question PDF", testCategory?.testpdf)}
          {renderCard("Submitted Answers", testData?.pdfLink)}
          {renderCard("Checked Result", testData?.resultpdfLink)}
        </div>

        {!testData?.resultpdfLink && (
          <p className="text-[#FF0000] italic  mt-4">
            Thank you for your patience. We are reviewing your test and will
            notify you as soon as your result is ready.
          </p>
        )}

        <div className="mt-6">
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
              <tr className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {testCategory?.testTitle}
                </td>
                <td className="border border-gray-300 font-semibold px-4 py-2">
                  {testData?.score || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {testCategory?.totalMarks}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestComplete;
