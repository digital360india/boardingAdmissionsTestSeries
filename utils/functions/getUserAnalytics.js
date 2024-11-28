import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { Timestamp } from "firebase/firestore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const UserAnalytics = ({ data }) => {
  const { myScores, myResults, displayName } = data;
  const [timeFilter, setTimeFilter] = useState("day");

  const filterScores = () => {
    const now = new Date();
    return myScores.filter((scoreData) => {
      const submissionDate =
        scoreData.submissionTime instanceof Timestamp
          ? scoreData.submissionTime.toDate()
          : new Date(scoreData.submissionTime);

      switch (timeFilter) {
        case "day":
          return submissionDate.toDateString() === now.toDateString();
        case "week":
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          return submissionDate >= oneWeekAgo;
        case "month":
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);
          return submissionDate >= oneMonthAgo;
        case "year":
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(now.getFullYear() - 1);
          return submissionDate >= oneYearAgo;
        default:
          return true;
      }
    });
  };

  const filteredScores = filterScores();
  const scores = filteredScores.map(
    (scoreData) => (scoreData.score / scoreData.totalMarks) * 100
  );
  const submissionTimes = filteredScores.map((scoreData) => {
    const date =
      scoreData.submissionTime instanceof Timestamp
        ? scoreData.submissionTime.toDate()
        : new Date(scoreData.submissionTime);
    return date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  });

  const chartData = {
    labels: submissionTimes,
    datasets: [
      {
        label: "Scores (%)",
        data: scores,
        backgroundColor: "rgba(99, 132, 255, 0.5)",
        borderColor: "rgba(99, 132, 255, 1)",
        borderWidth: 2,
        borderRadius: 10,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14,
            family: "Poppins",
            weight: "500",
          },
          color: "#333",
        },
      },
    },
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-100 to-blue-100 rounded-2xl shadow-lg">
  

      <h1 className="text-2xl text-center text-gray-800 mb-6">Hi, {displayName}!</h1>

  
      <div className="flex flex-col lg:flex-row gap-8 mt-4">
 

        <div className="flex-1 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-lg text-center font-medium text-gray-800 mb-4">Scores Over Time (%)</h2>
          <div className="text-center mb-8">
        <label className="text-lg font-medium text-gray-700">
          Show scores from:
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="ml-2 p-2 text-base rounded-lg border-2 border-gray-300 shadow-md bg-white focus:outline-none"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </label>
      </div>
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="flex-1 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-lg text-center font-medium text-gray-800 mb-4">Performance Overview</h2>
          <Line
            data={{
              labels: ["Correct Answers", "Total Questions"],
              datasets: [
                {
                  label: "Correct Answers",
                  data: [
                    // myResults.reduce(
                    //   (acc, result) =>
                    //     acc +
                    //     result.resultData.filter(
                    //       (q) => q.correctAnswer === q.selectedAnswer
                    //     ).length,
                    //   0
                    // ),
                    myResults.length,
                  ],
                  backgroundColor: ["rgba(75, 192, 192, 0.6)"],
                  borderColor: ["rgba(75, 192, 192, 1)"],
                  borderWidth: 2,
                  fill: true,
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
