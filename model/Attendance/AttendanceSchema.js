import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    date: { type: String, required: true }, // e.g., "2025-07-07"
    checkInTime: { type: Date }, // store ISO Date, not HH:mm string!
    checkOutTime: { type: Date }, // same here
    status: {
      type: String,
      enum: ["Active", "Offline"],
      default: "Offline",
    },

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
