"use client";
import React, { useContext, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // For custom navigation arrows
import { AdminDataContext } from "@/providers/adminDataProvider";

const AchieversSection = () => {
  const { adminData, loading } = useContext(AdminDataContext);
  const [carouselRef, setCarouselRef] = useState(null);
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="lg:text-4xl text-2xl font-semibold text-blue-700 mb-8 text-center">
          Our Achievements
        </h2>
        {loading ? (
          <></>
        ) : (
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
            keyBoardControl={true}
            transitionDuration={500}
            containerClass="carousel-container"
            showDots={true}
            arrows={false}
            dotListClass="flex justify-center mt-4"
            dotsClass="flex space-x-2"
            ref={setCarouselRef}
          >
            {adminData?.achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white shadow-lg text-gray-800 p-6 rounded-lg transition-transform duration-300 transform hover:scale-105 h-72 mx-4"
              >
                <img
                  src={
                    achievement.studentImage ||
                    "https://via.placeholder.com/150"
                  }
                  alt={achievement.studentName}
                  className="rounded-lg mb-4 w-full h-32 object-cover" // Set fixed height for the image
                  onError={(e) => {
                    e.target.onerror = null; // Prevent looping
                    e.target.src = "https://via.placeholder.com/150"; // Fallback image
                  }}
                />
                <h3 className="text-lg font-bold">{achievement.studentName}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-blue-600 mr-1">🏆</span>
                  <p className="text-sm font-bold">
                    Achievement: {achievement.achievement}
                  </p>
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-blue-600 mr-1">📅</span>
                  <p className="text-sm">Year: {achievement.year}</p>
                </div>
              </div>
            ))}
          </Carousel>
        )}

        <style jsx>{`
          .react-multi-carousel-dot {
            @apply w-3 h-3 rounded-full bg-gray-400 cursor-pointer transition duration-300;
          }

          .react-multi-carousel-dot.active {
            @apply bg-blue-600;
          }
        `}</style>

        {/* Custom Navigation Buttons Below Dots */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => carouselRef?.previous()}
            className="mx-2 flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none"
            aria-label="Previous Achievement"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => carouselRef?.next()}
            className="mx-2 flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none"
            aria-label="Next Achievement"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchieversSection;
