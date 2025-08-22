import React, { useState, useEffect } from "react";
import customFetch from "../../utils/customFetch";
import AdminJobList from "./AdminJobList";
import ApplicantsModal from "./ApplicantaModal";
import { toast } from "react-toastify";

const AdminApplication = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [expandedJob, setExpandedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

  const [newJob, setNewJob] = useState({
    position: "",
    department: "",
    role: "",
    deadline: "",
  });

  const fetchApplications = async () => {
    try {
      const res = await customFetch.get("/userApply");
      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching applications", error);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await customFetch.get("/carrier");
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs", error);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchJobs();
  }, []);

  const handleJobFormChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    const { position, department, role, deadline } = newJob;

    if (!position || !department || !role || !deadline) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await customFetch.post("/carrier", newJob);
      toast.success("Job posted successfully!");
      setNewJob({ position: "", department: "", role: "", deadline: "" });
      setShowPostForm(false);
      fetchJobs();
    } catch (error) {
      console.error("Failed to post job", error);
      toast.error("Failed to post job.");
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setNewJob({
      position: job.position,
      department: job.department,
      role: job.role,
      deadline: job.deadline.split("T")[0], // date only
    });
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    const { position, department, role, deadline } = newJob;

    if (!position || !department || !role || !deadline) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await customFetch.patch(`/carrier/${editingJob._id}`, newJob);
      toast.success("Job updated successfully!");
      setEditingJob(null);
      setNewJob({ position: "", department: "", role: "", deadline: "" });
      fetchJobs();
    } catch (error) {
      console.error("Failed to update job", error);
      toast.error("Failed to update job.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await customFetch.delete(`/carrier/${jobId}`);
      toast.success("Job deleted successfully!");
      fetchJobs();
    } catch (error) {
      console.error("Failed to delete job", error);
      toast.error("Failed to delete job.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-700">
          {" "}
          Career Opportunities
        </h2>
        <button
          onClick={() => setShowPostForm(!showPostForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
        >
          {showPostForm ? "Close Job Form" : "Post Job"}
        </button>
      </div>

      {/* Post Job Form */}
      {showPostForm && (
        <form
          onSubmit={handlePostJob}
          className="space-y-4 bg-white p-4 rounded shadow mt-4"
        >
          <h3 className="text-xl font-semibold text-blue-700">Post New Job</h3>
          {["position", "department", "role", "deadline"].map((field) => (
            <div key={field}>
              <label className="block font-medium capitalize">{field}:</label>
              {field === "deadline" ? (
                <input
                  type="date"
                  name={field}
                  value={newJob[field]}
                  onChange={handleJobFormChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded"
                />
              ) : (
                <input
                  type="text"
                  name={field}
                  value={newJob[field]}
                  onChange={handleJobFormChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded"
                  placeholder={`Enter ${field}`}
                />
              )}
            </div>
          ))}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Post Job
            </button>
          </div>
        </form>
      )}

      {/* Jobs List */}
      <AdminJobList
        jobs={jobs}
        onViewApplicants={(job) => setExpandedJob(job)}
        onEditJob={handleEditJob}
        onDeleteJob={handleDeleteJob}
      />

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative bg-white w-full max-w-md rounded shadow p-6">
            <button
              onClick={() => setEditingJob(null)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-xl"
            >
              &times;
            </button>
            <form onSubmit={handleUpdateJob} className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-700">Edit Job</h3>
              {["position", "department", "role", "deadline"].map((field) => (
                <div key={field}>
                  <label className="block font-medium capitalize">
                    {field}:
                  </label>
                  {field === "deadline" ? (
                    <input
                      type="date"
                      name={field}
                      value={newJob[field]}
                      onChange={handleJobFormChange}
                      className="w-full border border-gray-300 px-4 py-2 rounded"
                    />
                  ) : (
                    <input
                      type="text"
                      name={field}
                      value={newJob[field]}
                      onChange={handleJobFormChange}
                      className="w-full border border-gray-300 px-4 py-2 rounded"
                      placeholder={`Enter ${field}`}
                    />
                  )}
                </div>
              ))}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                >
                  Update Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {expandedJob && (
        <ApplicantsModal
          job={expandedJob}
          applications={applications.filter(
            (app) => app.job?._id === expandedJob._id
          )}
          onClose={() => setExpandedJob(null)}
        />
      )}
    </div>
  );
};

export default AdminApplication;
