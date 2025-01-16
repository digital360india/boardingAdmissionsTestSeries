"use client";
import React, { useContext } from "react";
import TestPackageCard from "./TestPackageCard";
import { TestContext } from "@/providers/testProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
const TestPackages = () => {
  const { testPackages } = useContext(TestContext);
 
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center ">
        <h2 className="text-2xl font-bold mb-6">Available Test Packages</h2>
      </div>
      <div className="">
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
    </div>
  );
};

export default TestPackages;
