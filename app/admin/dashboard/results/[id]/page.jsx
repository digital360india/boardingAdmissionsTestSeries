"use client";
import { ResultContext } from "@/providers/resultDataProvider";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { MdOutlineArrowOutward } from "react-icons/md";

export default function Page() {
  const [data, setData] = useState([]);
  const { results } = useContext(ResultContext);
  const id = usePathname().split("/").pop();
  const router = useRouter();
  const fetctResultByid = () => {
    const resultData = results?.filter((result) => result.id === id);
    setData(resultData[0]);
  };

  useEffect(() => {
    fetctResultByid();
  }, [id, results]);

  const handleResult = (userId) => {
    router.push(`/admin/dashboard/results/${id}/${userId}`);
  };
  console.log(data);

  return (
    <div className="overflow-x-auto md:-mx-4">
    <table className="w-full max-h-screen text-sm sm:text-base">
      <thead>
        <tr className="text-14px h-[50px] font-semibold bg-gray-200">
          <td className="pl-4 sm:pl-10 w-[40%]">Name of Student</td>
          <td className="text-center w-[20%]">Marks Scored</td>
          <td className="text-center w-[20%]">Total Marks</td>
          <td className="text-center pl-4 sm:pl-10 w-[20%]">Action</td>
        </tr>
      </thead>
      <tbody>
        {data?.result?.map((value, index) => (
          <tr
            key={index}
            className={`text-14px sm:text-18px h-[60px] ${
              index % 2 === 0 ? "bg-[#D3ECF1]" : "bg-white"
            }`}
          >
            <td className="pl-4 sm:pl-10 break-words">{value?.displayName || "User"}</td>
            <td className="text-center">{value?.scored || "N/A"}</td>
            <td className="text-center">{data?.totalMarks || "0"}</td>
            <td
              className="pl-4 sm:pl-10 text-center text-background05 cursor-pointer"
              onClick={() => handleResult(value?.userId)}
            >
              <div className="flex items-center justify-center gap-2">
                <span>Result</span>
                <span className="font-extralight text-lg">
                  <MdOutlineArrowOutward />
                </span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  );
}
