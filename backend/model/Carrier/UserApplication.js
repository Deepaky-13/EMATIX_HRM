import mongoose from "mongoose";

const UserApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareerJob",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Enforce user association
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String, required: true },
    employeeName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("UserApplication", UserApplicationSchema);
