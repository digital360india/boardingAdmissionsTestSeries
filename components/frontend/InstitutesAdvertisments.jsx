"use client";
import { useAdminData } from "@/providers/adminDataProvider";
import { useState } from "react";

const InstituteCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { adminData } = useAdminData();
  const images = adminData?.institutesAdvertisments || [];
  if (!images.length) {
    return <div className="text-center mt-8">No advertisements available</div>;
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="relative h-96 w-full overflow-hidden mt-8">
      {/* Carousel Content */}
      <div
        className="w-full h-full flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="w-full h-full flex-shrink-0"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
      >
        &#9664;
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
      >
        &#9654;
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default InstituteCarousel;
