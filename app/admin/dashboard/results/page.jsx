"use client";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { ResultContext } from "@/providers/resultDataProvider";

export default function Page() {
  const router = useRouter();
  const { results }  = useContext(ResultContext);

  const handleCardClick = (id) => {
    router.push(`/admin/dashboard/results/${id}`);
  };

  return (
    <div>
      <div>
        {results?.map((value, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(value.id)}
            className="w-[300px] h-[400px] border rounded-md"
          >
            <div className="w-full h-[55%] bg-background05 rounded-t-lg flex items-center justify-center">
              <img src="/boardinglogo.png" alt="logo" className="w-fit h-fit" />
            </div>
            <div className="w-full h-[45%] p-4 flex flex-col justify-around">
              <p className="text-background05 font-medium">{value.testTitle}</p>
              <p>{value.testDescription}</p>

              <ul className="flex gap-4 list-disc list-inside">
                {value.subjects?.map((subject, index) => (
                  <li key={index}>{subject}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
