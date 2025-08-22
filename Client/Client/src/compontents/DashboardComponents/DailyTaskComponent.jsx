import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import Modal from "../common/modelComponent";

const DailyTaskComponent = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({});
  const [reportModal, setReportModal] = useState({ open: false, taskId: null });
  const [reportText, setReportText] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterProject, setFilterProject] = useState("");

  useEffect(() => {
    const getUserAndTasks = async () => {
      try {
        const userRes = await customFetch.get("/auth/login/user");
        const userId = userRes.data?.user.userId;
        if (userId) {
          await fetchTasks(userId);
        } else {
          toast.error("User ID not found");
        }
      } catch (error) {
        toast.error("Unable to fetch user info");
      }
    };
    getUserAndTasks();
  }, []);

  const fetchTasks = async (userId) => {
    try {
      const response = await customFetch.get(`/TaskAssign/${userId}`);
      const sorted = [...response.data.tasks].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTasks(sorted);

      // Pre-fill formData with existing task status and report
      const initialFormData = {};
      sorted.forEach((task) => {
        initialFormData[task._id] = {
          status: task.status || "To-do",
          report: task.report || "",
        };
      });
      setFormData(initialFormData);
    } catch (error) {
      toast.error("Failed to load tasks");
    }
  };

  const handleChange = (taskId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value,
      },
    }));
  };

  const openReportModal = (taskId, currentValue = "") => {
    setReportText(currentValue);
    setReportModal({ open: true, taskId });
  };

  const closeReportModal = () => {
    setReportModal({ open: false, taskId: null });
    setReportText("");
  };

  const saveReportToForm = () => {
    const taskId = reportModal.taskId;
    if (!taskId) return;
    handleChange(taskId, "report", reportText);
    closeReportModal();
  };

  const handleSubmit = async (taskId) => {
    const { status, report } = formData[taskId] || {};
    if (!status || !report) {
      toast.error("Please select status and enter report");
      return;
    }

    try {
      await customFetch.post("/user/TaskUpdate", { taskId, status, report });
      toast.success("Report submitted successfully");
    } catch (err) {
      toast.error("Failed to submit report");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesTitle = task.title
      .toLowerCase()
      .includes(searchTitle.toLowerCase());
    const matchesDate = filterDate
      ? new Date(task.dueDate).toISOString().slice(0, 10) === filterDate
      : true;
    const matchesProject = filterProject
      ? task.projectId?.project_name
          ?.toLowerCase()
          .includes(filterProject.toLowerCase())
      : true;
    return matchesTitle && matchesDate && matchesProject;
  });

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-center text-3xl pb-8 text-center ">
        Daily Tasks
      </div>
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by Task Title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="border px-3 py-1 rounded w-full md:w-1/3"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border px-3 py-1 rounded w-full md:w-1/4"
        />
        <input
          type="text"
          placeholder="Filter by Project Name"
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="border px-3 py-1 rounded w-full md:w-1/3"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm md:text-base bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border">S.No</th>
              <th className="py-2 px-4 border">Project</th>
              <th className="py-2 px-4 border">Title</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Due Date</th>
              <th className="py-2 px-4 border">Priority</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Report</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => {
                const current = formData[task._id] || {};
                return (
                  <tr key={task._id} className="text-center hover:bg-gray-50">
                    <td className="py-2 px-4 border">{index + 1}</td>
                    <td className="py-2 px-4 border">
                      {task.projectId?.project_name || "—"}
                    </td>
                    <td className="py-2 px-4 border">{task.title}</td>
                    <td className="py-2 px-4 border">{task.description}</td>
                    <td className="py-2 px-4 border">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border">
                      <span
                        className={`text-sm font-semibold px-2 py-1 rounded-full ${
                          task.taskPriority === "Priority"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {task.taskPriority || "—"}
                      </span>
                    </td>
                    <td className="py-2 px-4 border">
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={formData[task._id]?.status || "To-do"}
                        onChange={(e) =>
                          handleChange(task._id, "status", e.target.value)
                        }
                      >
                        <option value="To-do">To-do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Hold">Hold</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() =>
                          openReportModal(
                            task._id,
                            formData[task._id]?.report || ""
                          )
                        }
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Add/View
                      </button>
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleSubmit(task._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Submit
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={reportModal.open}
        onClose={closeReportModal}
        title="Task Report"
      >
        <textarea
          rows={6}
          className="w-full border rounded px-3 py-2"
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
        />
        <div className="mt-3 flex justify-end gap-3">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-1 rounded"
            onClick={closeReportModal}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded"
            onClick={saveReportToForm}
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DailyTaskComponent;
