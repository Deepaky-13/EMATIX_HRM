import React, { useEffect, useState } from "react";
import customFetch from "../../../utils/customFetch";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const workStatusMap = {
  "Full Day Present": "FD",
  "Half Day Present": "HD",
  Overtime: "OT",
  Warning: "WN",
  Absent: "A",
};

const getCellColor = (status) => {
  switch (status) {
    case "FD":
      return "bg-green-500 text-white";
    case "HD":
      return "bg-yellow-400 text-black";
    case "OT":
      return "bg-blue-500 text-white";
    case "WN":
      return "bg-orange-400 text-white";
    case "A":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-200 text-black";
  }
};

const formatDuration = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
};

const AttendanceAdmin = () => {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const days = daysInMonth(selectedMonth, selectedYear);

  const fetchData = async () => {
    try {
      const res = await customFetch.get(`/attendance/admin`);
      setRecords(res.data.attendanceRecords || []);
      setSummary(res.data.summary || []);
    } catch (err) {
      console.error("Failed to fetch", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getRecordFor = (userId, day) => {
    return records.find((r) => {
      const d = new Date(r.date);
      return (
        r.userId._id === userId &&
        d.getMonth() === selectedMonth &&
        d.getFullYear() === selectedYear &&
        d.getDate() === day
      );
    });
  };

  return (
    <div className="p-2 overflow-x-auto">
      {/* Month Tabs */}
      <div className="flex flex-wrap gap-2 mb-3">
        {months.map((m, i) => (
          <button
            key={i}
            onClick={() => setSelectedMonth(i)}
            className={`px-3 py-1 text-xs font-semibold border rounded ${
              selectedMonth === i
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="border border-gray-400 text-[10px] table-fixed w-full">
        <thead className="bg-gray-300">
          <tr>
            <th className="sticky text-sm left-0 bg-gray-300 z-10 border px-1 py-1 w-[80px] text-left">
              Name
            </th>
            {Array.from({ length: days }, (_, d) => (
              <th key={d} className="border px-0.5 py-1 w-[24px] text-center">
                {d + 1}
              </th>
            ))}
            <th className="border text-sm px-1 py-1 w-[50px] text-center">
              Days
            </th>
            <th className="border text-sm px-1 py-1 w-[70px] text-center">
              Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {summary.map((userSum) => {
            const userId = records.find((r) => r.userId.name === userSum.name)
              ?.userId._id;

            return (
              <tr key={userId}>
                <td className="sticky text-sm left-0 bg-white z-0 border px-1 py-1 font-medium truncate w-[80px]">
                  {userSum.name}
                </td>
                {Array.from({ length: days }, (_, d) => {
                  const record = getRecordFor(userId, d + 1);
                  const ws = record?.workStatus;
                  const shortStatus = workStatusMap[ws] || "";
                  const tooltip = record
                    ? `Status: ${ws}, In: ${record.checkInTime || "—"}, Out: ${
                        record.checkOutTime || "—"
                      }, Duration: ${record.totalDuration || "—"}`
                    : "No record";

                  return (
                    <td
                      key={d}
                      title={tooltip}
                      className="border text-center px-0.5 py-0.5 w-[24px]"
                    >
                      <span
                        className={`inline-block px-1 py-0.5 text-[9px] font-semibold rounded ${getCellColor(
                          shortStatus
                        )}`}
                      >
                        {shortStatus}
                      </span>
                    </td>
                  );
                })}
                <td className="border text-sm text-center font-semibold">
                  {userSum.presentDays}
                </td>
                <td className="border text-sm text-center font-semibold">
                  {formatDuration(userSum.totalMinutes)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceAdmin;
