import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import customFetch from "../../utils/customFetch";
import ConformationModal from "../common/ConformationModal";
import { HiOutlinePower, HiPower } from "react-icons/hi2";

const CheckInOutToggle = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [startTime, setStartTime] = useState(null); // timestamp in ms
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const formatTime = (totalSeconds) => {
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleToggle = async () => {
    if (isCheckedIn) {
      setShowConfirm(true);
    } else {
      await toggleStatus();
    }
  };

  const toggleStatus = async () => {
    try {
      const res = await customFetch.post(
        "/attendance/toggle",
        {},
        { withCredentials: true }
      );
      const { attendance } = res.data;

      if (attendance.status === "Active") {
        setIsCheckedIn(true);
        // ✅ set start time using stored Date from server
        setStartTime(new Date(attendance.checkInTime).getTime());
        toast.success("Checked in successfully!");
      } else {
        setIsCheckedIn(false);
        setStartTime(null);
        setElapsedTime(0);
        toast.success("Checked out successfully!");
      }
      setShowConfirm(false);
    } catch (err) {
      console.error("❌ Toggle error", err);
      toast.error(
        err?.response?.data?.msg ||
          "Error: You can check out only once per day."
      );
      setShowConfirm(false);
    }
  };

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        const res = await customFetch.get("/attendance/today", {
          withCredentials: true,
        });
        const attendance = res.data.attendance;

        if (attendance?.status === "Active" && attendance?.checkInTime) {
          setIsCheckedIn(true);
          setStartTime(new Date(attendance.checkInTime).getTime());
        } else {
          setIsCheckedIn(false);
          setStartTime(null);
          setElapsedTime(0);
        }
      } catch (err) {
        console.error("❌ Could not fetch attendance", err);
      }
    };

    fetchTodayAttendance();
  }, []);

  useEffect(() => {
    let interval;
    if (isCheckedIn && startTime) {
      interval = setInterval(() => {
        const diff = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(diff);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, startTime]);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-sm text-gray-200 font-medium">
          {isCheckedIn ? "Check Out:" : "Check In:"}
        </span>

        <button
          onClick={handleToggle}
          className="text-2xl transition-transform duration-300 ease-in-out transform hover:scale-110"
        >
          {isCheckedIn ? (
            <HiPower className="text-green-400 hover:text-green-300 transition-all duration-300 ease-in-out" />
          ) : (
            <HiOutlinePower className="text-rose-400 hover:text-rose-300 transition-all duration-300 ease-in-out" />
          )}
        </button>
      </div>

      <div className="flex justify-between">
        {isCheckedIn && (
          <p className="mt-1 text-lg font-bold text-white font-mono">
            {formatTime(elapsedTime)}
          </p>
        )}
      </div>

      <ConformationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={toggleStatus}
        message="You can check out only once. Only one login will exist for the day."
      />
    </div>
  );
};

export default CheckInOutToggle;
