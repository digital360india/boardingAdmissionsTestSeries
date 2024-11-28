"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { UserContext } from "@/providers/userProvider";


const VideoPlayer = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get("videoUrl") || "";
  const commentsID = searchParams.get("commentsID") || "";
  const index = parseInt(searchParams.get("index") || "0", 10);
  const totalLectures = parseInt(searchParams.get("totalLectures") || "0", 10);

  const [currentIndex, setCurrentIndex] = useState(index);
  const [lectures, setLectures] = useState([]);
  useEffect(() => {
    const lectureUrls = Array.from(searchParams.keys())
      .filter((key) => key.startsWith("videoUrl"))
      .map((key) => searchParams.get(key) || "");

    setLectures(lectureUrls);
  }, [searchParams]);

  useEffect(() => {

  }, [currentIndex, totalLectures, videoUrl,commentsID]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalLectures);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + totalLectures) % totalLectures
    );
  };
  const [activeTab, setActiveTab] = useState("about");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [commentsData, setCommentsData] = useState();

  const [review, setReview] = useState("");
  const handleAddReview = async (e) => {
    e.preventDefault();

    try {
      const commentsRef = doc(db, "comments", commentsID);
      const docSnap = await getDoc(commentsRef);

      const newComment = {
        comment: review,
        studentName: user.displayName,
        time: new Date(),
      };

      if (docSnap.exists()) {
        if (docSnap.data().comments) {
          await updateDoc(commentsRef, {
            comments: arrayUnion(newComment),
          });
        } else {
          await updateDoc(commentsRef, {
            comments: [newComment],
          });
        }
      } else {
        await setDoc(commentsRef, {
          comments: [newComment],
        });
      }

      fetchComments();
      setReview("");
      alert("Review added successfully!");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };


  const fetchComments = async () => {
    try {
      const comments = await getDoc(doc(db, "comments", commentsID));
      if (!comments.exists()) {
        return;
      }

      setCommentsData(comments.data());
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [commentsID]);

  const formatTime = (time) => {
    const date = new Date(time.seconds * 1000 + time.nanoseconds / 1000000);

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };



  return (
    <div className="container mx-auto p-4">
      <button onClick={() => router.back()} className="flex gap-1 mb-4">
        <span>Back</span>
      </button>

      <div className="w-full flex justify-around">
        <div>
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

          <div className="max-w-4xl mx-auto p-4">
            {/* Tab Section */}
            <div className="flex space-x-4 border-b-2 pb-2">
              <button
                onClick={() => handleTabClick("about")}
                className={`px-4 py-2 ${
                  activeTab === "about"
                    ? "border-b-2 border-teal-600 text-teal-600"
                    : "text-gray-500"
                } font-semibold`}
              >
                About
              </button>
              <button
                onClick={() => handleTabClick("notes")}
                className={`px-4 py-2 ${
                  activeTab === "notes"
                    ? "border-b-2 border-teal-600 text-teal-600"
                    : "text-gray-500"
                } font-semibold`}
              >
                Notes
              </button>
            </div>

            {/* Content Section */}
            <div className="mt-4 text-gray-600">
              {activeTab === "about" && (
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Curabitur rutrum placerat lectus quis blandit. Nam ut risus a
                  mi vehicula porta. Aenean dictum et nulla sit amet fermentum.
                  Integer finibus, elit ut tempor lacinia, velit eros facilisis
                  velit, varius accumsan lacus ligula ac lectus. Maecenas
                  eleifend pretium erat, sed elementum risus fermentum eget.
                </p>
              )}
              {activeTab === "notes" && (
                <p>
                  Sed quis dictum nibh. Duis at lorem nisl. Praesent in laoreet
                  dolor, finibus posuere dolor. Integer rutrum dolor nisl. Nulla
                  facilisi.
                </p>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="max-w-md mx-auto p-4">
            {/* Chat input header */}
            <form
              className="flex items-center space-x-2 p-2 bg-white shadow rounded-lg"
              onSubmit={handleAddReview}
            >
              <input
                type="text"
                placeholder="Add Reviews..."
                className="flex-1 p-2 border rounded-md focus:outline-none"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
              <button
                className="p-2 bg-teal-600 text-white rounded-full"
                type="submit"
              >
                ✏️
              </button>
            </form>

            <div className="mt-4 space-y-4">
              {commentsData?.comments.map((message, index) => (
                <div key={index}>
                  <div className="flex justify-center">
                    <span className="px-4 py-1 bg-teal-100 text-teal-600 rounded-full text-xs">
                      {formatTime(message.time)}
                    </span>
                  </div>

                  <div className={`mt-2 p-4 rounded-lg shadow-lg`}>
                    <div className="font-semibold">{`Name of ${message.studentName}`}</div>
                    <p className="mt-2">{message.comment}</p>
                    <div className="text-xs text-right mt-2">
                      {formatTime(message.time)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
