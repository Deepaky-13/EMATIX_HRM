import React, { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";
import UserApplyForm from "./UserApplyForm";

const CareerAdmin = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await customFetch.get("/career");
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-blue-700">
        Career Opportunities
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {jobs.length === 0 ? (
          <p className="text-gray-500">No job roles available currently.</p>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="bg-white p-4 border rounded shadow">
              <h3 className="text-xl font-semibold text-blue-700">
                {job.role}
              </h3>
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
                className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Apply
              </button>
            </div>
          ))
        )}
      </div>

      {selectedJob && (
        <div className="pt-10">
          <UserApplyForm
            jobId={selectedJob._id}
            onClose={() => setSelectedJob(null)}
          />
        </div>
      )}
    </div>
  );
};

export default CareerAdmin;
