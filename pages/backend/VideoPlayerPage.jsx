"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const VideoPlayer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") || "";
  const index = parseInt(searchParams.get("index") || "0", 10);

  const [currentIndex, setCurrentIndex] = useState(index);
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const docRef = doc(db, "courses", courseId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const courseData = docSnap.data();
          const allLectures = courseData.chapters.flatMap(chapter =>
            chapter.lectures.map(lecture => lecture.videoUrl)
          );
          setLectures(allLectures);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchLectures();
  }, [courseId]);

  useEffect(() => {

  }, [currentIndex, lectures]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % lectures.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + lectures.length) % lectures.length);
  };

  return (
    <div className="container mx-auto p-4">
      <button onClick={() => router.back()} className="flex gap-1 mb-4">
        <span>Back</span>
      </button>

      <div className="w-full">
        <video
          controls
          className="w-full h-auto"
          src={lectures[currentIndex]}
        >
          Your browser does not support the video tag.
        </video>

        <div className="mt-4">
          <button
            onClick={handlePrevious}
            className="mr-2 px-4 py-2 bg-gray-700 text-white rounded"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
