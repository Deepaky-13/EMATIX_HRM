import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminJobList = ({ jobs, onViewApplicants, onEditJob, onDeleteJob }) => {
  if (!jobs || jobs.length === 0) {
    return <p className="text-center text-gray-500">No jobs posted yet.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {jobs.map((job) => (
        <div
          key={job._id}
          className="relative bg-white border rounded shadow p-4 space-y-2"
        >
          {/* Edit & Delete buttons */}
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={() => onEditJob(job)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit Job"
            >
              <FaEdit size={18} />
            </button>
            <button
              onClick={() => onDeleteJob(job._id)}
              className="text-red-600 hover:text-red-800"
              title="Delete Job"
            >
              <FaTrash size={18} />
            </button>
          </div>

          {/* Job details */}
          <h4 className="text-xl font-bold text-blue-700">{job.role}</h4>
          <p>
            <strong>Position:</strong> {job.position}
          </p>
          <p>
            <strong>Department:</strong> {job.department}
          </p>
          <p>
            <strong>Deadline:</strong>{" "}
            {new Date(job.deadline).toLocaleDateString()}
          </p>

          <button
            onClick={() => onViewApplicants(job)}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
          >
            View Applicants
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminJobList;
