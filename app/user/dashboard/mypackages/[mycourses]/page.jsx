"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { db } from "@/firebase/firebase"; 
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";
import Loading from "@/app/loading";

const Page = () => {
  const currentPage = usePathname();
  const pathArray = currentPage.split("/");
  const packageId = pathArray[pathArray.length - 1];
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter(); 
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const packageDoc = await getDoc(doc(db, "coursePackages", packageId));
        
        if (!packageDoc.exists()) {
          setError("Package not found.");
          setLoading(false);
          return;
        }
        
        const packageData = packageDoc.data();
        const courseIds = packageData.courses || [];
        const coursesCollection = collection(db, "courses");
        const coursesDocs = await Promise.all(
          courseIds.map((courseId) => getDoc(doc(coursesCollection, courseId)))
        );
        
        const allCourses = coursesDocs
        .filter((doc) => doc.exists())
        .map((doc) => ({ id: doc.id, ...doc.data() }));
        
        setCourses(allCourses);
      } catch (err) {
        setError("Failed to fetch courses. Please try again.");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [packageId]);
  
  if (loading) return <div><Loading /></div>;
  if (error) return <div>{error}</div>;
  const truncateText = (text, limit) => {
    if (text === undefined) {
      return "";
    }
    
    const words = text.split(" ");
    if (words.length > limit) {
      return words.slice(0, limit).join(" ") + "...";
    }
    return text;
  };
  return (
    // <div className="container mx-auto p-4">
    //   <button className="flex " onClick={() => router.back()}>
    //     <div>
    //       {" "}
    //       <IoMdArrowBack className="text-xl" />{" "}
    //     </div>
    //     <div>Back</div>
    //   </button>
    //   <h1 className="text-3xl font-bold mb-6 mt-6">Courses in Package</h1>
    //   {courses.length > 0 ? (
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //       {courses.map((course) => (
    //         <div
    //           key={course.id}
    //           className="bg-white shadow-lg rounded-lg overflow-hidden"
    //         >
    //           <img
    //             src={course.heroImage}
    //             alt={course.name}
    //             className="w-full h-48 object-cover"
    //           />
    //           <div className="p-4">
    //             <h2 className="text-xl font-semibold text-green-600">
    //               {course.name}
    //             </h2>
    //             <p className="text-gray-700 mt-2">
    //               {truncateText(course.description, 20)}
    //             </p>
    //             <div className="mt-4 flex w-full">
    //               <Link
    //                 href={{
    //                   pathname: `/user/dashboard/mypackages/[mycourses]/[course]`,
    //                   query: { mycourses: packageId, course: course.id },
    //                 }}
    //                 as={`/user/dashboard/mypackages/${packageId}/${course.id}`}
    //                 className="w-full" 
    //               >
    //                 <button className="bg-background05 text-white px-4 py-2 rounded-lg w-full">
    //                   Learn
    //                 </button>
    //               </Link>
    //             </div>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   ) : (
    //     <p>No courses available in this package.</p>
    //   )}
    // </div>




 <div className="container mx-auto p-4">
  <button className="flex px-2 items-center bg-primary02 text-white  rounded-lg w-[90px] h-[35px] text-[15px] font-medium" onClick={() => router.back()}>
    <IoMdArrowBack className="text-xl mr-2" />
    <span>Back</span>
  </button>
  <h1 className="lg:text-[30px] text-[16px] font-bold text-[#075D70] mb-6 mt-6">Courses in Package</h1>
  {courses.length > 0 ? (
    <div className="grid grid-cols-1  gap-6">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-whit shadow-2xl rounded-lg overflow-hidden flex flex-col sm:flex-row  sm:p-4 p-6  "
        >
          <img
            src={course.heroImage}
            alt={course.name}
            className="sm:w-[160px] h-[160px]  w-full rounded-[10px] mr-5"
          />
          <div className="flex flex-col justify-between mt-[18px] sm:mt-0">
            <div>
              <h2 className="md:text-[25px] text-[16px] font-semibold text-[#075D70]">
                {course.courseName}
              </h2>
              <p className="text-[#777777] mt-2 text-[12px]">
                {truncateText(course.description, 60)}
              </p>
            </div>
            <div className="px-[20px] py-[7px] hidden lg:block">
              <Link
                href={{
                  pathname: `/user/dashboard/mypackages/[mycourses]/[course]`,
                  query: { mycourses: packageId, course: course.id },
                }}
                as={`/user/dashboard/mypackages/${packageId}/${course.id}`}
                className=""
              >
                <button className="bg-primary02 text-white  rounded-lg w-[144px] h-[35px] text-[15px] font-medium  ">
                  Learn
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>No courses available in this package.</p>
  )}
</div> 

  );
};

export default Page;
