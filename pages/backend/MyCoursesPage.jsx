"use client";
import { UserContext } from "@/providers/userProvider";
import { collection, getDoc, doc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import Link from "next/link";
import Loading from "@/app/loading";

const MyCoursesPage = () => {
  const { user } = useContext(UserContext);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPackages = async () => {
    if (user && user.role == "user") {
      try {
        const allPackages = [];
        for (const pkg of user.mycoursepackages) {
          const packageDoc = await getDoc(
            doc(db, "coursePackages", pkg.packageId)
          );

          if (packageDoc.exists()) {
            const packageData = packageDoc.data();
            allPackages.push({ id: packageDoc.id, ...packageData });
          }
        }
        setPackages(allPackages);
      } catch (err) {
        setError("Failed to fetch course packages.");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [user]);

  if (loading) return <div><Loading /></div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      {" "}
      {user ? (
        <div className="container mx-auto p-4">
          <h1 className="lg:text-[30px] text-[16px] font-bold text-[#075D70] mb-[35px] lg:mb-[50px]">
            My Packages
          </h1>
          <div className="flex flex-row  flex-wrap  lg:gap-[72px] gap-[35px] drop-shadow-lg  justify-between lg:justify-normal">
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white shadow-xl rounded-[10px] overflow-hidden  sm:w-[285px] sm:h-[403px]  w-full h-auto  pb-5 "
                >
                  <div className="flex justify-end">
                    <div className="bg-primary02 px-[30px] py-[11px]   text-[12px] text-white   drop-shadow-lg rounded-l-[10px]">
                      Starting from:&nbsp;
                      <span className="font-semibold">
                        {new Date(pkg.startingDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  <div className=" py-[18px] px-[25px] ">
                    <img
                      src={pkg.image}
                      alt={pkg.packageName}
                      className="w-[235px] h-[108px]  rounded-[10px]  "
                    />
                  </div>
                  <div className="  px-[25px] flex flex-col gap-5 ">
                    <h2 className="text-[16px] font-semibold text-[#075D70]">
                      {pkg.packageName}
                    </h2>
                    
                    <p className="text-[#777777] text-[12px] ">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Duis pulvinar magna risus, et iaculis libero elementum at.
                      Etiam pellentesque ut massa ut gravida. Proin eget neque
                      elementum
                    </p>
                   
                    <div className=" ">
                      <Link
                        className="flex w-full"
                        href={`/user/dashboard/mypackages/[mycourses]`}
                        as={`/user/dashboard/mypackages/${pkg.id}`}
                      >
                        <button className="bg-primary02 text-white  rounded-lg w-[144px] h-[35px] text-[15px] font-medium  ">
                          Learn
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No course packages available.</p>
            )}
          </div>
        </div>
      ) : (
        <div><Loading /></div>
      )}
    </>
  );
};

export default MyCoursesPage;
