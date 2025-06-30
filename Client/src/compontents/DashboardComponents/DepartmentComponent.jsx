import React, { useState } from "react";
import DepartmentmodulePage from "../../Pages/AdminDashboard/DepartmentmodulePage";

const DepartmentComponent = () => {
  const [selectedType, setSelectedType] = useState("department");

  const buttons = [
    { label: "Department", value: "department" },
    { label: "Roles", value: "roles" },
    { label: "Project", value: "project" },
    { label: "Project Assign", value: "assign" },
  ];

  return (
    <div className=" p-5 flex-1">
      {/* Top Button Row */}
      <div className="flex gap-4 flex-wrap mb-8">
        {buttons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setSelectedType(btn.value)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              selectedType === btn.value
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Render dynamic section */}
      <div>
        <DepartmentmodulePage type={selectedType} />
      </div>
    </div>
  );
};

export default DepartmentComponent;
