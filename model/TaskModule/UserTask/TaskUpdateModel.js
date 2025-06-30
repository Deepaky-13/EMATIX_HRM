import mongoose from "mongoose";

const taskStatusUpdateSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskAssign",
      required: true,
    },
    status: {
      type: String,
      enum: ["To-do", "In Progress", "Hold", "Completed"],
      default: "To-do",
    },
    report: { type: String },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("TaskStatusUpdate", taskStatusUpdateSchema);
