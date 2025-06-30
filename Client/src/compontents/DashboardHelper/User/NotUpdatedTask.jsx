import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../../../utils/customFetch";

const NotUpdatedTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // 1) Get current logged-in user details
        const userRes = await customFetch.get("/auth/login/user");
        const userId = userRes.data.user.id || userRes.data.user.userId;

        // 2) Get all assigned tasks & updates
        const [assignRes, updateRes] = await Promise.all([
          customFetch.get("/TaskAssign"),
          customFetch.get("/user/Taskupdate"),
        ]);

        const assigned = assignRes.data.tasks || [];
        const updates = updateRes.data.updates || [];

        // 3) Get all task IDs that were updated
        const updatedTaskIds = updates.map((u) => u.taskId?._id);

        // 4) Filter tasks assigned to current user AND not updated
        const userNotUpdatedTasks = assigned.filter(
          (task) =>
            task.employeeId?._id === userId &&
            !updatedTaskIds.includes(task._id)
        );

        setTasks(userNotUpdatedTasks);
      } catch (error) {
        toast.error("Failed to fetch not updated tasks for you.");
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="bg-white shadow rounded-xl p-4 min-h-[100px] overflow-auto">
      <h2 className="text-lg font-semibold mb-4">🕒 Your Not Updated Tasks</h2>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-4 py-2">S.No</th>
            <th className="border px-4 py-2">Project</th>
            <th className="border px-4 py-2">Task Title</th>
            <th className="border px-4 py-2">Due Date</th>
            <th className="border px-4 py-2">Priority</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-gray-500 py-6">
                🎉 You have updated all your tasks!
              </td>
            </tr>
          ) : (
            tasks.map((task, index) => (
              <tr key={task._id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">
                  {task.projectId?.project_name || "N/A"}
                </td>
                <td className="border px-4 py-2">{task.title}</td>
                <td className="border px-4 py-2">
                  {new Date(task.dueDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      task.taskPriority === "Priority"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {task.taskPriority}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NotUpdatedTasks;
