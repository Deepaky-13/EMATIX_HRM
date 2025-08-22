import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    empId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    password: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    DOB: {
      type: Date,
    },
    anniversaryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Role", RoleSchema);
