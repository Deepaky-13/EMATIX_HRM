import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Offline"],
      default: "Offline",
    },
    checkInTime: String,
    checkOutTime: String,
    totalDuration: String,

    workStatus: {
      type: String,
      enum: [
        "Absent",
        "Warning",
        "Half Day Present",
        "Full Day Present",
        "Overtime",
      ],
      // default: "Absent",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", AttendanceSchema);
