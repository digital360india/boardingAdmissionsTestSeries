import React, { useState } from "react";
import Modal from "react-modal";

const Achievements = ({
  formData,
  addAchievement,
  deleteAchievement,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    studentName: "",
    achievement: "",
    year: "",
    studentImage: null,
  });

  const handleNewAchievementChange = (field, value) => {
    setNewAchievement({ ...newAchievement, [field]: value });
  };
  const submitNewAchievement = () => {
    addAchievement(newAchievement); 
    setNewAchievement({
      studentName: "",
      achievement: "",
      year: "",
      studentImage: null,
    }); // Reset fields
    setIsAddModalOpen(false); // Close the modal
  };

  return (
    <div className="space-y-2">
      <label className="block text-gray-700 font-medium">
        Our Achievements:
      </label>
      <div className="flex overflow-x-auto space-x-4 mb-4">
        {formData.achievements.map((achievement, index) => (
          <div key={index} className="flex-shrink-0 border p-3 rounded-lg mb-4">
            <p className="font-semibold">
              Student Name: {achievement.studentName}
            </p>
            <p>Achievement: {achievement.achievement}</p>
            <p>Year: {achievement.year}</p>
            {achievement.studentImage && (
              <img
                src={achievement.studentImage}
                alt="Student Achievement"
                className="w-32 h-32 object-cover mt-2"
              />
            )}
            <button
              type="button"
              onClick={() => deleteAchievement(index)}
              className="mt-2 px-2 py-1 bg-red-500 hover:bg-red-600 text-white font-medium rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        className="px-4 mx-5 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded shadow"
      >
        Add Achievement
      </button>
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "80%",
            maxWidth: "600px",
          },
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
          },
        }}
        contentLabel="Add Achievement Modal"
      >
        <h2 className="text-lg font-bold">Add Achievement</h2>
        <button
          onClick={() => setIsAddModalOpen(false)}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          Close
        </button>
        <div className="mt-4 space-y-2">
          <input
            type="text"
            placeholder="Student Name"
            value={newAchievement.studentName}
            onChange={(e) =>
              handleNewAchievementChange("studentName", e.target.value)
            }
            className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Achievement"
            value={newAchievement.achievement}
            onChange={(e) =>
              handleNewAchievementChange("achievement", e.target.value)
            }
            className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Year"
            value={newAchievement.year}
            onChange={(e) => handleNewAchievementChange("year", e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleNewAchievementChange("studentImage", e.target.files[0])
            }
            className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {newAchievement.studentImage ? (
          <img src={newAchievement.studentImage} className="h-20 w-20" />
        ) : (
          <></>
        )}
        <button
          type="button"
          onClick={submitNewAchievement}
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded"
        >
          Save Achievement
        </button>
      </Modal>
    </div>
  );
};

export default Achievements;
