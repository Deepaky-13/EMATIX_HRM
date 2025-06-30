import DepartmentModel from "../../model/Department/DepartmentModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

// Creating the Departments
export const createDepartment = async (req, res) => {
  const department = await DepartmentModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ department });
};

//Getting all the departments
export const getAllDepartments = async (req, res) => {
  const departments = await DepartmentModel.find({});
  res.status(StatusCodes.OK).json({ departments });
};

// Update department by ID
export const updateDepartmentById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid department ID" });
  }

  const updatedDepartment = await DepartmentModel.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedDepartment) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Department not found" });
  }

  res.status(StatusCodes.OK).json({ updatedDepartment });
};

// Delete department by ID
export const deleteDepartmentById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid department ID" });
  }

  const deletedDepartment = await DepartmentModel.findByIdAndDelete(id);

  if (!deletedDepartment) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Department not found" });
  }

  res.status(StatusCodes.OK).json({ msg: "Department deleted successfully" });
};

// Get department by ID
export const getDepartmentById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid department ID" });
  }

  const department = await DepartmentModel.findById(id);

  if (!department) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Department not found" });
  }

  res.status(StatusCodes.OK).json({ department });
};
