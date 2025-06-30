import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import customFetch from "../../utils/customFetch";
import Modal from "../common/modelComponent";
import DynamicForm from "../common/DynamicForm";
import { toast } from "react-toastify";

const ProjectAssign = () => {
  const [assignments, setAssignments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignRes, roleRes, projectRes] = await Promise.all([
        customFetch.get("/projectAssign"),
        customFetch.get("/role"),
        customFetch.get("/project"),
      ]);
      setAssignments(assignRes.data.projects);
      setRoles(roleRes.data.roles);
      setProjects(projectRes.data.projects);
    } catch (err) {
      console.error("Error fetching data", err);
      toast.error("Failed to load data");
    }
  };

  const projectOptions = projects.map((p) => ({
    label: p.project_name,
    value: p.project_name,
  }));

  const roleOptions = [...new Set(roles.map((r) => r.role.toLowerCase()))].map(
    (role) => ({
      label: role.charAt(0).toUpperCase() + role.slice(1),
      value: role,
    })
  );

  const nameOptions = roles.map((r) => ({
    label: r.name,
    value: r.name,
  }));

  const formFields = [
    {
      name: "project_name",
      label: "Project Code",
      type: "select",
      options: projectOptions,
      required: true,
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: roleOptions,
      required: true,
    },
    {
      name: "name",
      label: "Employee Name",
      type: "select",
      options: nameOptions,
      required: true,
    },
  ];

  const openAddModal = () => {
    setIsEditMode(false);
    setFormValues({});
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setIsEditMode(true);
    setEditId(item._id);
    setFormValues({
      project_name: item.project_name,
      role: item.role?.role,
      name: item.role?.name,
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      const payload = {
        project_name: data.project_name,
        role: data.role,
        name: data.name,
      };

      if (isEditMode) {
        await customFetch.patch(`/projectAssign/${editId}`, payload);
        toast.success("Assignment updated successfully");
      } else {
        await customFetch.post("/projectAssign", payload);
        toast.success("Assignment added successfully");
      }

      setModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error submitting assignment", error);
      toast.error("Failed to submit assignment");
    }
  };

  const handleDelete = async (id) => {
    try {
      await customFetch.delete(`/projectAssign/${id}`);
      toast.success("Assignment deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Delete error", error);
      toast.error("Failed to delete assignment");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          Project Assignments
        </h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
          onClick={openAddModal}
        >
          + Add Assignment
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm md:text-base">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border">S.No</th>
              <th className="py-2 px-4 border">Project Code</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Emp ID</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length > 0 ? (
              assignments.map((item, idx) => {
                const roleData = item.role || {};
                return (
                  <tr key={item._id} className="text-center hover:bg-gray-50">
                    <td className="py-2 px-4 border">{idx + 1}</td>
                    <td className="py-2 px-4 border">{item.project_name}</td>
                    <td className="py-2 px-4 border capitalize">
                      {roleData.role || "—"}
                    </td>
                    <td className="py-2 px-4 border">{roleData.name || "—"}</td>
                    <td className="py-2 px-4 border">
                      {roleData.empId || "—"}
                    </td>
                    <td className="py-2 px-4 border space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-yellow-500 hover:text-yellow-600 text-lg"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:text-red-600 text-lg ml-2"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditMode ? "Edit Assignment" : "Add Assignment"}
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

export default ProjectAssign;
