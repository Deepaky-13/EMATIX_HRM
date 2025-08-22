import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import RoleModel from "../../model/Roles/RoleModel.js";
import DepartmentModel from "../../model/Department/DepartmentModel.js";

// Create a new role
export const createRole = async (req, res) => {
  const { empId, name, role, department_name, DOB, anniversaryDate } = req.body;

  // 1. Check if department exists
  const departmentDoc = await DepartmentModel.findOne({
    department_name: department_name,
  });

  if (!departmentDoc) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Department not found" });
  }

  // Generate email
  const trimmedName = name.trim().toLowerCase().replace(/\s+/g, "");
  const email = `${trimmedName}ematix@gmail.com`;

  // 2. Create role with provided data
  const newRole = await RoleModel.create({
    empId,
    name,
    email,
    role,
    departmentId: departmentDoc._id,
    DOB,
    anniversaryDate,
  });

  res.status(StatusCodes.CREATED).json({ role: newRole });
};

// Get all roles
export const getAllRoles = async (req, res) => {
  const roles = await RoleModel.find({}).populate({
    path: "departmentId",
    select: "department_name _id",
  });

  res.status(StatusCodes.OK).json({ roles });
};

// Update role by ID
export const updateRoleById = async (req, res) => {
  const { id } = req.params;
  const { department_name, ...rest } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid role ID" });
  }

  let departmentIdToSet;

  if (department_name) {
    const departmentDoc = await DepartmentModel.findOne({
      department_name: {
        $regex: new RegExp(`^${department_name.trim()}$`, "i"),
      },
    });

    if (!departmentDoc) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Department not found" });
    }

    departmentIdToSet = departmentDoc._id;
  }

  const updateData = {
    ...rest,
    ...(departmentIdToSet && { departmentId: departmentIdToSet }),
  };

  const updatedRole = await RoleModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedRole) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Invalid role id" });
  }

  res.status(StatusCodes.OK).json({ updatedRole });
};

// Delete role by ID
export const deleteRoleById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid role ID" });
  }

  const deletedRole = await RoleModel.findByIdAndDelete(id);

  if (!deletedRole) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Department not found" });
  }

  res.status(StatusCodes.OK).json({ msg: "Role deleted successfully" });
};

// Toggle active status
export const toggleUserStatus = async (req, res) => {
  const { id } = req.params;

  const user = await RoleModel.findById(id);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(StatusCodes.OK).json({
    msg: `User ${user.isActive ? "enabled" : "disabled"} successfully`,
    user,
  });
};

// Update password
export const updatePassword = async (req, res) => {
  const { userId } = req.user;
  const { password, DOB, anniversaryDate } = req.body;

  if (!password || password.length < 4) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Password must be at least 4 characters long" });
  }

  const user = await RoleModel.findById(userId);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
  }

  // Update fields
  user.password = password;
  if (DOB) user.DOB = DOB;
  if (anniversaryDate) user.anniversaryDate = anniversaryDate;

  await user.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "Password and details updated successfully" });
};

// Get role by ID (optional)

export const getRoleById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid role ID" });
  }

  const role = await RoleModel.findById(id).populate({
    path: "departmentId",
    select: "department_name",
  });

  if (!role) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Role not found" });
  }

  res.status(StatusCodes.OK).json({ role });
};
