import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";

const PlannedLeaveForm = ({ onLeaveSubmitted }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [assignedTo, setAssignedTo] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const leaveTypes = ["casual", "sick", "earned"];
  const minStartDate = new Date();
  minStartDate.setDate(minStartDate.getDate() + 3);

  useEffect(() => {
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

  const handleDateChange = (type, date) => {
    if (type === "start") {
      setStartDate(date);
      if (endDate && date <= endDate) {
        const days = Math.ceil((endDate - date) / (1000 * 60 * 60 * 24)) + 1;
        setTotalDays(days);
      } else {
        setTotalDays(0);
      }
    } else if (type === "end") {
      setEndDate(date);
      if (startDate && date >= startDate) {
        const days = Math.ceil((date - startDate) / (1000 * 60 * 60 * 24)) + 1;
        setTotalDays(days);
      } else {
        setTotalDays(0);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate || !leaveType || !reason || !assignedTo) {
      toast.error(
        "Please fill all fields before submitting, including Assigned To."
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("startDate", startDate.toISOString());
      formData.append("endDate", endDate.toISOString());
      formData.append("totalDays", totalDays);
      formData.append("leaveType", "planned");
      formData.append("reason", reason);
      formData.append("assignedTo", assignedTo);

      if (documentFile) {
        formData.append("document", documentFile);
      }

      setIsUploading(true);

      await customFetch.post("/leave", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Leave application submitted successfully!");
      resetForm();
      onLeaveSubmitted?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit leave application.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setStartDate(null);
    setEndDate(null);
    setTotalDays(0);
    setLeaveType("");
    setReason("");
    setAssignedTo("");
    setDocumentFile(null);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto p-6 bg-white rounded shadow relative">
      <h2 className="text-2xl font-bold text-center text-blue-700">
        Planned Leave
      </h2>

      <div>
        <label className="block mb-1 font-medium">
          Start Date (after 3 days):
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => handleDateChange("start", date)}
          dateFormat="dd/MM/yyyy"
          minDate={minStartDate}
          className="w-full border border-gray-300 rounded px-4 py-2"
          placeholderText="Select start date"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => handleDateChange("end", date)}
          dateFormat="dd/MM/yyyy"
          minDate={startDate || minStartDate}
          className="w-full border border-gray-300 rounded px-4 py-2"
          placeholderText="Select end date"
        />
      </div>

      <div className="text-lg text-center text-green-700 font-semibold">
        Total Leave Days: {totalDays}
      </div>

      <div>
        <label className="block mb-1 font-medium">Leave Type:</label>
        <select
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
        >
          <option value="">-- Select Type --</option>
          {leaveTypes.map((type, index) => (
            <option key={index} value={type}>
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
          rows="4"
          className="w-full border border-gray-300 rounded px-4 py-2"
          placeholder="Provide your reason for leave"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Assigned To:</label>
        <input
          type="text"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
          placeholder="Enter manager/supervisor"
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
            Selected File: {documentFile.name}
          </p>
        )}
        {isUploading && (
          <p className="text-blue-600 text-sm mt-2">
            Uploading document, please wait...
          </p>
        )}
      </div>

      <div className="text-center pt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default PlannedLeaveForm;
