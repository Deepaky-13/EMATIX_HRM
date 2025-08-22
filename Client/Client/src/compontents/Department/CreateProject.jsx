import React, { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "../common/modelComponent";
import DynamicForm from "../common/DynamicForm";
import { toast } from "react-toastify";

const CreateProject = () => {
  const [projectData, setProjectData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formValues, setFormValues] = useState({});

  const fetchProjectData = async () => {
    try {
      const response = await customFetch.get("/project");
      setProjectData(response.data.projects);
    } catch (error) {
      console.error("Failed to fetch project data", error);
      toast.error("Failed to load project data");
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setFormValues({});
    setModalOpen(true);
  };

  const openEditModal = (proj) => {
    setIsEditMode(true);
    setEditId(proj._id);
    setFormValues({ project_name: proj.project_name });
    setModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (isEditMode) {
        await customFetch.patch(`/project/${editId}`, {
          project_name: data.project_name,
        });
        toast.success("Project updated successfully");
      } else {
        await customFetch.post("/project", {
          project_name: data.project_name,
        });
        toast.success("Project added successfully");
      }
      setModalOpen(false);
      fetchProjectData();
    } catch (error) {
      console.error("Error submitting project", error);
      toast.error("Failed to submit project");
    }
  };

  const handleDelete = async (proj) => {
    try {
      await customFetch.delete(`/project/${proj._id}`);
      toast.success("Project deleted successfully");
      fetchProjectData();
    } catch (error) {
      console.error("Error deleting project", error);
      toast.error("Failed to delete project");
    }
  };

  const formFields = [
    {
      name: "project_name",
      label: "Project Name",
      type: "text",
      placeholder: "Enter project name",
      required: true,
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
      {/* Title + Add Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          Project Details
        </h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm md:text-base shadow"
          onClick={openAddModal}
        >
          + Add Project
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm md:text-base">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border">S.No</th>
              <th className="py-2 px-4 border">Company Name</th>
              <th className="py-2 px-4 border">Project Code</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projectData.length > 0 ? (
              projectData.map((proj, index) => (
                <tr key={proj._id} className="text-center hover:bg-gray-50">
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">
                    Ematix Embedded & Software Solutions Inc
                  </td>
                  <td className="py-2 px-4 border">{proj.project_name}</td>
                  <td className="py-2 px-4 border space-x-2">
                    <button
                      className="text-yellow-500 hover:text-yellow-600 text-lg"
                      onClick={() => openEditModal(proj)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600 text-lg ml-2"
                      onClick={() => handleDelete(proj)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No projects available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditMode ? "Edit Project" : "Add Project"}
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

export default CreateProject;
