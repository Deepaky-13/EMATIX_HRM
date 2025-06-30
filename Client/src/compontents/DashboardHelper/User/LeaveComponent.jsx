import React, { useEffect, useState } from "react";
import customFetch from "../../../utils/customFetch";
import { toast } from "react-toastify";

const Leave = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await customFetch.get("/leave");
        const allLeaves = res.data || [];
        console.log("leavs", allLeaves);

        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);

        const filtered = allLeaves.filter((leave) => {
          if (!leave.status || leave.status.toLowerCase() !== "approved")
            return false;

          const todayStr = new Date().toISOString().slice(0, 10);

          const startDate = leave.startDate
            ? new Date(leave.startDate).toISOString().slice(0, 10)
            : null;
          const endDate = leave.endDate
            ? new Date(leave.endDate).toISOString().slice(0, 10)
            : null;
          const emergencyDate = leave.dateOfLeave
            ? new Date(leave.dateOfLeave).toISOString().slice(0, 10)
            : null;

          if (startDate && endDate) {
            // Show planned leaves starting today or later
            return todayStr <= endDate;
          }

          if (emergencyDate) {
            // Show emergency leaves happening today
            return todayStr === emergencyDate;
          }

          return false;
        });

        console.log(filtered, "f");

        setLeaves(filtered);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch leave records");
      }
    };

    fetchLeaves();
  }, []);

  return (
    <div className="bg-white shadow rounded-xl p-4 min-h-[100px] overflow-auto">
      <h2 className="text-lg font-semibold mb-4">
        Today’s Active Approved Leaves
      </h2>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-4 py-2">Employee Name</th>
            <th className="border px-4 py-2">Start Date</th>
            <th className="border px-4 py-2">End Date</th>
            <th className="border px-4 py-2">Emergency Date</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 py-6">
                ✅ No active approved leaves today!
              </td>
            </tr>
          ) : (
            leaves.map((leave, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">
                  {leave.userId?.name || "-"}
                </td>
                <td className="border px-4 py-2">
                  {leave.startDate
                    ? new Date(leave.startDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="border px-4 py-2">
                  {leave.endDate
                    ? new Date(leave.endDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="border px-4 py-2">
                  {leave.emergencyDate
                    ? new Date(leave.emergencyDate).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leave;
