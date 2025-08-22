import React, { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import Modal from "../common/modelComponent";
import DynamicForm from "../common/DynamicForm";

const CreatingTaskComponent = () => {
  const [rolesData, setRolesData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [projectAssigns, setProjectAssigns] = useState([]);
  const [roleToProjects, setRoleToProjects] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [rRes, pRes, paRes] = await Promise.all([
          customFetch.get("/role"),
          customFetch.get("/project"),
          customFetch.get("/ProjectAssign"),
        ]);

        setRolesData(rRes.data.roles);
        setProjectsData(pRes.data.projects);

        const assigns = paRes.data.projects || [];
        setProjectAssigns(assigns);

        const map = {};
        assigns.forEach((item) => {
          const rid = item.role._id;
          if (!map[rid]) map[rid] = [];
          map[rid].push({
            _id: item._id,
            project_name: item.project_name,
          });
        });
        setRoleToProjects(map);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      }
    };
    fetchAll();
  }, []);

  const openAssignModal = (role) => {
    setSelectedRole(role);
    setFormValues({});
    setModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (!selectedRole) return;
    const payload = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      taskPriority: data.taskPriority,
      employeeId: selectedRole._id,
      departmentId: selectedRole.departmentId._id,
      projectId: data.projectId,
    };
    try {
      await customFetch.post("/TaskAssign", payload);
      toast.success("Task assigned successfully");
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign task");
    }
  };

  const projectOptionsForRole = selectedRole
    ? (roleToProjects[selectedRole._id] || []).map((p) => ({
        label: p.project_name,
        value: p._id,
      }))
    : [];

  const formFields = [
    {
      name: "projectId",
      label: "Project",
      type: "select",
      options: projectOptionsForRole,
      required: true,
    },
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
    {
      name: "dueDate",
      label: "Due Date",
      type: "date",
      required: true,
    },
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

  return (
    <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
      <h2 className="text-3xl text-center font-semibold mb-6">Assign Task</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm md:text-base">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border">S.No</th>
              <th className="py-2 px-4 border">Project</th>
              <th className="py-2 px-4 border">Emp ID</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Department</th>
              <th className="py-2 px-4 border">Assign Task</th>
            </tr>
          </thead>
          <tbody>
            {rolesData
              .filter((r) => r.role !== "admin")
              .flatMap((role) => {
                const assignedProjects = roleToProjects[role._id] || [];
                return assignedProjects.length
                  ? assignedProjects.map((proj) => ({
                      role,
                      project: proj,
                    }))
                  : [{ role, project: null }];
              })
              .map(({ role, project }, idx) => (
                <tr
                  key={`${role._id}-${project?._id || "none"}`}
                  className="text-center hover:bg-gray-50"
                >
                  <td className="py-2 px-4 border">{idx + 1}</td>
                  <td className="py-2 px-4 border">
                    {project ? project.project_name : "No Project"}
                  </td>
                  <td className="py-2 px-4 border">{role.empId || "—"}</td>
                  <td className="py-2 px-4 border">{role.name}</td>
                  <td className="py-2 px-4 border">{role.role}</td>
                  <td className="py-2 px-4 border">
                    {role.departmentId?.department_name || "—"}
                  </td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => openAssignModal(role)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Assign Task"
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

export default CreatingTaskComponent;
