import { useState } from "react";
import AttendanceTable from "../../compontents/Attendance/AttendanceTable";
import HolidayPage from "../../compontents/Attendance/HolidayPage";
import { useEffect } from "react";
import customFetch from "../../utils/customFetch";

function AttendanceLayout() {
  const [page, setPage] = useState("attendance");
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const Response = await customFetch.get("/auth/login/user");
        console.log("Response", Response.data.user);
        setUser(Response.data.user);
      } catch (error) {
        toast.error("Error fetching user login");
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar
      <div className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2> */}
      {/* <ul>
          <li className="mb-2 cursor-pointer">Home</li>
          <li className="mb-2 cursor-pointer">Reports</li>
          <li className="mb-2 cursor-pointer">Settings</li>
        </ul> */}
      {/* </div> */}

      {/* Main Content - Full View, No Padding */}
      <div className="flex-1 bg-gray-100">
        {/* Buttons */}
        <div className="flex justify-center gap-6 bg-green-200 py-4 shadow">
          <button
            onClick={() => setPage("attendance")}
            className={`px-6 py-3 rounded font-semibold transition ${
              page === "attendance"
                ? "bg-blue-600 text-black-200"
                : "bg-blue-200 text-blue-800 hover:bg-blue-300"
            }`}
          >
            Show Attendance
          </button>

          <button
            onClick={() => setPage("leave")}
            className={`px-6 py-3 rounded font-semibold transition ${
              page === "leave"
                ? "bg-green-600 text-black-200"
                : "bg-green-200 text-green-800 hover:bg-green-300"
            }`}
          >
            Show Leave
          </button>
        </div>

        {/* Fullscreen Component Rendering */}
        <div className="w-full h-full">
          {/* {page === "" && (
            <div className="flex items-center justify-center h-full text-lg text-gray-500">
              Please select a page above.
            </div>
          )} */}
          {page === "attendance" && <AttendanceTable userInfo={user} />}
          {page === "leave" && <HolidayPage />}
        </div>
      </div>
    </div>
  );
}

export default AttendanceLayout;
