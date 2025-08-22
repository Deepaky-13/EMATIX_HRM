import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "../common/modelComponent";
import DynamicForm from "../common/DynamicForm";
import { useNavigate } from "react-router-dom";

const TaskAnalyzeComponent = () => {
  const navigate = useNavigate();
  const [allTasks, setAllTasks] = useState([]);
  const [updatedTasks, setUpdatedTasks] = useState([]);
  const [notUpdatedTasks, setNotUpdatedTasks] = useState([]);
  const [activeView, setActiveView] = useState("all");
  const [formValues, setFormValues] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [searchAssignedTo, setSearchAssignedTo] = useState("");
  const [searchProject, setSearchProject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignRes, updateRes] = await Promise.all([
        customFetch.get("/TaskAssign"),
        customFetch.get("/user/Taskupdate"),
      ]);

      const assigned = assignRes.data.tasks || [];
      const updates = updateRes.data.updates || [];

      const updatedTaskIds = updates.map((u) => u.taskId?._id);
      const notUpdated = assigned.filter(
        (task) => !updatedTaskIds.includes(task._id)
      );

      setAllTasks(assigned);
      setUpdatedTasks(updates);
      setNotUpdatedTasks(notUpdated);
    } catch (err) {
      toast.error("Failed to fetch tasks data");
    }
  };

  const handleDelete = async (task) => {
    try {
      await customFetch.delete(`/TaskAssign/${task._id}`);
      toast.success("Task deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Error deleting the task");
    }
  };

  const openEditModal = (task) => {
    const taskObj = task.taskId || task;
    setSelectedTask(taskObj);
    setFormValues({
      title: taskObj.title,
      description: taskObj.description,
      dueDate: taskObj.dueDate.split("T")[0],
      taskPriority: taskObj.taskPriority,
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (!selectedTask) return;

    const payload = {
      ...data,
      employeeId: selectedTask.employeeId?._id || selectedTask.employeeId,
      departmentId: selectedTask.departmentId?._id || selectedTask.departmentId,
      projectId: selectedTask.projectId?._id || selectedTask.projectId,
    };

    try {
      await customFetch.patch(`/TaskAssign/${selectedTask._id}`, payload);
      toast.success("Task updated successfully");
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const formFields = [
    {
      name: "title",
      label: "Task Title",
      type: "text",
      placeholder: "Enter task title",
      required: true,
    },
    {
      name: "description",
      label: "Task Description",
      type: "textarea",
      placeholder: "Enter task description",
      required: true,
    },
    { name: "dueDate", label: "Due Date", type: "date", required: true },
    {
      name: "taskPriority",
      label: "Priority",
      type: "select",
      options: [
        { label: "Regular", value: "Regular" },
        { label: "Priority", value: "Priority" },
      ],
      required: true,
    },
  ];

  const filterTasks = (tasks) => {
    return tasks.filter((task) => {
      const taskObj = task.taskId || task;
      const employee = taskObj.employeeId || {};
      const project = taskObj.projectId || {};

      const matchesName = employee.name
        ?.toLowerCase()
        .includes(searchAssignedTo.toLowerCase());
      const matchesProject = project.project_name
        ?.toLowerCase()
        .includes(searchProject.toLowerCase());

      const due = new Date(taskObj.dueDate);
      const afterStart = startDate ? due >= new Date(startDate) : true;
      const beforeEnd = endDate ? due <= new Date(endDate) : true;

      return matchesName && matchesProject && afterStart && beforeEnd;
    });
  };

  const renderTable = (title, tasks, isUpdate = false) => (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-4 text-center">{title}</h3>

      <div className="flex flex-wrap gap-4 justify-center mb-4">
        <input
          type="text"
          placeholder="Search Assigned To"
          value={searchAssignedTo}
          onChange={(e) => setSearchAssignedTo(e.target.value)}
          className="px-3 py-1 border rounded"
        />
        <input
          type="text"
          placeholder="Search Project"
          value={searchProject}
          onChange={(e) => setSearchProject(e.target.value)}
          className="px-3 py-1 border rounded"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-1 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-1 border rounded"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm md:text-base bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border">S.No</th>
              <th className="py-2 px-4 border">Project</th>
              <th className="py-2 px-4 border">Task Title</th>
              <th className="py-2 px-4 border">Assigned To</th>
              <th className="py-2 px-4 border">Due Date</th>
              <th className="py-2 px-4 border">Priority</th>
              {isUpdate && (
                <>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Report</th>
                </>
              )}
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterTasks(tasks).length > 0 ? (
              filterTasks(tasks).map((task, index) => {
                const taskObj = isUpdate ? task.taskId : task;
                const employee = taskObj.employeeId || {};
                const project = taskObj.projectId || {};

                return (
                  <tr
                    key={task._id || taskObj._id}
                    className="text-center hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      if (isUpdate) {
                        navigate(`/task-details/${task.taskId._id}`, {
                          state: task,
                        });
                      } else {
                        navigate(`/task-details/${task._id}`, {
                          state: { task },
                        });
                      }
                    }}
                  >
                    <td className="py-2 px-4 border">{index + 1}</td>
                    <td className="py-2 px-4 border">
                      {project?.project_name || "—"}
                    </td>
                    <td className="py-2 px-4 border">{taskObj.title}</td>
                    <td className="py-2 px-4 border">
                      {employee.name || "N/A"}
                    </td>
                    <td className="py-2 px-4 border">
                      {new Date(taskObj.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border">
                      <span
                        className={`text-sm font-semibold px-2 py-1 rounded-full ${
                          taskObj.taskPriority === "Priority"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {taskObj.taskPriority}
                      </span>
                    </td>
                    {isUpdate && (
                      <>
                        <td className="py-2 px-4 border">
                          <span
                            className={`px-2 py-1 rounded-full text-sm font-medium ${
                              task.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : task.status === "In Progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {task.status || "Pending"}
                          </span>
                        </td>
                        <td className="py-2 px-4 border">{task.report}</td>
                      </>
                    )}
                    <td className="py-2 px-4 border space-x-2">
                      {!isUpdate && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(taskObj);
                          }}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <FaEdit />
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleDelete(isUpdate ? task.taskId : taskObj)
                        }
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={isUpdate ? 8 : 7}
                  className="py-4 text-center text-gray-500"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Task Analyze Report
      </h2>
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        <button
          onClick={() => setActiveView("updated")}
          className={`px-4 py-2 rounded ${
            activeView === "updated"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Updated Tasks
        </button>
        <button
          onClick={() => setActiveView("all")}
          className={`px-4 py-2 rounded ${
            activeView === "all"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          All Assigned Tasks
        </button>
        <button
          onClick={() => setActiveView("notUpdated")}
          className={`px-4 py-2 rounded ${
            activeView === "notUpdated"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Not Updated Tasks
        </button>
      </div>

      {activeView === "updated" &&
        renderTable("Tasks with Updates", updatedTasks, true)}
      {activeView === "all" && renderTable("All Assigned Tasks", allTasks)}
      {activeView === "notUpdated" &&
        renderTable("Tasks Not Yet Updated", notUpdatedTasks)}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Task"
      >
        <DynamicForm
          fields={formFields}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalOpen(false)}
          initialValues={formValues}
        />
      </Modal>
    </div>
  );
};

export default TaskAnalyzeComponent;
