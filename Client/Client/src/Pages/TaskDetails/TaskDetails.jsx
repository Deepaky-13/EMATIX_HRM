import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TaskDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const taskData = location.state;

  const task = taskData?.taskId || taskData?.task || {};
  const status = taskData?.status || "Not updated";
  const report = taskData?.report || "—";

  const employee = task?.employeeId || {};
  const department = task?.departmentId || {};
  const project = task?.projectId || {};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Task Details</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back
          </button>
        </div>

        <div className="space-y-4 text-gray-700">
          <div>
            <strong>Project:</strong> {project?.project_name || "—"}
          </div>
          <div>
            <strong>Task Title:</strong> {task?.title || "—"}
          </div>
          <div>
            <strong>Description:</strong> {task?.description || "—"}
          </div>
          <div>
            <strong>Due Date:</strong>{" "}
            {task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
          </div>
          <div>
            <strong>Priority:</strong> {task?.taskPriority || "—"}
          </div>
          <div>
            <strong>Assigned To:</strong> {employee?.name || "—"}
          </div>
          <div>
            <strong>Role:</strong> {employee?.role || "—"}
          </div>
          <div>
            <strong>Department:</strong> {department?.department_name || "—"}
          </div>
          <div>
            <strong>Status:</strong> {status}
          </div>
          <div>
            <strong>Report:</strong> {report}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
