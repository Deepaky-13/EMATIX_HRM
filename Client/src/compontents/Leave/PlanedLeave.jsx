import React, { useState, useEffect } from "react";
import customFetch from "../../utils/customFetch";
import PlannedLeaveTable from "../../components/Leave/PlannedLeaveTable";
import LeaveFormModal from "../../components/Leave/LeaveFormModal"; // path may vary

const PlannedLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLeaves = async (userId) => {
    try {
      const response = await customFetch.get(`/leave/user/${userId}`);
      setLeaves(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await customFetch.get("/auth/login/user");
      const userId = response.data.user.userId;
      setCurrentUser(userId);
      fetchLeaves(userId);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleLeaveSubmit = () => {
    if (currentUser) {
      fetchLeaves(currentUser);
    }
    setIsModalOpen(false); // close modal after submission
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow space-y-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Planned Leave Dashboard
        </h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          onClick={() => setIsModalOpen(true)}
        >
          Apply Leave
        </button>
      </div>

      <PlannedLeaveTable leaves={leaves} />

      {isModalOpen && (
        <LeaveFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmitSuccess={handleLeaveSubmit}
        />
      )}
    </div>
  );
};

export default PlannedLeave;
