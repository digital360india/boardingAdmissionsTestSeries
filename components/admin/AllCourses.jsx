"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/firebase/firebase"; 
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const courseList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(courseList);
      } catch (err) {
        setError("Failed to fetch courses. Please try again.");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "courses", courseId));
      setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
    } catch (err) {
      console.error("Error deleting course:", err);
      setError("Failed to delete the course. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-t-4 border-blue-500 border-opacity-50 rounded-full animate-spin"></div>
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  const limitText = (text, limit = 200) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  return (
    <div className="course-list p-4">
      <h2 className="text-xl font-bold mb-4">Courses</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="course-card border rounded-lg p-4 shadow-lg relative">
            <Link href={`/admin/dashboard/courses/${course.id}`} className="block min-h-96">
              <img
                src={course.heroImage}
                alt={course.courseName}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{course.courseName}</h3>
              <p className="text-gray-700 mt-2">{limitText(course.description,80)}</p>
            </Link>
            <button 
              onClick={() => handleDelete(course.id)}
              className="mt-4 text-red-500 hover:text-red-700 absolute bottom-4 right-4"
            >
              Delete Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList
