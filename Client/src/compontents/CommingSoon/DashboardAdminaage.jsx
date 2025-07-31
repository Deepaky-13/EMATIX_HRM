import React, { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

const DashboardAdminaage = () => {
  const [leaves, setLeaves] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState("");

  // Live Date & Time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setCurrentDateTime(now.toLocaleString("en-IN", options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch today's approved leaves for ALL employees
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await customFetch.get("/leave");
        const allLeaves = res.data || [];
        console.log("all leaves", allLeaves);

        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);

        const filtered = allLeaves.filter((leave) => {
          if (!["Approved", "Applied"].includes(leave.status)) return false;

          const today = new Date().toISOString().slice(0, 10);

          const startDate = leave.startDate
            ? new Date(leave.startDate).toISOString().slice(0, 10)
            : null;
          const endDate = leave.endDate
            ? new Date(leave.endDate).toISOString().slice(0, 10)
            : null;
          const dateOfLeave = leave.dateOfLeave
            ? new Date(leave.dateOfLeave).toISOString().slice(0, 10)
            : null;

          return (
            // planned leaves
            (startDate && endDate && today >= startDate && today <= endDate) ||
            // single-day emergency leaves
            (dateOfLeave && today === dateOfLeave)
          );
        });
        

        setLeaves(filtered);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch leaves");
      }
    };

    fetchLeaves();
  }, []);

  // Fetch today's tasks assigned to ANY employee
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await customFetch.get("/TaskAssign"); // your endpoint for all tasks
        const allTasks = res.data.tasks || [];
        console.log(allTasks);

        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);

        const filtered = allTasks.filter((task) => {
          const assignedDate = task.createdAt
            ? new Date(task.createdAt).toISOString().slice(0, 10)
            : null;
          return assignedDate === todayStr;
        });

        setTasks(filtered);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch daily tasks");
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen flex flex-col gap-6 px-0 py-1 bg-gradient-to-br from-gray-100 to-blue-50 overflow-x-hidden">
      {/* Marquee animation */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 15s linear infinite;
            white-space: nowrap;
            display: inline-block;
            min-width: max-content;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      {/* 1. Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between h-auto md:h-[70px]">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide mb-2 md:mb-0">
          🚀 Admin Dashboard
        </h1>
        <p className="text-sm md:text-base font-medium text-gray-200">
          {currentDateTime}
        </p>
      </div>

      {/* 2. Marquee */}
      {/* <div className="relative bg-yellow-100 rounded-xl h-12 overflow-hidden shadow-md border border-yellow-300">
        <div className="whitespace-nowrap animate-marquee text-yellow-800 font-semibold text-lg px-4 py-3 transform -translate-y-1/2">
          🔔 Admin Notice: Monitor today's leaves and tasks closely • Reminder:
          Approve pending tasks promptly 🔔
        </div>
      </div> */}

      {/* 3. Today's Approved Leaves */}
      <div className="bg-white shadow-md rounded-2xl p-6 overflow-auto min-h-[300px]">
        <h2 className="text-xl font-bold mb-4 text-red-700">
          📝 Today’s Approved Leaves
        </h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">Employee Name</th>
              <th className="border px-4 py-2">Start Date</th>
              <th className="border px-4 py-2">End Date</th>
              <th className="border px-4 py-2">Emergency Date</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6">
                  ✅ No active approved leaves today!
                </td>
              </tr>
            ) : (
              leaves.map((leave, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    {leave.userId?.name || "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {leave.startDate
                      ? new Date(leave.startDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {leave.endDate
                      ? new Date(leave.endDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {leave.dateOfLeave
                      ? new Date(leave.dateOfLeave).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Today's Assigned Tasks */}
      <div className="bg-white shadow-md rounded-2xl p-6 overflow-auto min-h-[300px]">
        <h2 className="text-xl font-bold mb-4 text-green-700">
          📋 Today’s Assigned Tasks
        </h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">Employee</th>
              <th className="border px-4 py-2">Task Name</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6">
                  ✅ No tasks assigned today!
                </td>
              </tr>
            ) : (
              tasks.map((task, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    {task.employeeId?.name || "-"}
                  </td>
                  <td className="border px-4 py-2">{task.title}</td>
                  <td className="border px-4 py-2">{task.description}</td>
                  <td className="border px-4 py-2">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardAdminaage;
