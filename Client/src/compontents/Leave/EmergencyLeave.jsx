import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import customFetch from "../../utils/customFetch";

const EmergencyLeave = ({ onLeaveSubmitted }) => {
  const [todayDate, setTodayDate] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const leaveTypes = ["casual", "sick", "earned"];

  useEffect(() => {
    const today = new Date();
    const formatted = today.toISOString().split("T")[0];
    setTodayDate(formatted);
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await customFetch.get("/auth/login/user");
      const userId = response.data.user.userId;
      setCurrentUser(userId);
    } catch (error) {
      console.error(error);
      toast.error("Failed to get current user info.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async () => {
    if (!leaveType || !reason || !assignedTo) {
      toast.error("Please fill all fields before submitting.");
      return;
    }

    if (!currentUser) {
      toast.error("User not loaded yet. Please wait.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("dateOfLeave", todayDate);
      formData.append("leaveType", "emergency");
      formData.append("reason", reason);
      formData.append("assignedTo", assignedTo);

      if (documentFile) {
        formData.append("document", documentFile);
      }

      setIsUploading(true);

      await customFetch.post("/leave", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Emergency leave submitted successfully!");

      setLeaveType("");
      setReason("");
      setAssignedTo("");
      setDocumentFile(null);

      if (onLeaveSubmitted) onLeaveSubmitted();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit emergency leave.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6 relative">
      <h2 className="text-2xl font-bold text-center text-red-700">
        Emergency Leave
      </h2>

      <div>
        <label className="block mb-1 font-medium">Date of Leave (Today):</label>
        <input
          type="text"
          value={formatDate(todayDate)}
          readOnly
          className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100"
        />
      </div>

      <div className="text-lg text-center text-green-700 font-semibold">
        Total Leave Days: 1
      </div>

      <div>
        <label className="block mb-1 font-medium">Leave Type:</label>
        <select
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
        >
          <option value="">-- Select Type --</option>
          {leaveTypes.map((type, i) => (
            <option key={i} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Reason for Leave:</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows="3"
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Upload Supporting Document:
        </label>
        <input
          type="file"
          onChange={(e) => setDocumentFile(e.target.files[0])}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
        {documentFile && (
          <p className="text-sm text-gray-600 mt-1">
            File: {documentFile.name}
          </p>
        )}
        {isUploading && (
          <p className="text-blue-600 text-sm mt-2">
            Uploading document, please wait...
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Work Assigned To:</label>
        <input
          type="text"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
          placeholder="Enter name of person assigned"
        />
      </div>

      <div className="text-center pt-4">
        <button
          onClick={handleSubmit}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default EmergencyLeave;
