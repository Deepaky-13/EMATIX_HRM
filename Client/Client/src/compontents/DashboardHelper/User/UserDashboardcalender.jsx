import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Calendar styles

const mandatoryLeave = [
  { id: 1, date: "August 15, 2025", occasion: "Independence Day" },
  { id: 2, date: "October 2, 2025", occasion: "Gandhi Jayanti" },
  { id: 3, date: "October 20, 2025", occasion: "Diwali" },
  { id: 4, date: "December 25, 2025", occasion: "Christmas" },
  { id: 5, date: "January 1, 2026", occasion: "New Year" },
  { id: 6, date: "January 26, 2026", occasion: "Republic Day" },
  { id: 7, date: "March 4, 2026", occasion: "Holi" },
];

const floatingLeave = [
  { id: 1, date: "January 14, 2026", occasion: "Pongal" },
  { id: 2, date: "April 18, 2025", occasion: "Good Friday" },
  { id: 3, date: "May 1, 2025", occasion: "Labour Day" },
  { id: 4, date: "August 27, 2025", occasion: "Ganesh Chaturthi" },
];

const UserHolidayCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDateTime, setCurrentDateTime] = useState("");
  const today = new Date();

  const allHolidayMap = new Map([
    ...mandatoryLeave.map((item) => [
      new Date(item.date).toDateString(),
      { ...item, type: "mandatory" },
    ]),
    ...floatingLeave.map((item) => [
      new Date(item.date).toDateString(),
      { ...item, type: "floating" },
    ]),
  ]);

  // Live Date & Time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setCurrentDateTime(now.toLocaleString("en-IN", options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateStr = date.toDateString();
      const holiday = allHolidayMap.get(dateStr);
      const isToday = dateStr === today.toDateString();

      if (isToday) {
        return "!bg-yellow-400 text-black rounded-md";
      }

      if (holiday) {
        return new Date(holiday.date) >= today
          ? "!bg-green-300 !text-white rounded-md"
          : "!bg-red-300 !text-white rounded-md";
      }
    }
    return "!bg-gray-100";
  };

  const renderTableRows = (leaveArray) => {
    return leaveArray.map((item, index) => {
      const leaveDate = new Date(item.date);
      const isUpcoming = leaveDate >= today;
      const rowColor = isUpcoming ? "bg-green-100" : "bg-red-100";
      return (
        <tr key={item.id} className={`${rowColor} hover:bg-opacity-90`}>
          <td className="py-2 px-4 border-b">{index + 1}</td>
          <td className="py-2 px-4 border-b">{item.date}</td>
          <td className="py-2 px-4 border-b">{item.occasion}</td>
        </tr>
      );
    });
  };

  return (
    <div className="space-y-10 p-6">
      <div className="flex flex-col lg:flex-row gap-6 justify-center">
        {/* <div className="w-full max-w-xl">
          <h2 className="text-2xl font-bold text-green-700 text-center mb-4">
            Mandatory Holidays
          </h2>
          <table className="w-full border border-gray-300 rounded shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">S.No</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Occasion</th>
              </tr>
            </thead>
            <tbody>{renderTableRows(mandatoryLeave)}</tbody>
          </table>
        </div> */}

        <div className="bg-white rounded shadow p-1">
          <p className="text-sm md:text-base font-medium text-blue-700 text-center py-2">
            {currentDateTime}
          </p>
          <h2 className="text-xl font-bold text-center text-blue-700 mb-4">
            Holiday Calendar
          </h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={getTileClassName}
          />
        </div>
      </div>

      {/* <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">
          Floating / Restricted Holidays
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="py-2 px-4 border-b">S.No</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Occasion</th>
              </tr>
            </thead>
            <tbody>{renderTableRows(floatingLeave)}</tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};

export default UserHolidayCalendar;
