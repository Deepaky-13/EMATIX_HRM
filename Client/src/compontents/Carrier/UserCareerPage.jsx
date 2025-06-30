import React, { useState, useEffect } from "react";
import customFetch from "../../utils/customFetch";
import UserApplyForm from "./UserApplyForm";
import { toast } from "react-toastify";

const UserCareerPage = () => {
  const [jobs, setJobs] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch posted jobs
  const fetchJobs = async () => {
    try {
      const res = await customFetch.get("/carrier");
      setJobs(res.data);
    } catch (error) {
      toast.error("Failed to fetch jobs.");
      console.error(error);
    }
  };

  // Fetch current user's applications
  const fetchUserApplications = async () => {
    try {
      const res = await customFetch.get("/userApply/my");
      setUserApplications(res.data);
    } catch (error) {
      toast.error("Failed to fetch your applications.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchUserApplications();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">
        Career Opportunities
      </h2>

      {/* Posted Jobs */}
      {jobs.length === 0 ? (
        <p className="text-center text-gray-500">
          No job roles available currently.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border rounded shadow p-4 space-y-2"
            >
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
                onClick={() => setSelectedJob(job)}
                className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Apply Form Modal */}
      {selectedJob && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative bg-white w-full max-w-md rounded shadow p-6">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-xl"
            >
              &times;
            </button>
            <UserApplyForm
              jobId={selectedJob._id}
              onClose={() => {
                setSelectedJob(null);
                fetchUserApplications(); // refresh user's applied jobs
              }}
            />
          </div>
        </div>
      )}

      {/* User's Applied Jobs */}
      <div className="pt-8">
        <h3 className="text-2xl font-bold text-gray-700 mb-4">
          My Applications
        </h3>
        {userApplications.length === 0 ? (
          <p className="text-center text-gray-500">
            You have not applied for any jobs yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {userApplications.map((app) => (
              <div
                key={app._id}
                className="bg-white border rounded shadow p-4 space-y-1"
              >
                <p>
                  <strong>Job Applied:</strong> {app.job?.role || "N/A"}
                </p>
                <p>
                  <strong>Description:</strong> {app.description}
                </p>
                <p className="text-sm text-gray-500">
                  Applied on: {new Date(app.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCareerPage;
