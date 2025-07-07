import mongoose from "mongoose";
import Attendance from "../../model/Attendance/AttendanceSchema.js";
import moment from "moment-timezone";

console.log("Date now:", new Date());
console.log("Moment Asia/Kolkata:", moment().tz("Asia/Kolkata").format());

const durationToMinutes = (durationStr = "0h 0m") => {
  const [h = "0", m = "0"] = durationStr.split(" ");
  const hours = parseInt(h) || 0;
  const minutes = parseInt(m) || 0;
  return hours * 60 + minutes;
};

// ⏱️ Format duration between two Date objects → "xh ym"
const formatDuration = (start, end) => {
  const duration = moment.duration(moment(end).diff(moment(start)));
  const hours = duration.hours();
  const minutes = duration.minutes();
  return `${hours}h ${minutes}m`;
};

// 📊 Classify work status based on total minutes
const classifyWorkStatus = (durationStr) => {
  const [h, m] = durationStr.split(" ").map((t) => parseInt(t));
  const totalMinutes = (h || 0) * 60 + (m || 0);

  if (totalMinutes >= 480 && totalMinutes <= 510) return "Full Day Present";
  if (totalMinutes > 510) return "Overtime";
  if (totalMinutes >= 420 && totalMinutes < 480) return "Warning"; // 7h–7h59m
  if (totalMinutes > 300 && totalMinutes < 420) return "Half Day Present"; // 5h–6h59m
  if (totalMinutes > 0 && totalMinutes <= 300) return "Warning"; // up to 5h
  return "Absent";
};

export const toggleAttendance = async (req, res) => {
  try {
    const userId = req.user.userId;
    const todayIST = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

    let attendance = await Attendance.findOne({ userId, date: todayIST });

    if (!attendance) {
      // ✅ First-time check-in → save as Date
      const checkInTime = moment().tz("Asia/Kolkata").toDate();
      console.log(
        `✅ Creating new check-in at ${checkInTime} for user ${userId}`
      );

      const newAttendance = await Attendance.create({
        userId,
        date: todayIST,
        checkInTime,
        status: "Active",
      });

      return res.status(200).json({
        msg: "Checked in",
        attendance: newAttendance,
      });
    }

    if (attendance.status === "Active") {
      // ✅ Check-out → also save as Date
      const checkOutTime = moment().tz("Asia/Kolkata").toDate();
      console.log(`✅ Checking out at ${checkOutTime} for user ${userId}`);

      const duration = formatDuration(attendance.checkInTime, checkOutTime);
      const workStatus = classifyWorkStatus(duration);

      attendance.status = "Offline";
      attendance.checkOutTime = checkOutTime;
      attendance.totalDuration = duration;
      attendance.workStatus = workStatus;

      await attendance.save();

      return res.status(200).json({
        msg: "Checked out",
        attendance,
      });
    }

    return res.status(400).json({ msg: "Already checked out today." });
  } catch (error) {
    console.error("❌ Error in toggleAttendance:", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getTodayAttendance = async (req, res) => {
  try {
    const userId = req.user.userId;
    const todayIST = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

    const attendance = await Attendance.findOne({ userId, date: todayIST });

    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const { date, userId } = req.query;
    const query = {};
    if (date) query.date = date;
    if (userId) query.userId = userId;

    const attendanceRecords = await Attendance.find(query)
      .populate("userId", "name email role")
      .sort({ date: -1 });

    res.status(200).json({ attendanceRecords });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getAllAttendanceForAdmin = async (req, res) => {
  try {
    const records = await Attendance.find({})
      .populate("userId", "name email role")
      .sort({ date: 1 });
    const summaryMap = {};

    for (const record of records) {
      const user = record.userId;
      const userId = user._id.toString();
      if (!summaryMap[userId]) {
        summaryMap[userId] = {
          name: user.name,
          email: user.email,
          totalMinutes: 0,
          presentDays: 0,
        };
      }
      if (
        ["Full Day Present", "Half Day Present", "Overtime"].includes(
          record.workStatus
        )
      ) {
        summaryMap[userId].presentDays += 1;
      }
      summaryMap[userId].totalMinutes += durationToMinutes(
        record.totalDuration
      );
    }

    const summary = Object.values(summaryMap);
    console.log(records, summary);

    res.status(200).json({
      attendanceRecords: records,
      summary,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getAllAttendanceForLoggedInUser = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const attendanceRecords = await Attendance.find({ userId }).sort({
      date: 1,
    });
    await recalculateAllAttendances();
    res.status(200).json({ attendanceRecords });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const recalculateAllAttendances = async () => {
  try {
    const records = await Attendance.find({});
    let updatedCount = 0;
    for (const record of records) {
      if (record.checkInTime && record.checkOutTime) {
        const duration = formatDuration(
          record.checkInTime,
          record.checkOutTime
        );
        const workStatus = classifyWorkStatus(duration);
        record.totalDuration = duration;
        record.workStatus = workStatus;
        await record.save();
        updatedCount++;
      }
    }
    console.log(
      `Recalculated ${updatedCount} attendance records successfully.`
    );
  } catch (error) {
    console.error("❌ Error in bulk recalculation:", error.message);
  }
};
