"use client";
import { ResultContext } from "@/providers/resultDataProvider";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState([]);
  const { results } = useContext(ResultContext);
  const id = usePathname().split("/").pop();
  const fetctResultByid = () => {
    const resultData = results?.filter((result) => result.id === id);
    setData(resultData[0]);
  };

  useEffect(() => {
    fetctResultByid();
  }, [id, results]);

  const handleResult = (link) => {
    console.log(link);
  };
  console.log(data);

  return (
    <div>
      <table className="w-full h-fit max-h-screen border">
        <thead>
          <tr className="text-[14px] h-[50px] font-semibold">
            <td>Name of Student</td>
            <td>Marks Scored</td>
            <td>Total Marks</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {data?.result?.map((value, index) => (
            <tr
              key={index}
              className={`text-[18px] h-[60px] p-4 ${
                index % 2 == 0 ? "bg-[#D3ECF1]" : "bg-[#fff]"
              }`}
            >
              <td>{value?.displayName || "User"}</td>
              <td>{value?.scored || "N/A"}</td>
              <td>{data?.totalMarks || "0"}</td>
              <td onClick={() => handleResult(value?.pdfLink)}>Result</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
