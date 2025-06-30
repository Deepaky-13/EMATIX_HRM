import React from "react";

const ApplicantsModal = ({ job, applications, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white max-w-2xl w-full p-6 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-xl"
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold text-blue-700 mb-4">
          Applicants for {job.role}
        </h3>
        {applications.length === 0 ? (
          <p className="text-gray-500">No applicants for this job yet.</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-gray-50 border rounded p-3 space-y-1"
              >
                <p>
                  <strong>Applicant:</strong> {app.name}
                </p>
                <p>
                  <strong>Email:</strong> {app.email}
                </p>
                <p>
                  <strong>Phone:</strong> {app.phone}
                </p>
                <p>
                  <strong>Description:</strong> {app.description}
                </p>
                <p>
                  <strong>Employee name :</strong> {app.employeeName}
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

export default ApplicantsModal;
