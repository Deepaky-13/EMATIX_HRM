import React, { useEffect, useState } from "react";
import UserHolidayCalendar from "../DashboardHelper/User/UserDashboardcalender";
import DailyTaskParent from "../DashboardHelper/User/DailyTaskPage";
import Leave from "../DashboardHelper/User/LeaveComponent";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import CheckInOutToggle from "../ProfileManagement/CheckInOutToggle";

const DashboardAdmin = () => {
  const [employees, setEmployees] = useState([]);
  const [roleData, setRoleData] = useState(null);
  const [notes, setNotes] = useState([]);

  // Fetch employee and role details
  useEffect(() => {
    const fetchEmployeeAndRole = async () => {
      try {
        const res = await customFetch.get("/auth/login/user");
        const user = res.data.user;
        setEmployees([user]); // Store as array to map later

        const roleRes = await customFetch.get(
          `/role/${user.id || user.userId}`
        );
        setRoleData(roleRes.data.role);
      } catch (error) {
        toast.error("Unable to retrieve employee or role data");
      }
    };
    fetchEmployeeAndRole();
  }, []);
  <style>
    {`
    .marquee-container {
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 3rem; /* or whatever height you want */
    }
    .marquee-content {
      position: absolute;
      will-change: transform;
      white-space: nowrap;
      animation: marquee 25s linear infinite;
    }
    .marquee-content:hover {
      animation-play-state: paused;
    }
    @keyframes marquee {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
  `}
  </style>;

  // Fetch notes for marquee section
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await customFetch.get("/note");
        setNotes(res.data || []);
        console.log(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Unable to fetch notes");
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col gap-6 px-0 py-1 bg-gradient-to-br from-gray-100 to-blue-50 overflow-x-hidden">
      {/* 1. Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between h-auto md:h-[70px]">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide mb-2 md:mb-0">
          🚀 Welcome to HRM Application
        </h1>

        <div className="p-0 rounded">
          <CheckInOutToggle />
        </div>
      </div>

      {/* 2. Dynamic Notes Section */}
      <div className="marquee-container bg-yellow-100 rounded-xl shadow-md border border-yellow-300">
        <div className="marquee-content text-yellow-800 font-semibold text-lg px-4 py-2">
          {notes.length > 0 ? (
            notes.map((note, idx) => (
              <span key={note._id} className="mr-12">
                🔔 <strong>{note.agenda}:</strong> {note.description}
              </span>
            ))
          ) : (
            <span>🔔 No important notes available at the moment.</span>
          )}
        </div>
      </div>

      {/* 3. Employee Details + Calendar */}
      <div className="flex flex-wrap gap-6">
        {/* Employee Details */}
        <div className="flex-1 bg-white shadow-md rounded-2xl p-5 min-w-[300px]">
          <h2 className="text-xl font-bold mb-3 border-b pb-2 text-blue-700">
            👤 Employee Details
          </h2>
          {roleData ? (
            <div className="space-y-1 mt-2 text-gray-700">
              <p>
                <strong>Employee ID:</strong> {roleData.empId}
              </p>
              <p>
                <strong>Name:</strong> {roleData.name}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {roleData.DOB
                  ? new Date(roleData.DOB).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>
              <p>
                <strong>Role:</strong> {roleData.role}
              </p>
              <p>
                <strong>Department:</strong>{" "}
                {roleData.departmentId?.department_name}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Loading employee details...</p>
          )}
        </div>

        {/* Holiday Calendar */}
        <div className="flex-1 bg-white shadow-md rounded-2xl p-5 min-w-[300px]">
          <h2 className="text-xl font-bold mb-3 border-b pb-2 text-blue-700">
            📅 Holiday Calendar
          </h2>
          <UserHolidayCalendar />
        </div>
      </div>

      {/* 4. Daily Task Table */}
      <div className="bg-white shadow-md rounded-2xl p-6 overflow-auto min-h-[400px]">
        <h2 className="text-xl font-bold mb-4 text-green-700">📋 Daily Task</h2>
        <DailyTaskParent />
      </div>

      {/* 5. Leave Section */}
      <div className="bg-white shadow-md rounded-2xl p-6 overflow-auto min-h-[400px]">
        <h2 className="text-xl font-bold mb-4 text-red-700">📝 Leave</h2>
        <Leave />
      </div>
    </div>
  );
};

export default DashboardAdmin;
