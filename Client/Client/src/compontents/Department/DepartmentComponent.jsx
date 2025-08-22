import React, { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";
import Modal from "../common/modelComponent";
import { FaEdit, FaTrash } from "react-icons/fa";
import DynamicForm from "../common/DynamicForm";
import { toast } from "react-toastify";

const DepartmentComponent = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formValues, setFormValues] = useState({});

  const fetchDepartmentData = async () => {
    try {
      const response = await customFetch.get("/department");
      setDepartmentData(response.data.departments);
    } catch (error) {
      console.error("Failed to fetch departments", error);
      toast.error("Failed to load departments");
    }
  };

  useEffect(() => {
    fetchDepartmentData();
  }, []);

  const formFields = [
    {
      name: "department_name",
      label: "Department Name",
      type: "text",
      placeholder: "Enter department name",
      required: true,
    },
  ];

  const openAddModal = () => {
    setIsEditMode(false);
    setFormValues({});
    setModalOpen(true);
  };

  const openEditModal = (dept) => {
    setIsEditMode(true);
    setEditId(dept._id);
    setFormValues({ department_name: dept.department_name });
    setModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (isEditMode) {
        await customFetch.patch(`/department/${editId}`, {
          department_name: data.department_name,
        });
        toast.success("Department updated successfully");
      } else {
        await customFetch.post("/department", {
          department_name: data.department_name,
        });
        toast.success("Department added successfully");
      }

      setModalOpen(false);
      fetchDepartmentData();
    } catch (error) {
      console.error("Error submitting department", error);
      toast.error("Failed to submit department");
    }
  };

  const handleDelete = async (dept) => {
    try {
      await customFetch.delete(`/department/${dept._id}`);
      toast.success("Department deleted successfully");
      fetchDepartmentData();
    } catch (error) {
      console.error("Error deleting department", error);
      toast.error("Failed to delete department");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Department Details
        </h2>
        <button
          onClick={openAddModal}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          + Add Department
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border">S.No</th>
              <th className="py-2 px-4 border">Company Name</th>
              <th className="py-2 px-4 border">Department Name</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departmentData.map((dept, index) => (
              <tr key={dept._id} className="text-center hover:bg-gray-50">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">
                  Ematix Embedded & Software Solutions Inc
                </td>
                <td className="py-2 px-4 border">{dept.department_name}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => openEditModal(dept)}
                    className="text-yellow-500 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(dept)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditMode ? "Edit Department" : "Add Department"}
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

export default DepartmentComponent;
