"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { useSubscription } from "@/providers/subscriptionProvider";
import { UserContext } from "@/providers/userProvider";
import { TestSeriesContext } from "@/providers/testSeriesProvider";

const TestPage = () => {
  const { user } = useContext(UserContext);
  const { allTests } = useContext(TestSeriesContext);
  const router = useRouter();
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");

  const [input, setInput] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [results, setResults] = useState([]);
  const initial = {
    show: false,
    id: "",
  };
  const [deletePopup, setDeletePopup] = useState(initial);
  const { subscriptionData } = useSubscription();
  const [expandedRows, setExpandedRows] = useState({});
  const getFirst50Words = (text) => {
    return text.split(" ").slice(0, 10).join(" ");
  };

  const toggleReadMore = (testId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [testId]: !prev[testId],
    }));
  };
  useEffect(() => {
    if (user?.testIDs) {
      const fetchTestsFromProvider = () => {
        const userTests = allTests.filter(test => user.testIDs.includes(test.id));
        setTests(userTests);
      };

      if (allTests.length > 0) {
        fetchTestsFromProvider();
      }
    }
  }, [allTests, user]);

  const handleOpenDialog = () => setIsDialogOpen(true);


  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!Array.isArray(tests) || tests.length === 0) {
    return <p>No tests available.</p>;
  }



  function filterData(value) {
    const results = tests.filter((test) => {
      const includes = test.testTitle
        .toLowerCase()
        .includes(value.toLowerCase());
      return includes;
    });
    setResults(results);
  }

  const handleChange = (value) => {
    setInput(value);
    filterData(value);
  };

  if (subscriptionData?.isActive == false) {
    return router.push("/subscribe/teacher");
  }

  const handleAddQuestions = (id)=>{
    router.push(`/teacher/dashboard/tests/${id}`)
  }
  return (
    <div className="space-y-4">
      <div
        className={`fixed ${
          deletePopup.show ? `block` : `hidden`
        }  flex h-[75vh] w-[80%] z-20 justify-center items-center`}
      >
        <div className="h-[75vh] z-20 w-full  bg-black opacity-70 "></div>
        <div className="h-[150px] flex flex-col justify-center fixed gap-5 w-[250px] text-center rounded-md opacity-100 z-30 bg-white ">
          <p className="text-xl">Are you Sure to Delete ?</p>
          <div className="h-[50px] w-full flex gap-3 text-lg text-white font-semibold justify-center">
            {" "}
            <button
              onClick={() => {
                handleDelete(deletePopup.id);
              }}
              className="h-[40px] w-[80px] bg-red-500 hover:bg-red-600 rounded-lg"
            >
              Yes
            </button>{" "}
            <button
              onClick={() => {
                setDeletePopup({ ...deletePopup, show: false });
                document.body.style.overflow = "auto";
              }}
              className="h-[40px] w-[80px] bg-blue-500 hover:bg-blue-600 rounded-lg"
            >
              No
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center w-full   gap-10 h-[70px]">

        <div className="flex items-center gap-2 h-[60px]  w-[500px] ">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => {
              handleChange(e.target.value);
            }}
            value={input}
            className={` duration-300 ${
              searchActive ? `w-[450px] opacity-100` : `w-[0px] opacity-0`
            } text-base font-light bg-slate-100 placeholder:text-black h-[45px] px-2 outline-none rounded-l-lg `}
          />
          <img
            onClick={() => {
              setSearchActive(!searchActive);
            }}
            className="duration-100 h-[30px] hover:scale-125 "
            src="/search.svg"
            alt=""
          />
        </div>
      </div>

      <div className=" rounded-md shadow-md">
        {" "}
        <table className="min-w-full border-collapse  rounded-md">
          <thead className="bg-gray-300">
            <tr className="text-sm">
              <th className="border p-4 text-left">Test Title</th>
              <th className="border p-4 text-left">Duration</th>
              <th className="border p-4 text-left">Test Upload Date</th>
              <th className="border p-4 text-left">Total Marks</th>
              <th className="border p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(searchActive ? results : tests).map((test, index) => (
              <tr
                key={test.id}
                className={`duration-100 border-b ${
                  index % 2 !== 0 ? `bg-gray-100` : `bg-white`
                } hover:bg-slate-300 text-sm`}
              >
                <td className="border font-bold p-4 w-fit">
                  {test.testTitle || "Untitled Test"}
                </td>
                <td className="border p-4 w-fit">{test.duration || "N/A"}</td>
                <td className="border p-4 w-fit">
                  {test.testLiveDate || "N/A"}
                </td>
                <td className="border p-4">{test.totalMarks || "N/A"}</td>
                <td>
                  <div className="flex gap-3 justify-center items-center h-full">
                    <button
                      onClick={() => {
                        handleAddQuestions(test.id);
                      }}
                      className='relative  after:z-50 text-background05 after:rounded-md  after:content-[""] hover:after:content-["Add_more"] after:h-[30px] after:overflow-hidden  after:text-center after:p-1 after:w-[0px] after:shadow-lg after:bg-white after:absolute after:-left-4 after:-bottom- after:text-sm hover:after:visible hover:after:w-[140px] after:duration-200 after:invisible after:text-black'
                    >
                      <IoIosAddCircle size={28} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestPage;
