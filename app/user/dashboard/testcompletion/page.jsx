"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const categoryToDocId = {
  primary: "AWuwMWkFlshETmPD2qga",
  secondary: "6gNGLbJtpX1TMwnqXNgF",
  senior: "JAfTNak4ylz7QoptNkKa",
};

const TestComplete = () => {
  const [leaderboardData, setLeaderboardData] = useState({
    primary: [],
    secondary: [],
    senior: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "leads"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const sortedData = data
          .filter((entry) => entry.score !== undefined && entry.score !== null)
          .sort((a, b) => {
            if (b.score === a.score) {
              return a.timeTaken - b.timeTaken;
            }
            return b.score - a.score;
          });

        const categorizedData = {
          primary: sortedData.filter(entry => entry.category === categoryToDocId.primary),
          secondary: sortedData.filter(entry => entry.category === categoryToDocId.secondary),
          senior: sortedData.filter(entry => entry.category === categoryToDocId.senior),
        };

        setLeaderboardData(categorizedData);
      } catch (error) {
        console.error("Error fetching leaderboard data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <div className="flex flex-col space-y-8 px-8 py-4">
      <h1 className="text-[24px] font-semibold text-center">Leaderboard</h1>
      <div className="flex space-x-4">
        {["primary", "secondary", "senior"].map((category) => (
          <div key={category} className="flex-1 border p-4 rounded-md">
            <h2 className="text-[20px] font-semibold capitalize text-center">{category}</h2>
            <table className="w-full text-left mt-5 border rounded-md">
              <thead className="border">
                <tr>
                  <th className="px-4 py-2">Rank</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Score</th>
                  <th className="px-4 py-2">Time Taken</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData[category].map((entry, index) => (
                  <tr key={entry.id} className="border">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 capitalize">{entry.name || "Anonymous"}</td>
                    <td className="px-4 py-2">{entry.score}</td>
                    <td className="px-4 py-2">{entry.timeTaken ? formatTime(entry.timeTaken) : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestComplete;
