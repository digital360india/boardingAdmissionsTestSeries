"use client";
import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="relative">
        <div className="w-24 h-24 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <div className="w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin absolute top-4 left-4"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xl text-gray-700">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
