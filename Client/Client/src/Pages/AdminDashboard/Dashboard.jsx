import React, { useState } from "react";
import { HiMenu } from "react-icons/hi";
import Sidebar from "../../compontents/SideBarComponent";
import DepartmentComponent from "../../compontents/DashboardComponents/DepartmentComponent";
import CreatingTaskComponent from "../../compontents/DashboardComponents/CreatingTaskComponent";
import TaskAnalyzeComponent from "../../compontents/DashboardComponents/TaskAnalyzeConponent";
import DailyTaskComponent from "../../compontents/DashboardComponents/DailyTaskComponent";
import { useLocation } from "react-router-dom";
import CommngSoonComponent from "../../compontents/CommingSoon/CommngSoonComponent";
import UserProfile from "../../compontents/ProfileManagement/UserProfile";
import AttendanceLayout from "../Attendance/AttendanceLayout";
import LeaveModule from "../LeavePage/LeaveModule";
import AttendanceAdmin from "../Attendance/Admin/AttendanceAdmin";
import AdminApplication from "../../compontents/Carrier/AdminApplication";
import UserCareerPage from "../../compontents/Carrier/UserCareerPage";
import AdminLeavePage from "../../compontents/Leave/Admin/AdminLeavePage";
import ImpNotesPage from "../../compontents/ImpNotes/ImpNotespage";
import DashboardAdmin from "../../compontents/CommingSoon/DashboradAdmin";
import ScrollToTopButton from "../../compontents/common/ScrollToTopButton";
import DashboardAdminaage from "../../compontents/CommingSoon/DashboardAdminaage";

const Dashboard = () => {
  const location = useLocation();
  const { name, email, role } = location.state || {};
  const isAdmin = role === "admin" && email === "ematixsolutions@gmail.com";

  const [activeComponent, setActiveComponent] = useState(() =>
    isAdmin ? "department" : "dashboard-user"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderComponent = () => {
    if (isAdmin) {
      switch (activeComponent) {
        case "department":
          return <DepartmentComponent />;
        case "create-task":
          return <CreatingTaskComponent />;
        case "task-analyze":
          return <TaskAnalyzeComponent />;
        case "dashboard-admin":
          return <DashboardAdminaage />;
        case "attendance-admin":
          return <AttendanceAdmin />;
        case "leave-admin":
          return <AdminLeavePage />;
        case "career-admin":
          return <AdminApplication />;
        case "notes":
          return <ImpNotesPage />;
        default:
          return <div className="text-gray-500">Select a section</div>;
      }
    } else {
      switch (activeComponent) {
        case "daily-task":
          return <DailyTaskComponent />;
        case "dashboard-user":
          return <DashboardAdmin />;
        case "update-password":
          return <UserProfile />;
        case "attendance":
          return <AttendanceLayout />;
        case "leaves":
          return <LeaveModule />;
        case "carrier-ApplyFrom":
          return <UserCareerPage />;
        default:
          return <div className="text-gray-500">Select a section</div>;
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isAdmin={isAdmin}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        setActiveComponent={setActiveComponent}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto p-2 md:p-6">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-800"
          >
            <HiMenu size={28} />
          </button>
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>

        {/* Important: wrapping main content to avoid shrinkage */}
        <div className="w-full flex-1">{renderComponent()}</div>
      </div>

      {/* <ScrollToTopButton /> */}
    </div>
  );
};

export default Dashboard;
