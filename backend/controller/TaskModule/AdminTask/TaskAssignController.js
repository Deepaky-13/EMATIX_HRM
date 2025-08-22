import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import RoleModel from "../../../model/Roles/RoleModel.js";
import DepartmentModel from "../../../model/Department/DepartmentModel.js";
import AdminTaskModel from "../../../model/TaskModule/AdminTask/AdminTaskModel.js";
import ProjectModel from "../../../model/ProjectAssign/ProjectModel.js";

// Create a task (Admin assigns to employee)
export const createTask = async (req, res) => {
  const {
    employeeId,
    departmentId,
    projectId,
    title,
    description,
    dueDate,
    taskPriority,
  } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(employeeId) ||
    !mongoose.Types.ObjectId.isValid(departmentId) ||
    (projectId && !mongoose.Types.ObjectId.isValid(projectId))
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid Employee, Department, or Project ID" });
  }

  const [employee, department, project] = await Promise.all([
    RoleModel.findById(employeeId),
    DepartmentModel.findById(departmentId),
    projectId ? ProjectModel.findById(projectId) : null,
  ]);

  if (!employee || !department) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Employee or Department not found" });
  }

  if (projectId && !project) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Project not found" });
  }

  const task = await AdminTaskModel.create({
    employeeId,
    departmentId,
    projectId,
    title,
    description,
    dueDate,
    taskPriority,
  });

  res.status(StatusCodes.CREATED).json({ task });
};

// Get all tasks (admin view)
export const getAllTasks = async (req, res) => {
  const tasks = await AdminTaskModel.find()
    .populate("employeeId", "name role")
    .populate("departmentId", "department_name")
    .populate({
      path: "projectId",
      select: "project_name",
    });

  res.status(StatusCodes.OK).json({ tasks });
};

// Get tasks assigned to a specific employee (user view)
export const getTasksByEmployee = async (req, res) => {
  const { id: employeeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid Employee ID" });
  }

  const tasks = await AdminTaskModel.find({ employeeId })
    .populate("departmentId", "department_name")
    .populate("projectId", "project_name");

  res.status(StatusCodes.OK).json({ tasks });
};

// Update a task
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, taskPriority, projectId, departmentId } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid Task ID" });
  }

  const updateFields = {
    title,
    description,
    dueDate,
    taskPriority,
  };

  if (projectId) {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid Project ID" });
    }
    updateFields.projectId = projectId;
  }

  if (departmentId) {
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid Department ID" });
    }
    updateFields.departmentId = departmentId;
  }

  const updated = await AdminTaskModel.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
    context: "query",
  });

  if (!updated) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Task not found" });
  }

  res.status(StatusCodes.OK).json({ task: updated });
};

// Delete a task
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid Task ID" });
  }

  const deleted = await AdminTaskModel.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Task not found" });
  }

  res.status(StatusCodes.OK).json({ msg: "Task deleted successfully" });
};
