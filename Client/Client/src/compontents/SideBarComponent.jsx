import React, { useState, useEffect } from "react";
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
      {/* Mobile overlay when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          bg-[#74088C] text-white  
          w-56 min-w-[14rem] max-w-[14rem]
          flex flex-col
          p-4
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:static md:translate-x-0
          shadow-lg md:shadow-none
        `}
        aria-label="Sidebar navigation"
      >
        <h2 className="text-xl font-bold mb-6 truncate">
          Welcome{userInfo?.name ? `, ${userInfo.name}` : ""}
        </h2>

        {/* Scrollable menu */}
        <nav className="flex-1 overflow-y-auto space-y-2">
          {isAdmin ? (
            <>
              <button
                onClick={() => handleClick("dashboard-admin")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FaTachometerAlt /> Dashboard
              </button>
              <button
                onClick={() => handleClick("department")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FaBuilding /> Department
              </button>
              <button
                onClick={() => handleClick("create-task")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FaTasks /> Create Task
              </button>
              <button
                onClick={() => handleClick("task-analyze")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FaChartLine /> Task Analyze
              </button>
              <button
                onClick={() => handleClick("attendance-admin")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FaUserCheck /> Attendance
              </button>
              <button
                onClick={() => handleClick("leave-admin")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FaCalendarAlt /> Leaves
              </button>
              <button
                onClick={() => handleClick("career-admin")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FaBriefcase /> Career
              </button>
              <button
                onClick={() => handleClick("notes")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FaStickyNote /> Updates & Notes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleClick("dashboard-user")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FaTachometerAlt /> Dashboard
              </button>
              <button
                onClick={() => handleClick("daily-task")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FaTasks /> Daily Task
              </button>
              <button
                onClick={() => handleClick("attendance")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FaUserCheck /> Attendance
              </button>
              <button
                onClick={() => handleClick("leaves")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FaCalendarAlt /> Leave
              </button>
              <button
                onClick={() => handleClick("carrier-ApplyFrom")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FaBriefcase /> Apply Career
              </button>
              <button
                onClick={() => handleClick("update-password")}
                className="flex items-center gap-2 w-full text-left hover:bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FaLock /> Update Password
              </button>
            </>
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full mt-6 flex items-center justify-center gap-2 text-white hover:bg-gray-700 p-2 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <FiLogOut className="text-lg" />
          <span>Log out</span>
        </button>

        <p className="mt-auto text-center text-xs text-gray-400 pt-4">
          © 2025 Ematix Embedded & Software Solutions Inc.
        </p>
      </aside>
    </>
  );
};

export default Sidebar;
