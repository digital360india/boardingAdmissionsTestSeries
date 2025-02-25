"use client"
import React, { useState } from 'react';
import AddCourseDialog from '@/components/admin/AddNewCourse'; 
import CourseList from '@/components/admin/AllCourses';

const Page = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <div className="page-container p-6">
      <h1 className="text-2xl font-bold mb-4">Course Management Page</h1>
      <button
        onClick={openDialog}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Add New Course
      </button>
      <AddCourseDialog isOpen={isDialogOpen} onClose={closeDialog} />
      <CourseList />
    </div>
  );
};

export default Page;