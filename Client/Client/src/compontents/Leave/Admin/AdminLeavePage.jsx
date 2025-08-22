import React, { useState, useEffect } from "react";
import customFetch from "../../../utils/customFetch";
import { toast } from "react-toastify";

const AdminLeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [filters, setFilters] = useState({
    searchName: "",
    leaveType: "",
    startDate: "",
    endDate: "",
  });
  const [quickFilter, setQuickFilter] = useState(""); // track active quick filter

  const fetchLeaves = async () => {
    try {
      const res = await customFetch.get("/leave");
      setLeaves(res.data);
      setFilteredLeaves(res.data);
    } catch (error) {
      toast.error("Failed to fetch leaves");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const applyFilters = () => {
    let data = [...leaves];

    // Name filter
    if (filters.searchName.trim() !== "") {
      data = data.filter((leave) =>
        leave.userId?.name
          .toLowerCase()
          .includes(filters.searchName.trim().toLowerCase())
      );
    }

    // Leave type filter
    if (filters.leaveType !== "") {
      data = data.filter((leave) => leave.leaveType === filters.leaveType);
    }

    // Date range filter (overlapping logic)
    if (filters.startDate && filters.endDate) {
      const filterStart = new Date(filters.startDate);
      const filterEnd = new Date(filters.endDate);
      data = data.filter((leave) => {
        const leaveStart = new Date(leave.startDate);
        const leaveEnd = leave.endDate ? new Date(leave.endDate) : leaveStart;
        return leaveEnd >= filterStart && leaveStart <= filterEnd;
      });
    }

    setFilteredLeaves(data);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, leaves]);

  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      await customFetch.patch(`/leave/${leaveId}`, { status: newStatus });
      toast.success("Status updated");
      fetchLeaves();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handleQuickFilter = (type) => {
    if (quickFilter === type) {
      // If same button clicked again, clear the quick filter
      setQuickFilter("");
      setFilteredLeaves(leaves);
      return;
    }

    if (type === "today") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const todayLeaves = leaves.filter((leave) => {
        const createdAt = new Date(leave.createdAt);
        return createdAt >= todayStart && createdAt <= todayEnd;
      });

      setFilteredLeaves(todayLeaves);
    }

    setQuickFilter(type);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Leave Requests</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block font-medium text-sm mb-1">Search Name:</label>
          <input
            type="text"
            value={filters.searchName}
            onChange={(e) =>
              setFilters({ ...filters, searchName: e.target.value })
            }
            className="border rounded px-3 py-1"
            placeholder="Employee name"
          />
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">Leave Type:</label>
          <select
            value={filters.leaveType}
            onChange={(e) =>
              setFilters({ ...filters, leaveType: e.target.value })
            }
            className="border rounded px-3 py-1"
          >
            <option value="">All</option>
            <option value="planned">Planned</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">Start Date:</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className="border rounded px-3 py-1"
          />
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">End Date:</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className="border rounded px-3 py-1"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleQuickFilter("today")}
            className={`${
              quickFilter === "today" ? "bg-green-600" : "bg-blue-500"
            } hover:bg-blue-600 text-white text-sm px-4 py-1 rounded`}
          >
            Today Applied
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredLeaves.length === 0 ? (
        <p className="text-center text-gray-500">No leave records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse bg-white shadow rounded mt-4">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-4 py-2">Employee Name</th>
                <th className="px-4 py-2">Leave Type</th>
                <th className="px-4 py-2">Start Date</th>
                <th className="px-4 py-2">End Date</th>
                <th className="px-4 py-2">Emergency Date</th>
                <th className="px-4 py-2">Days</th>
                <th className="px-4 py-2">Reason</th>
                <th className="px-4 py-2">Document</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => (
                <tr
                  key={leave._id}
                  className={`border-b ${
                    leave.leaveType === "emergency" ? "bg-red-100" : ""
                  }`}
                >
                  <td className="px-4 py-2">
                    {leave.userId?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-2 capitalize">{leave.leaveType}</td>
                  <td className="px-4 py-2">
                    {leave.startDate
                      ? new Date(leave.startDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {leave.endDate
                      ? new Date(leave.endDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {leave.leaveType === "emergency" && leave.dateOfLeave
                      ? new Date(leave.dateOfLeave).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">{leave.totalDays || "-"}</td>
                  <td className="px-4 py-2">{leave.reason}</td>
                  <td className="px-4 py-2">
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
                  <td className="px-4 py-2">
                    <select
                      className="border rounded px-2 py-1"
                      value={leave.status}
                      onChange={(e) =>
                        handleStatusChange(leave._id, e.target.value)
                      }
                    >
                      <option value="Applied">Applied</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminLeavePage;
