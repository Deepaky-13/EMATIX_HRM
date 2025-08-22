import React, { useState, useEffect } from "react";
import customFetch from "../../utils/customFetch";
import PlannedLeaveTable from "../../compontents/Leave/PlannedLeaveTable";
import LeaveFormModal from "../../compontents/Leave/LeaveFormModal";

const LeaveDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      const res = await customFetch.get("/auth/login/user");
      const userId = res.data.user.userId;
      setCurrentUser(userId);
      fetchLeaves(userId);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeaves = async (userId) => {
    try {
      const res = await customFetch.get(`/leave/user/${userId}`);
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleLeaveSubmit = () => {
    if (currentUser) fetchLeaves(currentUser);
    setModalOpen(false); // close modal after submission
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Leave Dashboard</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          Apply Leave
        </button>
      </div>

      <PlannedLeaveTable leaves={leaves} />

      {modalOpen && (
        <LeaveFormModal
          onClose={() => setModalOpen(false)}
          onLeaveSubmitted={handleLeaveSubmit}
        />
      )}
    </div>
  );
};

export default LeaveDashboard;
