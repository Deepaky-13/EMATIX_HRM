import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import TaskStatusUpdate from "../../../model/TaskModule/UserTask/TaskUpdateModel.js";
import TaskAssign from "../../../model/TaskModule/AdminTask/AdminTaskModel.js";

//  Create or Update a Task Status
export const createOrUpdateTaskStatus = async (req, res) => {
  const { taskId, status, report } = req.body;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid Task ID" });
  }

  const task = await TaskAssign.findById(taskId);
  if (!task) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Task not found" });
  }

  // Check if a status update already exists for this task
  const existingStatus = await TaskStatusUpdate.findOne({ taskId });

  let updatedStatus;
  if (existingStatus) {
    // Update existing
    existingStatus.status = status || existingStatus.status;
    existingStatus.report = report || existingStatus.report;
    existingStatus.updatedAt = new Date();
    updatedStatus = await existingStatus.save();
  } else {
    // Create new
    updatedStatus = await TaskStatusUpdate.create({ taskId, status, report });
  }

  res.status(StatusCodes.OK).json({ update: updatedStatus });
};

//  Get status update by task ID
export const getStatusByTaskId = async (req, res) => {
  const { id: taskId } = req.params;
  console.log(taskId, "Task id");

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid Task ID" });
  }

  const update = await TaskStatusUpdate.findOne({ taskId }).populate({
    path: "taskId",
    populate: [
      { path: "employeeId", select: "name role" },
      { path: "departmentId", select: "department_name" },
    ],
  });

  if (!update) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Status not found for this task" });
  }

  res.status(StatusCodes.OK).json({ update });
};

// Admin - Get All Task Status Updates
export const getAllStatusUpdates = async (req, res) => {
  const updates = await TaskStatusUpdate.find().populate({
    path: "taskId",
    populate: [
      { path: "employeeId", select: "name role" },
      { path: "departmentId", select: "department_name" },
      { path: "projectId", select: "project_name" },
    ],
  });

  res.status(StatusCodes.OK).json({ updates });
};
