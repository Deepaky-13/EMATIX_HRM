import mongoose from "mongoose";
import TaskStatusUpdate from "../UserTask/TaskUpdateModel.js";

const TaskAssignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    taskPriority: {
      type: String,
      enum: ["Priority", "Regular"],
      default: "Regular",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
    },
  },
  { timestamps: true }
);

// Middleware: After deleting a task, delete its corresponding task update
TaskAssignSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await TaskStatusUpdate.deleteOne({ taskId: doc._id });
  }
});

export default mongoose.model("TaskAssign", TaskAssignSchema);
