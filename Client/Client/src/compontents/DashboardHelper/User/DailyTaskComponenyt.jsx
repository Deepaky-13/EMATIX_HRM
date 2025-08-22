import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../../../utils/customFetch";

const DailyTaskComponent = () => {
  const [todayTasks, setTodayTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // 1) Get current user
        const userRes = await customFetch.get("/auth/login/user");
        const userId = userRes.data.user.userId;
        console.log(userRes.data.user.userId);

        // 2) Fetch assigned tasks
        const assignRes = await customFetch.get("/TaskAssign");
        const assignedTasks = assignRes.data.tasks || [];
        console.log(assignedTasks);

        // 3) Filter assigned tasks to the current user AND created today
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const filtered = assignedTasks.filter((task) => {
          const createdDate = new Date(task.createdAt)
            .toISOString()
            .slice(0, 10);
          return task.employeeId?._id === userId && createdDate === today;
        });

        setTodayTasks(filtered);
      } catch (error) {
        toast.error("Failed to fetch today’s tasks");
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="bg-white shadow rounded-xl p-4 min-h-[100px] overflow-auto">
      <h2 className="text-lg font-semibold mb-4">
        📅 Your Today’s Assigned Tasks
      </h2>

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
          {todayTasks.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-gray-500 py-6">
                ✅ You don’t have any new tasks assigned today!
              </td>
            </tr>
          ) : (
            todayTasks.map((task, index) => (
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

export default DailyTaskComponent;
