"use client"
import React, { useState } from 'react';
import AddCourseDialog from '@/components/admin/AddNewCourse'; 
import CourseList from '@/components/admin/AllCourses';

const Page = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <div className="page-container p-6 ">
      <div className="flex justify-between pb-5">

      <h1 className="text-2xl font-bold">Courses</h1>
      <button
        onClick={openDialog}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
       <span className='font-bold text-[18px]'>+</span> Add New Course
      </button>
        </div>
      <AddCourseDialog isOpen={isDialogOpen} onClose={closeDialog} />
      <CourseList />
    </div>
  );
};

export default Page;