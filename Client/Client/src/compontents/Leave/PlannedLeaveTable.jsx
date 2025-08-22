import React from "react";

const PlannedLeaveTable = ({ leaves }) => (
  <div className="pt-8">
    <h3 className="text-xl font-bold text-gray-700 mb-4">Submitted Leaves</h3>
    {leaves.length === 0 ? (
      <p className="text-gray-500">No leaves submitted yet.</p>
    ) : (
      <table className="w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Start Date</th>
            <th className="border px-2 py-1">End Date</th>
            <th className="border px-2 py-1">Em-Date</th>
            <th className="border px-2 py-1">Days</th>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Reason</th>
            <th className="border px-2 py-1">Assigned</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Document</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave, index) => (
            <tr key={index}>
              <td className="border px-2 py-1">
                {leave.leaveType === "planned" && leave.startDate
                  ? new Date(leave.startDate).toLocaleDateString()
                  : ""}
              </td>
              <td className="border px-2 py-1">
                {leave.leaveType === "planned" && leave.endDate
                  ? new Date(leave.endDate).toLocaleDateString()
                  : ""}
              </td>
              <td className="border px-2 py-1">
                {leave.leaveType === "emergency" && leave.dateOfLeave
                  ? new Date(leave.dateOfLeave).toLocaleDateString()
                  : ""}
              </td>
              <td className="border px-2 py-1">{leave.totalDays}</td>
              <td className="border px-2 py-1 capitalize">{leave.leaveType}</td>
              <td className="border px-2 py-1">{leave.reason}</td>
              <td className="border px-2 py-1">{leave.assignedTo}</td>
              <td className="border px-2 py-1 text-green-700 font-semibold">
                {leave.status}
              </td>
              <td className="border px-2 py-1">
                {leave.documentUrl ? (
                  <a
                    href={leave.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <img
                      src={leave.documentUrl}
                      alt="Document"
                      className="w-16 h-16 object-cover border rounded"
                    />
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default PlannedLeaveTable;
