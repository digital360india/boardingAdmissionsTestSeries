"use client";
import React, { useContext } from "react";
import TestPackageCard from "./TestPackageCard";
import { TestContext } from "@/providers/testProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

const TestPackages = () => {
  const { testPackages } = useContext(TestContext);

  const handleSeeAllPackages = () => {
    // Navigate to a page showing all test packages or trigger any other action
    console.log("Button clicked! Navigate to all packages.");
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Test Packages</h2>
        <button
          onClick={handleSeeAllPackages}
          className="text-sm underline text-blue-600 font-medium hover:text-blue-800 transition-colors"
        >
          See All Packages
        </button>
      </div>

      <div>
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="overflow-hidden"
        >
          {testPackages.map((pkg) => (
            <SwiperSlide key={pkg.id}>
              <div className="py-10">
                <TestPackageCard key={pkg.id} packageData={pkg} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleSeeAllPackages}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Explore More Packages
        </button>
      </div>
    </div>
  );
};

export default TestPackages;
