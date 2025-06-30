import React, { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "../common/modelComponent";
import DynamicForm from "../common/DynamicForm";
import { toast } from "react-toastify";

const RoleComponent = () => {
  const [rolesData, setRolesData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formValues, setFormValues] = useState({});

  const fetchRoles = async () => {
    try {
      const res = await customFetch.get("/role");
      setRolesData(res.data.roles);
    } catch (err) {
      console.error("Error fetching roles:", err);
      toast.error("Failed to fetch roles");
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await customFetch.get("/department");
      setDepartments(res.data.departments);
    } catch (err) {
      console.error("Error fetching departments:", err);
      toast.error("Failed to fetch departments");
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchDepartments();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setFormValues({});
    setModalOpen(true);
  };

  const openEditModal = (role) => {
    setIsEditMode(true);
    setEditId(role._id);
    setFormValues({
      departmentId: role.departmentId?._id || "",
      role: role.role,
      name: role.name,
      empId: role.empId || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (roleId) => {
    try {
      await customFetch.delete(`/role/${roleId}`);
      toast.success("Role deleted successfully");
      fetchRoles();
    } catch (err) {
      console.error("Error deleting role:", err);
      toast.error("Failed to delete role");
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (isEditMode) {
        await customFetch.patch(`/role/${editId}`, data);
        toast.success("Role updated successfully");
      } else {
        await customFetch.post("/role", data);
        toast.success("Role added successfully");
      }
      setModalOpen(false);
      fetchRoles();
    } catch (err) {
      console.error("Error submitting role:", err);
      toast.error("Failed to submit role data");
    }
  };

  const formFields = [
    {
      name: "department_name",
      label: "Department",
      type: "select",
      options: departments.map((dept) => ({
        label: dept.department_name,
        value: dept.department_name,
      })),
      required: true,
    },
    {
      name: "role",
      label: "Role",
      type: "text",
      placeholder: "Enter role name",
      required: true,
    },
    {
      name: "name",
      label: "Employee Name",
      type: "text",
      placeholder: "Enter employee name",
      required: true,
    },
    {
      name: "empId",
      label: "Employee ID",
      type: "text",
      placeholder: "Enter employee ID",
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          Role Details
        </h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={openAddModal}
        >
          + Add Role
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm md:text-base">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border">S.No</th>
              <th className="py-2 px-4 border">Department</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Emp ID</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rolesData
              .filter((r) => r.role !== "admin")
              .map((role, index) => (
                <tr key={role._id} className="text-center hover:bg-gray-50">
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">
                    {role.departmentId?.department_name || "-"}
                  </td>
                  <td className="py-2 px-4 border">{role.role}</td>
                  <td className="py-2 px-4 border">{role.name}</td>
                  <td className="py-2 px-4 border">{role.empId || "-"}</td>
                  <td className="py-2 px-4 border space-x-2">
                    <button
                      onClick={() => openEditModal(role)}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(role._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
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
        title={isEditMode ? "Edit Role" : "Add Role"}
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

export default RoleComponent;
