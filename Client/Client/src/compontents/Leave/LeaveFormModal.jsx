import React, { useEffect, useState } from "react";
import PlannedLeaveForm from "../../compontents/Leave/PlanedLeaveForm";
import EmergencyLeave from "../../compontents/Leave/EmergencyLeave";

const LeaveFormModal = ({ onClose, onLeaveSubmitted }) => {
  const [activeTab, setActiveTab] = useState("planned");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="flex space-x-4 mb-6 justify-center">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "planned"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("planned")}
          >
            Planned Leave
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "emergency"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("emergency")}
          >
            Emergency Leave
          </button>
        </div>

        {activeTab === "planned" && (
          <PlannedLeaveForm onLeaveSubmitted={onLeaveSubmitted} />
        )}
        {activeTab === "emergency" && (
          <EmergencyLeave onLeaveSubmitted={onLeaveSubmitted} />
        )}
      </div>
    </div>
  );
};

export default LeaveFormModal;
