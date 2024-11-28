"use client";
import React, { useState, useEffect, useContext } from "react";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UserContext } from "@/providers/userProvider";
import Achievements from "@/components/admin/AchievementComponent";
import Loading from "@/app/loading";
import showError from "@/utils/functions/showError";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    about: "",
    bannerImageUrl: "",
    businessName: "",
    city: "",
    country: "",
    email: "",
    googleLocation: "",
    institutesAdvertisments: ["", ""],
    logo: "",
    achievements: [
      { studentName: "", achievement: "", year: "", studentImage: "" },
    ],
    address: "",
    phoneNumber: "",
    zipCode: "",
    termsAndConditions: "",
    privacyPolicy: "",
    returnPolicy: "",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const storage = getStorage();

  console.log(user);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (user?.id) {
        setFormData({
          about: user.about || "",
          bannerImageUrl: user.bannerImageUrl || "",
          businessName: user.businessName || "",
          city: user.city || "",
          country: user.country || "",
          email: user.email || "",
          googleLocation: user.googleLocation || "",
          institutesAdvertisments: user.institutesAdvertisments || ["", ""],
          logo: user.logo || "",
          achievements: user.ourAchievement || [
            {
              studentName: "",
              achievement: "",
              year: "",
              studentImage: "",
            },
          ],
          address: user.address || "",
          phoneNumber: user.phoneNumber || "",
          zipCode: user.zipCode || "",
          termsAndConditions: user.termsAndConditions || "",
          privacyPolicy: user.privacyPolicy || "",
          returnPolicy: user.returnPolicy || "",
        });
      }
    };

    fetchData();
    setLoading(false);
  }, [user?.id]);
  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAchievementChange = (index, field, value) => {
    const updatedAchievements = formData.achievements.map((achievement, i) => {
      if (i === index) {
        return { ...achievement, [field]: value };
      }
      return achievement;
    });

    setFormData((prevState) => ({
      ...prevState,
      achievements: updatedAchievements,
    }));
  };

  const addAchievement = async () => {
    try {
      const docRef = doc(db, "users", user?.id);
      const { studentName, achievement, year, studentImage } =
        formData.achievements[0];
      const newAchievement = { studentName, achievement, year, studentImage };
      await updateDoc(docRef, {
        achievements: arrayUnion(newAchievement),
      });
    } catch (error) {
      console.error("Error adding achievement:", error);
    }
  };

  const uploadFile = async (file, fieldName) => {
    const storageRef = ref(storage, `${fieldName}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const handleFileChange = async (event, fieldName) => {
    const file = event.target.files[0];
    if (!file || file.size <= 100 * 1024)
      return alert("Check File and File Size should be less than 100kb");
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      const { width, height } = img;
      let desiredDimensions;

      if (fieldName === "bannerImageUrl") {
        desiredDimensions = { width: 1200, height: 400 };
      } else if (fieldName === "logo") {
        desiredDimensions = { width: 100, height: 100 };
      } else {
        desiredDimensions = { width: 200, height: 200 };
      }
      if (desiredDimensions) {
        const { width: desiredWidth, height: desiredHeight } =
          desiredDimensions;

        if (width >= desiredWidth && height >= desiredHeight) {
          try {
            const fileURL = await uploadFile(file, fieldName);
            setFormData((prevState) => ({
              ...prevState,
              [fieldName]: fileURL,
            }));

            const docRef = doc(db, "users", user.id);
            await updateDoc(docRef, {
              [fieldName]: fileURL,
            });
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        } else {
          alert(
            `Image must be at least ${desiredWidth}x${desiredHeight} pixels.`
          );
        }
      }
    };

    img.onerror = () => {
      console.error("The file could not be loaded as an image.");
      event.target.value = "";
    };
  };
  const handleFileChangeForAchievement = async (event, index) => {
    const file = event.target.files[0];
    if (!file) return alert("No file selected.");

    if (file.size > 100 * 1024) {
      alert("File size should be less than 100 KB.");
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      const { width, height } = img;
      const desiredWidth = 150;
      const desiredHeight = 150;

      if (width >= desiredWidth && height >= desiredHeight) {
        try {
          const fileURL = await uploadFile(file, `achievementImage_${index}`);
          setFormData((prevState) => {
            const updatedAchievements = [...prevState.achievements];
            updatedAchievements[index].studentImage = fileURL;
            return {
              ...prevState,
              achievements: updatedAchievements,
            };
          });
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      } else {
        alert(
          `Image must be at least ${desiredWidth}x${desiredHeight} pixels.`
        );
      }
    };

    img.onerror = () => {
      console.error("The file could not be loaded as an image.");
      event.target.value = ""; // Reset input if the image fails to load
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "users", user.id);
      await updateDoc(docRef, formData);
      toast.success("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document:", error);
      showError(error.message);
    }
  };

  return (
    <>
    <ToastContainer />
    <div className="flex justify-center items-center min-h-screen ">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-8 bg-gray-200 shadow-md rounded-lg max-w-4xl w-full"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Institute Details
        </h2>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">About:</label>
          <input
            type="text"
            name="about"
            value={formData.about}
            onChange={handleChange}
            className="w-full  p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Business Name:
          </label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Banner Image (Image should be minimum Width = 1200px , Height =
            400px)
          </label>

          {formData.bannerImageUrl && (
            <img
              src={formData.bannerImageUrl}
              alt="Current Banner"
              className="w-full h-48 object-cover rounded-md mb-2"
            />
          )}

          <input
            type="file"
            accept="image/*"
            placeholder="File Size <= 100kb"
            onChange={(e) => handleFileChange(e, "bannerImageUrl")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Country:</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Google Location:
          </label>
          <input
            type="text"
            name="googleLocation"
            value={formData.googleLocation}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Logo (Minium size Height = 100 px, Width = 100 px)
          </label>

          {formData.logo && (
            <img
              src={formData.logo}
              alt="Current Logo"
              className="w-full h-24 object-contain rounded-md mb-2"
            />
          )}

          <input
            type="file"
            accept="image/*"
            placeholder="File Size <= 100kb"
            onChange={(e) => handleFileChange(e, "logo")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Achievements
          addAchievement={addAchievement}
          formData={formData}
          handleAchievementChange={handleAchievementChange}
          handleFileChangeForAchievement={handleFileChangeForAchievement}
        />

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Phone Number:
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Zip Code:</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Terms and Conditions (PDF):
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, "termsAndConditions")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formData.termsAndConditions && (
            <p className="text-green-600 mt-1">
              PDF Uploaded:{" "}
              <a
                href={formData.termsAndConditions}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View PDF
              </a>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Privacy Policy (PDF):
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, "privacyPolicy")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formData.privacyPolicy && (
            <p className="text-green-600 mt-1">
              PDF Uploaded:{" "}
              <a
                href={formData.privacyPolicy}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View PDF
              </a>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Return Policy (PDF):
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, "returnPolicy")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formData.returnPolicy && (
            <p className="text-green-600 mt-1">
              PDF Uploaded:{" "}
              <a
                href={formData.returnPolicy}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View PDF
              </a>
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200"
        >
          Update Data
        </button>
      </form>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">All Achievements</h2>
            {formData.achievements.map((achievement, index) => (
              <div key={index} className="space-y-2 border-b pb-3 mb-3">
                <p>
                  <strong>Student Name:</strong> {achievement.studentName}
                </p>
                <p>
                  <strong>Achievement:</strong> {achievement.achievement}
                </p>
                <p>
                  <strong>Year:</strong> {achievement.year}
                </p>
                {achievement.studentImage && (
                  <img
                    src={achievement.studentImage}
                    alt="Student Achievement"
                    className="w-24 h-24 object-cover mt-2"
                  />
                )}
              </div>
            ))}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded shadow"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
