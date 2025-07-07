import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import customFetch from "../../utils/customFetch";

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

const formatIST = (dateStr) => {
  if (!dateStr) return "—";
  return moment(dateStr).tz("Asia/Kolkata").format("HH:mm:ss");
};

const AttendanceTable = ({ userInfo }) => {
  const maxDays = 31;
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

  const [records, setRecords] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState({});

  const fetchAttendance = async () => {
    try {
      const res = await customFetch.get(`/attendance/user`, {
        withCredentials: true,
      });
      const fetched = res.data.attendanceRecords || [];
      setRecords(fetched);

      const summaryMap = {};

      for (const r of fetched) {
        const date = new Date(r.date);
        const month = date.getMonth();

        if (!summaryMap[month]) {
          summaryMap[month] = { presentDays: 0, totalMinutes: 0 };
        }

        const ws = r.workStatus;
        if (["Full Day Present", "Half Day Present", "Overtime"].includes(ws)) {
          summaryMap[month].presentDays += 1;
        }

        if (r.totalDuration) {
          const [h = "0", m = "0"] = r.totalDuration.split(" ");
          summaryMap[month].totalMinutes += parseInt(h) * 60 + parseInt(m);
        }
      }

      setMonthlySummary(summaryMap);
    } catch (err) {
      console.error("Failed to fetch attendance", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="w-full overflow-auto p-2">
      <table className="border-collapse border border-gray-400 text-[10px] table-fixed w-full">
        <thead className="bg-gray-300">
          <tr>
            <th className="border border-gray-400 px-1 py-1 sticky left-0 bg-gray-300 z-10 w-[80px] text-left">
              Month ↓ / Date →
            </th>
            {Array.from({ length: maxDays }, (_, i) => (
              <th
                key={i}
                className="border border-gray-400 w-[22px] text-center"
              >
                {i + 1}
              </th>
            ))}
            <th className="border border-gray-400 px-1 py-1 w-[50px] text-center">
              Days
            </th>
            <th className="border border-gray-400 px-1 py-1 w-[70px] text-center">
              Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {months.map((month, monthIndex) => (
            <tr key={monthIndex}>
              <td className="border border-gray-400 px-1 py-1 sticky left-0 bg-white z-0 w-[80px] font-medium">
                {month}
              </td>
              {Array.from({ length: maxDays }, (_, day) => {
                const record = records.find((r) => {
                  const dateObj = new Date(r.date);
                  return (
                    dateObj.getMonth() === monthIndex &&
                    dateObj.getDate() === day + 1
                  );
                });

                const tooltip = record
                  ? `Status: ${
                      record.workStatus || "In progress"
                    }, In: ${formatIST(record.checkInTime)}, Out: ${formatIST(
                      record.checkOutTime
                    )}, Duration: ${record.totalDuration || "—"}`
                  : "No record";

                return (
                  <td
                    key={day}
                    className="border border-gray-400 text-center w-[22px] px-0.5 py-0.5"
                    title={tooltip}
                  >
                    {record?.workStatus ? (
                      <span
                        className={`text-[9px] px-1 py-0.5 inline-block font-semibold rounded ${getCellColor(
                          workStatusMap[record.workStatus]
                        )}`}
                      >
                        {workStatusMap[record.workStatus]}
                      </span>
                    ) : (
                      "" // Leave cell empty if record exists but workStatus is not yet set
                    )}
                  </td>
                );
              })}
              <td className="border text-center font-semibold">
                {monthlySummary[monthIndex]?.presentDays || 0}
              </td>
              <td className="border text-center font-semibold">
                {formatDuration(monthlySummary[monthIndex]?.totalMinutes || 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
