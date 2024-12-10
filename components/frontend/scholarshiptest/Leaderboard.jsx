"use client";
import React, { useState, useEffect } from "react";

const Leaderboard = ({ resultValue, testId }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = () => {
      try {
        const filteredData = resultValue.result
          .filter(
            (entry) =>
              entry.score !== undefined &&
              entry.score !== null &&
              entry.id === testId
          )
          .sort((a, b) => {
            if (b.score === a.score) {
              return a.timeTaken - b.timeTaken;
            }
            return b.score - a.score;
          });

        setLeaderboardData(filteredData.slice(0, 10));
      } catch (error) {
        console.error("Error fetching leaderboard data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [resultValue, testId]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }
console.log(leaderboardData);
console.log(resultValue)
  return (
    <div className="border border-background04 rounded-md p-4 h-fit max-w-4xl mx-auto">
    <h1 className="text-2xl font-semibold text-background04 text-center">Leaderboard</h1>
    
    <div className="overflow-x-auto mt-4">
      <table className="w-full text-left border">
        <thead className="border border-background04">
          <tr className="text-background04">
            <th className="px-4 py-2 text-sm md:text-base">Rank</th>
            <th className="px-4 py-2 text-sm md:text-base">Name</th>
            <th className="px-4 py-2 text-sm md:text-base">Score</th>
            <th className="px-4 py-2 text-sm md:text-base">Time Taken</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry, index) => (
            <tr
              key={entry.id}
              className="border border-background04 text-background04"
            >
              <td className="px-4 py-2 text-sm md:text-base">{index + 1}</td>
              <td className="px-4 py-2 text-sm md:text-base capitalize">
                {entry.displayName || "Anonymous"}
              </td>
              <td className="px-4 py-2 text-sm md:text-base">{entry.score}</td>
              <td className="px-4 py-2 text-sm md:text-base">
                {entry.timeTaken ? formatTime(entry.timeTaken) : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>  
  );
};

export default Leaderboard;
