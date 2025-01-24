"use client";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { ResultContext } from "@/providers/resultDataProvider";

export default function Page() {
  const router = useRouter();
  const { results } = useContext(ResultContext);

  const handleCardClick = (id) => {
    router.push(`/admin/dashboard/results/${id}`);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {results?.map((value, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(value.id)}
            className="w-full cursor-pointer sm:w-[300px] md:w-[250px] lg:w-[300px] h-auto border rounded-md overflow-hidden"
          >
            <div className="w-full h-[200px] bg-background05 flex items-center justify-center">
            <img src="/boardinglogo.png" alt="logo" className="w-fit h-fit" />
            </div>
            <div className="w-full p-4 flex flex-col gap-2">
              <p className="text-background05 font-medium text-sm sm:text-base">
                {value.testTitle}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                {value.testDescription}
              </p>

              <ul className="flex flex-wrap gap-2 text-sm sm:text-base list-disc list-inside text-gray-700">
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
