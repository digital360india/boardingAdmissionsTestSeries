"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { IoMdArrowBack } from "react-icons/io";
import { FaArrowRightLong, FaArrowDownLong } from "react-icons/fa6";
import Loading from "@/app/loading";

const Page = () => {
  const router = useRouter();
  const course = usePathname().split("/")[5];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courseData, setCourseData] = useState(null);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(null);
  const [selectedLectureIndex, setSelectedLectureIndex] = useState(null);
  const [showFullText, setShowFullText] = useState(false);
  const fetchCourseData = async () => {
    try {
      const courseDoc = await getDoc(doc(db, "courses", course));
      if (!courseDoc.exists()) {
        setError("Course not found.");
        setLoading(false);
        return;
      }
      setCourseData(courseDoc.data());
    } catch (err) {
      setError("Failed to fetch courses. Please try again.");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCourseData();
  });

  const handleChapterClick = (index) => {
    setSelectedChapterIndex(index === selectedChapterIndex ? null : index);
    setSelectedLectureIndex(null);
  };
  const handleLectureClick = (index) => {
    setSelectedLectureIndex(index === selectedLectureIndex ? null : index);
    const chapter = courseData.chapters[selectedChapterIndex];
    if (chapter.lectures[index].videoUrl) {
      const queryParams = new URLSearchParams({
        videoUrl: chapter.lectures[index].videoUrl,
        index: index.toString(),
        totalLectures: chapter.lectures.length.toString(),
        commentsID:chapter.lectures[index].commentsID,
      });

      chapter.lectures.forEach((lecture, idx) => {
        if (lecture.videoUrl) {
          queryParams.append(`videoUrl${idx}`, lecture.videoUrl);
        }
      });

      router.push(`/user/dashboard/video?${queryParams.toString()}`);
    }
  };
  const toggleTextDisplay = () => {
    setShowFullText(!showFullText);
  };

  if (loading) {
    return <div><Loading /></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <button className="flex px-2 items-center bg-[#075D70] text-white  rounded-lg w-[90px] h-[35px] text-[15px] font-medium mb-2" onClick={() => router.back()}>
        <IoMdArrowBack className="text-xl" />
        <span>Back</span>
      </button>

      <div className="w-full   ">
        <img src={courseData.heroImage} className="w-full h-[259px] rounded-[10px]  object-cover" />
        
      </div>

      <div className=" ">
        <h1 className=" lg:text-[30px] text-[16px] font-bold text-[#075D70] py-5 my-3 ">
        {courseData.courseName}
      </h1></div>

      <div className="border border-[#075D70] px-[25px] rounded-[10px]">
        <div className="text-[15px] font-semibold text-[#075D70] relative -top-[14px] bg-white w-fit px-1 ">Course Description</div>
      <div className="text-gray-700 mt-2 bg-gray-20 rounded-md shadow-lg">
        <div>
          {showFullText
            ? courseData.description
            : courseData.description.split(" ").slice(0, 30).join(" ") + "..."}
        </div>
        <button className="text-[#075D70] my-3 text-[15px] font-medium" onClick={toggleTextDisplay}>
          {showFullText ? "See Less" : "See More"}
        </button>
      </div>
      </div>

      <div className="mt-6">
        <h2 className="lg:text-[30px] text-[16px] font-bold text-[#075D70]    mb-4">Chapters</h2>
        <div className="space-y-4">
          {courseData.chapters.map((chapter, index) => (
            <div key={index}>
              <div
                className="bg-white shadow-lg  rounded-lg p-4 cursor-pointer"
                style={{ boxShadow: '0 2px 1px #075D70' }} 
                onClick={() => handleChapterClick(index)}
              >
                <h3 className="text-lg font-semibold text-primary03 flex gap-2 items-center transition-all  delay-500">
                  {selectedChapterIndex === index ? (
                    <FaArrowDownLong />
                  ) : (
                    <FaArrowRightLong />
                  )}
                  <span className="text-[12px] lg:text-[15px] font-semibold text-black">{chapter.chapterName}</span>
                </h3>
              </div>
              <div
                className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
                  selectedChapterIndex === index ? "max-h-screen" : "max-h-0"
                }`}
              >
                {selectedChapterIndex === index && (
                  <div className="mt-4 mb-4 pl-8">
                    <h4 className="text-lg font-semibold text-primary02 mb-2">
                      Lectures
                    </h4>
                    <div className=" flex gap-6 flex-wrap ">
                      {chapter.lectures.map((lecture, lectureIndex) => (
                        <div
                          key={lectureIndex}
                          className="bg-white shadow-lg rounded-lg p-4 cursor-pointer "
                          onClick={() => handleLectureClick(lectureIndex)}
                        >
                          <h4 className="text-md font-semibold text-black">
                            {lecture.name}
                          </h4>
                          <p className="text-black mt-2">
                            {`Creation Date: ${lecture.creationDate}`}
                          </p>
                          {selectedLectureIndex === lectureIndex && (
                            <div className="mt-2">
                              {lecture.pdfs.map((pdf, i) => (
                                <a
                                  key={i}
                                  href={pdf}
                                  className="text-blue-600 block"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View PDF {i + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
