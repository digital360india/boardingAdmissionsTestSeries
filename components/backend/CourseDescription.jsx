"use client"
import React, { useState } from 'react';

const CourseDescription = ({ description }) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleTextDisplay = () => {
    setShowFullText(!showFullText);
  };

  return (
    <div className="text-gray-700 mt-2 bg-gray-300 p-10 rounded-md shadow-lg">
      <div className="text-xl font-bold py-2">Course Description</div>
      <div>
        {showFullText ? description : description.split(' ').slice(0, 20).join(' ') + '...'}
      </div>
      <button
        className="text-blue-600 mt-2"
        onClick={toggleTextDisplay}
      >
        {showFullText ? 'See Less' : 'See More'}
      </button>
    </div>
  );
};

export default CourseDescription;
