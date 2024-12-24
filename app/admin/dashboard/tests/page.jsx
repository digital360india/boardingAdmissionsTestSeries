"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  query,
  where,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/firebase";
import { UserContext } from "@/providers/userProvider";
import TestTable from "@/components/admin/TestTableComponent";
import { TestSeriesContext } from "@/providers/testSeriesProvider";
import Loading from "@/app/loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import showError from "@/utils/functions/showError";
import EditTestModal from "@/components/admin/EditTestModel";
import AddTestDialog from "@/components/admin/AddTestDialog";
const TestPage = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { allTests, addTest, handleEdit } = useContext(TestSeriesContext);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTestId, setEditTestId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [input, setInput] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [results, setResults] = useState([]);
  const [newTest, setNewTest] = useState({
    testTitle: "",
    testDescription: "",
    testUploadDate: "",
    duration: "",
    totalMarks: "",
    subjects: [],
    updatedAt: "",
    updatedBy: "",
    analytics: [],
    test: [],
    teachersAssigned: [],
  });
  const [editTest, setEditTest] = useState({
    testTitle: "",
    testDescription: "",
    duration: "",
    totalMarks: "",
    teachersAssigned: [],
  });
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const getFirst50Words = (text) => {
    return text.split(" ").slice(0, 5).join(" ");
  };
  useEffect(() => {
    if (allTests.length > 0) {
      setTests(allTests);
      setLoading(false);
    } else {
      setError("No tests available");
    }
  }, [allTests]);
  const toggleReadMore = (testId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [testId]: !prev[testId],
    }));
  };
  async function fetchTeachers() {
    try {
      const teachersRef = collection(db, "users");
      const q = query(teachersRef, where("role", "==", "teacher"));
      const querySnapshot = await getDocs(q);
      const teacherList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeachers(teacherList);
    } catch (error) {
      console.error("Error fetching teachers: ", error);
      showError(error.message);
    }
  }
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditTest({
      ...editTest,
      [name]: value,
    });
  };
  const handleEditTest = async (e) => {
    e.preventDefault();
    try {
      const updatedTest = {
        ...editTest,
        updatedAt: new Date().toISOString(),
      };

      if (user && user.id) {
        updatedTest.updatedBy = user.id;
      }
      await handleEdit(editTestId, updatedTest);
      toast.success("Test updated successfully!");
      handleCloseEditDialog();
    } catch (err) {
      console.error("Error updating test:", err);
      showError(err.message);
      toast.error("Failed to update test.");
    }
  };
  const handleAddTest = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        ...newTest,
        createdAt: new Date().toISOString(),
        createdBy: user?.id,
      };
      const docRef = await addTest(userData);

      await updateDoc(docRef, {
        id: docRef.id,
      });

      for (const teacherId of newTest.teachersAssigned) {
        const teacherRef = doc(db, "users", teacherId);
        await updateDoc(teacherRef, {
          testIDs: arrayUnion(docRef.id),
        });
      }

      toast.success("Test added successfully!");
      handleCloseDialog();

      // Refresh test list
      const querySnapshot = await getDocs(collection(db, "tests"));
      const testList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTests(testList);

      // Reset the form fields
      setNewTest({
        testTitle: "",
        testDescription: "",
        testUploadDate: "",
        duration: "",
        totalMarks: "",
        subjects: [],
        updatedAt: "",
        updatedBy: "",
        analytics: [],
        test: [],
        teachersAssigned: [],
      });
      setSelectedTeacher("");
    } catch (err) {
      console.error("Error adding test:", err);
      showError(err.message);
    }
  };
  const handleAddQuestions = (testId) => {
    router.push(`/admin/dashboard/tests/${testId}`);
  };
  const handleCloseDialog = () => setIsDialogOpen(false);
  const handleOpenEditDialog = (test) => {
    setEditTestId(test.id);
    setEditTest({
      testTitle: test.testTitle,
      duration: test.duration,
      subjects: test.subjects,
      testDescription: test.testDescription,
      testUploadDate: test.testUploadDate,
      totalMarks: test.totalMarks,
      teachersAssigned: test.teachersAssigned || [],
    });
    fetchTeachers();
    setIsEditDialogOpen(true);
  };
  const handleOpenDialog = async () => {
    setIsDialogOpen(true);
    if (teachers.length === 0) {
      await fetchTeachers();
    }
  };
  const handleCloseEditDialog = () => setIsEditDialogOpen(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTest({
      ...newTest,
      [name]: value,
    });
  };
  const handleTeacherSelect = async (teacherId) => {
    setSelectedTeacher(teacherId);
    const isAssigned = editTest.teachersAssigned.includes(teacherId);
    if (editTestId) {
      const testRef = doc(db, "tests", editTestId);
      const teacherRef = doc(db, "users", teacherId);
      setEditTest((prevEditTest) => {
        const updatedTeachersAssigned = isAssigned
          ? prevEditTest.teachersAssigned.filter((id) => id !== teacherId)
          : [...prevEditTest.teachersAssigned, teacherId];
        return {
          ...prevEditTest,
          teachersAssigned: updatedTeachersAssigned,
        };
      });
      try {
        if (isAssigned) {
          await updateDoc(testRef, {
            teachersAssigned: arrayRemove(teacherId),
          });
          await updateDoc(teacherRef, {
            testIDs: arrayRemove(editTestId),
          });
        } else {
          await updateDoc(testRef, {
            teachersAssigned: arrayUnion(teacherId),
          });
          await updateDoc(teacherRef, {
            testIDs: arrayUnion(editTestId),
          });
        }
      } catch (error) {
        console.error("Error updating Firestore: ", error);
        showError(error.message);
      }
    }
  };
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
    <div className="space-y-4">
      {teachers.map((teacher) => (
        <div key={teacher.id} className="flex items-center space-x-2">
          <input
            type="radio"
            name="teacher"
            value={teacher.id}
            checked={selectedTeacher === teacher.id}
            onChange={() => handleTeacherSelect(teacher.id)}
          />
          <label className="text-gray-700 font-medium">{teacher.name}</label>
        </div>
      ))}
    </div>;
    filterData(value);
  };
  const handleSubjectChange = (e) => {
    const { value, checked } = e.target;
    setNewTest((prevState) => {
      if (checked) {
        return { ...prevState, subjects: [...prevState.subjects, value] };
      } else {
        return {
          ...prevState,
          subjects: prevState.subjects.filter((subject) => subject !== value),
        };
      }
    });
  };
  const handleEditSubjectChange = (e) => {
    const { value, checked } = e.target;

    setEditTest((prevState) => {
      const subjects = prevState.subjects || [];

      if (checked) {
        return { ...prevState, subjects: [...subjects, value] };
      } else {
        return {
          ...prevState,
          subjects: subjects.filter((subject) => subject !== value),
        };
      }
    });
  };
  const handleDeleteSubject = (subjectToDelete) => {
    const updatedSubjects = editTest.subjects.filter(
      (subject) => subject !== subjectToDelete
    );

    setEditTest((prevState) => ({
      ...prevState,
      subjects: updatedSubjects,
    }));
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }
  if (!Array.isArray(tests) || tests.length === 0) {
    return <p>No tests available.</p>;
  }
  return (
    <div className="space-y-4">
      <ToastContainer />
      <div className="flex items-center justify-between px-4 gap-10 h-[70px]">
      <div className="text-24px font-medium">Test</div>
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
          <div className="flex bg-[#5D5FEF] pr-3 pl-2 text-white py-1 rounded-r-lg gap-2 ">
           
          <div>
          <img
            onClick={() => {
              setSearchActive(!searchActive);
            }}
            className="duration-100 h-[30px] hover:scale-125 "
            src="/search.svg"
            alt=""
          />
          </div>
          <div className="mt-[2px]">
            Serach
          </div>
          </div>
        </div>
        
        <div className="flex items-center bg-[#5D5FEF] rounded-lg">
          <div className="text-3xl text-white pl-2 font-light pb-[2px]">
+
          </div>
          <div>
        <button
          onClick={handleOpenDialog}
          className=" h-[40px] w-fit p-2  text-white rounded-md "
        >
          Create Test
        </button>
          </div>
        </div>
      </div>

      {isEditDialogOpen && (
        <EditTestModal
          isOpen={isEditDialogOpen}
          handleClose={handleCloseEditDialog}
          editTest={editTest}
          teachers={teachers}
          handleEditInputChange={handleEditInputChange}
          handleTeacherSelect={handleTeacherSelect}
          handleEditTest={handleEditTest}
          handleDeleteSubject={handleDeleteSubject}
          handleEditSubjectChange={handleEditSubjectChange}
        />
      )}

      {isDialogOpen && (
        <AddTestDialog
          isOpen={isDialogOpen}
          newTest={newTest}
          teachers={teachers}
          handleInputChange={handleInputChange}
          handleTeacherSelect={handleTeacherSelect}
          handleSubjectChange={handleSubjectChange}
          handleAddTest={handleAddTest}
          handleCloseDialog={() => setIsDialogOpen(false)}
        />
      )}
      <TestTable
        expandedRows={expandedRows}
        getFirst50Words={getFirst50Words}
        handleAddQuestions={handleAddQuestions}
        handleOpenEditDialog={handleOpenEditDialog}
        results={results}
        searchActive={searchActive}
        tests={tests}
        toggleReadMore={toggleReadMore}
      />
    </div>
  );
};

export default TestPage;
