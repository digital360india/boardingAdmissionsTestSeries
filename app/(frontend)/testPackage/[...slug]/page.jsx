"use client";
import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { FiPhoneCall } from "react-icons/fi";
import Loading from "@/app/loading";
import TestCard from "@/components/frontend/TestCard";
import { TestSeriesContext } from "@/providers/testSeriesProvider";
import { TestContext } from "@/providers/testProvider";
import { toast } from "react-toastify";

const TestPackagePage = () => {
  const { allTests } = useContext(TestSeriesContext);
  const { testPackages } = useContext(TestContext);
  const id = usePathname().split("/").pop();
  const [packageData, setPackageData] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (!id) {
      toast.error("ID not found");
      return;
    }

    const fetchDataFromProviders = () => {
      const packageData = testPackages.find((pkg) => pkg.id === id);
      if (packageData) {
        setPackageData(packageData);
        const filteredTests = allTests.filter((test) =>
          packageData.tests.includes(test.id)
        );
        setTests(filteredTests);
      } else {
        setError("Package not found");
      }
      setLoading(false);
    };

    // Wait until testPackages and allTests are populated
    if (testPackages.length > 0 && allTests.length > 0) {
      fetchDataFromProviders();
    }
  }, [id, testPackages, allTests]);

  const handleEnrollClick = () => {
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const leadDoc = doc(db, "leads", formData.email); // Use email as a unique identifier
      await setDoc(leadDoc, formData); // Save form data to Firestore
      setShowForm(false); // Close the form
      setFormData({ name: "", phonenumber: "", email: "" }); // Reset form
      alert("Enrollment successful!"); // Optional: Notify user
    } catch (error) {
      console.error("Error saving lead: ", error);
      alert("Enrollment failed. Please try again."); // Optional: Notify user
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!packageData) {
    return <div className="text-center">No package data available.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col pb-20">
      <div className="relative mb-10">
        <img
          src={packageData.packageImage}
          className="w-full h-[400px] object-cover rounded-b-lg"
          alt="Test Package Banner"
        />
        <div className="absolute top-20 left-1/2 w-[400px] md:w-[600px] flex-col justify-center items-center transform -translate-x-1/2 bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800">
            {packageData.packageName}
          </h1>
          <p className="mt-2 text-gray-600">{packageData.testDescription}</p>
          <p className="mt-2 text-gray-800 font-semibold">
            Price: ₹{packageData.price}
          </p>
          <p className="mt-1 text-gray-800 font-semibold">
            Discounted Price: ₹{packageData.discountedPrice}
          </p>
          <p className="mt-1 text-gray-800">
            Students Enrolled: {packageData.studentsEnrolled}
          </p>
          <button
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            onClick={handleEnrollClick}
          >
            Enroll Now
          </button>
          <div className="flex items-center mt-4">
            <FiPhoneCall className="text-green-600" />
            <span className="text-green-700 ml-2">Contact Us</span>
          </div>
        </div>
      </div>

      {/* Enrollment Form Popup */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <form
            className="bg-white p-8 rounded-lg shadow-lg w-[300px] md:w-[400px]"
            onSubmit={handleSubmit}
          >
            <h2 className="text-xl font-bold mb-4">Enroll Now</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border rounded p-2"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mx-auto px-4 flex-grow">
        <h2 className="text-2xl font-semibold mt-6 text-gray-800">
          Available Tests
        </h2>
        <ul className="mt-4 space-y-4">
          {tests.map((test) => (
            <TestCard key={test.id} test={test} isEnrolled={isEnrolled} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestPackagePage;
