import mongoose from "mongoose";

const CareerJobSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CareerJob", CareerJobSchema);
