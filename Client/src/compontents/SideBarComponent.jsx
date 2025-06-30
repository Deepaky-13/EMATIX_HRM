import React, { useState, useEffect } from "react";
import CheckInOutToggle from "../compontents/ProfileManagement/CheckInOutToggle";
import customFetch from "../utils/customFetch";
import { FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBuilding,
  FaTasks,
  FaChartLine,
  FaUserCheck,
  FaCalendarAlt,
  FaBriefcase,
  FaStickyNote,
  FaLock,
} from "react-icons/fa";

const Sidebar = ({ isAdmin, setActiveComponent, isOpen, setIsOpen }) => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const handleClick = (component) => {
    setActiveComponent(component);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await customFetch.get("/auth/login/logout");
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error in log out");
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await customFetch.get("/auth/login/user", {
          withCredentials: true,
        });
        setUserInfo(res.data.user);
      } catch (err) {
        console.error("Failed to fetch current user", err);
      }
    };

    getUserInfo();
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar content */}
      <div
        className={`relative top-0 left-0 z-50 text-white
    transform transition-transform duration-300 ease-in-out
    md:translate-x-0
    p-4 flex flex-col
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    w-[200px] min-w-[200px] max-w-[200px]
  `}
        style={{ backgroundColor: "#0133b0" }}
      >
        <h2 className="text-xl font-bold mb-6">
          Welcome{userInfo?.name ? `, ${userInfo.name}` : ""}
        </h2>

        <div className="space-y-2 flex-1">
          {isAdmin ? (
            <>
              <button
                onClick={() => handleClick("dashboard-admin")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded"
              >
                <FaTachometerAlt /> Dashboard
              </button>
              <button
                onClick={() => handleClick("department")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded"
              >
                <FaBuilding /> Department
              </button>
              <button
                onClick={() => handleClick("create-task")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded"
              >
                <FaTasks /> Create Task
              </button>
              <button
                onClick={() => handleClick("task-analyze")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded"
              >
                <FaChartLine /> Task Analyze
              </button>
              <button
                onClick={() => handleClick("attendance-admin")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded"
              >
                <FaUserCheck /> Attendance
              </button>
              <button
                onClick={() => handleClick("leave-admin")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded"
              >
                <FaCalendarAlt /> Leaves
              </button>
              <button
                onClick={() => handleClick("career-admin")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded"
              >
                <FaBriefcase /> Career
              </button>
              <button
                onClick={() => handleClick("notes")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded"
              >
                <FaStickyNote /> Updates & Notes
              </button>
            </>
          ) : (
            <>
              {/* <div className="bg-gray-700 p-2 rounded">
                <CheckInOutToggle />
              </div> */}
              <button
                onClick={() => handleClick("dashboard-user")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded"
              >
                <FaTachometerAlt /> Dashboard
              </button>
              <button
                onClick={() => handleClick("daily-task")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded"
              >
                <FaTasks /> Daily Task
              </button>
              <button
                onClick={() => handleClick("attendance")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded"
              >
                <FaUserCheck /> Attendance
              </button>
              <button
                onClick={() => handleClick("leaves")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded"
              >
                <FaCalendarAlt /> Leave
              </button>
              <button
                onClick={() => handleClick("carrier-ApplyFrom")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded"
              >
                <FaBriefcase /> Apply Career
              </button>
              <button
                onClick={() => handleClick("update-password")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded"
              >
                <FaLock /> Update Password
              </button>
            </>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="absolute bottom-16 left-4 w-40 flex items-center gap-2 text-white hover:bg-gray-700 p-2 rounded transition duration-200"
        >
          <FiLogOut className="text-lg" />
          <span>Log out</span>
        </button>

        <p className="absolute bottom-4 left-4 text-xs text-gray-400">
          © 2025 Ematix Embedded & Software Solutions Inc.
        </p>
      </div>
    </>
  );
};

export default Sidebar;
