import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role", // Assuming your user roles are stored in a "Role" collection
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["planned", "emergency"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: String,
      required: true,
    },
    documentUrl: {
      type: String, // For now: storing the file name. Later: Cloudinary URL.
    },
    totalDays: {
      type: Number,
      default: 1,
    },
    startDate: Date, // Used for planned leave
    endDate: Date, // Used for planned leave
    dateOfLeave: Date, // Used for emergency leave
    status: {
      type: String,
      enum: ["Applied", "Review", "Approved", "Rejected"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Leave", LeaveSchema);
